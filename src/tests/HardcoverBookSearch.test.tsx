import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CACHE_TTL_MS, HardcoverBookSearch, clearHardcoverSearchCache } from '../pages/HardcoverBookSearch';
import { hardcoverSearchOutcome, hardcoverSearchResult, searchHardcoverBooks, startHardcoverAuth } from '../utils/hardcover';

jest.mock('../utils/hardcover', () => ({
  ...jest.requireActual('../utils/hardcover'),
  searchHardcoverBooks: jest.fn(),
  startHardcoverAuth: jest.fn()
}));
jest.mock('../pages/Upload', () => ({
  Upload: (props : any) => <div data-testid="upload" onClick={() => props.originCallback()}>upload:{props.prefill.title}</div>
}));
const mockedSearch = searchHardcoverBooks as jest.Mock;
const mockedAuth = startHardcoverAuth as jest.Mock;

let pending : { q : string, cb : (r : hardcoverSearchOutcome) => void }[] = [];
const book = (id : number, title : string, extra : Partial<hardcoverSearchResult> = {}) : hardcoverSearchResult =>
  ({ hardcover_book_id : id, title, author : "Some Author", pubDate : "2021-05-04", isbn : "1", isbn13 : "2", already_uploaded : false, ...extra });
const ok = (...results : hardcoverSearchResult[]) : hardcoverSearchOutcome => ({ kind : "ok", results });

const setCookies = (cookies : Record<string, string>) => {
  ["authtoken", "username", "hardcover_username"].forEach(c => { document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; });
  Object.entries(cookies).forEach(([k, v]) => { document.cookie = k + "=" + v; });
};
const input = () => screen.getByPlaceholderText("Search by title");
const type = (text : string) => fireEvent.change(input(), { target : { value : text } });
const search = () => fireEvent.click(screen.getByRole("button", { name : "Search" }));
const advance = (ms : number) => act(() => { jest.advanceTimersByTime(ms); });
const resolve = (i : number, r : hardcoverSearchOutcome) => act(() => { pending[i].cb(r); });
// Renders the search, and re-renders whatever it hands to widgetCallback (like App does).
const renderSearch = (initialQuery ?: string) => {
  const widgetCallback = jest.fn();
  const utils = render(<HardcoverBookSearch widgetCallback={widgetCallback} initialQuery={initialQuery}/>);
  const showWidget = () => utils.rerender(widgetCallback.mock.calls[widgetCallback.mock.calls.length - 1][0]);
  return { ...utils, widgetCallback, showWidget };
};

beforeEach(() => {
  jest.useFakeTimers();
  pending = [];
  clearHardcoverSearchCache();
  sessionStorage.clear();
  mockedSearch.mockReset();
  mockedAuth.mockReset();
  mockedSearch.mockImplementation((q, cb) => { pending.push({ q, cb }); });
  setCookies({ authtoken : "t", username : "u", hardcover_username : "h" });
});
afterEach(() => { jest.useRealTimers(); });

describe("prompts", () => {
  it("shows the sign-in prompt without an authtoken", () => {
    setCookies({});
    renderSearch();
    fireEvent.click(screen.getByText("Sign in with Hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("login", "contribute", expect.any(Function));
  });

  it("shows the link prompt when Hardcover isn't linked", () => {
    setCookies({ authtoken : "t", username : "u" });
    renderSearch();
    expect(screen.getByText("Link Hardcover to contribute")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Connect Hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("link", "contribute", expect.any(Function));
    expect(screen.queryByPlaceholderText("Search by title")).toBeNull();
  });
});

describe("manual search", () => {
  it("only submits a valid query when the Search button is clicked", () => {
    renderSearch("prefilled");
    type("ab");
    search();
    type("  dune  ");
    fireEvent.keyDown(input(), { key : "Enter" });
    advance(20000);
    expect(mockedSearch).not.toHaveBeenCalled();
    search();
    expect(mockedSearch).toHaveBeenCalledTimes(1);
    expect(pending[0].q).toBe("dune");
  });
});

describe("search results", () => {
  it("renders title, subtitle, author, year and the already-uploaded tag", () => {
    renderSearch();
    type("project"); search();
    resolve(0, ok(book(1, "Project Hail Mary", { subtitle : "A Novel", already_uploaded : true }), book(2, "Other Book")));
    expect(screen.getByText("Project Hail Mary")).toBeInTheDocument();
    expect(screen.getByText(": A Novel")).toBeInTheDocument();
    expect(screen.getAllByText("Some Author · 2021")).toHaveLength(2);
    expect(screen.getAllByText("You've uploaded this")).toHaveLength(1);
  });

  it("ignores a stale response that arrives after a newer one", () => {
    renderSearch();
    type("first"); search();
    type("second"); search();
    expect(pending.map(p => p.q)).toEqual(["first", "second"]);
    resolve(1, ok(book(2, "Second Result")));
    resolve(0, ok(book(1, "First Result")));
    expect(screen.getByText("Second Result")).toBeInTheDocument();
    expect(screen.queryByText("First Result")).toBeNull();
  });

  it("ignores a response that arrives after the query was cleared", () => {
    renderSearch();
    type("first"); search();
    type("");
    resolve(0, ok(book(1, "First Result")));
    expect(screen.queryByText("First Result")).toBeNull();
  });

  it("serves a repeat query from the cache without a request", () => {
    renderSearch();
    type("first"); search();
    resolve(0, ok(book(1, "First Result")));
    type("firs"); search();
    resolve(1, ok(book(3, "Firs Result")));
    type("first"); search();
    expect(mockedSearch).toHaveBeenCalledTimes(2);
    expect(screen.getByText("First Result")).toBeInTheDocument();
  });

  it("doesn't re-run a query identical to the last one", () => {
    renderSearch();
    type("first");
    search();
    resolve(0, ok(book(1, "First Result")));
    search();
    expect(mockedSearch).toHaveBeenCalledTimes(1);
  });

  it("shows the empty message", () => {
    renderSearch();
    type("zzzz"); search();
    resolve(0, ok());
    expect(screen.getByText("No matches. Try adding the author or more of the title.")).toBeInTheDocument();
  });

  it("shows the reconnect prompt on needs_connect", () => {
    renderSearch();
    type("first"); search();
    resolve(0, { kind : "needs_connect" });
    expect(screen.getByText("Your Hardcover connection needs to be refreshed to search.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Connect Hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("link", "contribute", expect.any(Function));
  });

  it("shows the session expired text with a login action and no Try Again", () => {
    renderSearch();
    type("first"); search();
    resolve(0, { kind : "session_expired" });
    expect(screen.getByText("Your session expired. Please log in again.")).toBeInTheDocument();
    expect(screen.queryByText("Try Again")).toBeNull();
    expect(screen.getByText("Log in with your password")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Sign in with Hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("login", "contribute", expect.any(Function));
  });

  it("labels the input and announces messages politely", () => {
    renderSearch();
    expect(screen.getByLabelText("Search Hardcover by title")).toBe(input());
    type("zzzz"); search();
    resolve(0, ok());
    expect(screen.getByText(/No matches/)).toHaveAttribute("aria-live", "polite");
  });


  it("shows a distinct message, with no connect button, when search still needs_connect after a connect attempt", () => {
    renderSearch();
    type("first"); search();
    resolve(0, { kind : "needs_connect" });
    fireEvent.click(screen.getByText("Connect Hardcover"));
    expect(sessionStorage.getItem("hardcover_search_connect_attempt")).toBe("1");
    // back from Hardcover: the page is mounted again
    cleanup();
    renderSearch();
    type("first"); search();
    resolve(1, { kind : "needs_connect" });
    expect(screen.getByText("Hardcover didn't grant search access. Please try again later or contact support.")).toBeInTheDocument();
    expect(screen.queryByText("Connect Hardcover")).toBeNull();
  });

  it("clears the connect-attempt flag after a successful search", () => {
    sessionStorage.setItem("hardcover_search_connect_attempt", "1");
    renderSearch();
    type("first"); search();
    resolve(0, ok(book(1, "First Result")));
    expect(sessionStorage.getItem("hardcover_search_connect_attempt")).toBeNull();
  });

  it("shows other errors and allows retrying with Search", () => {
    renderSearch();
    type("first"); search();
    resolve(0, { kind : "error", message : "Hardcover is down" });
    expect(screen.getByText("Hardcover is down")).toBeInTheDocument();
    search();
    expect(mockedSearch).toHaveBeenCalledTimes(2);
  });



});

describe("picking a result", () => {
  it("opens Upload prefilled for a Hardcover-only book, and going back restores the same query", () => {
    const { widgetCallback, showWidget } = renderSearch();
    type("hail"); search();
    resolve(0, ok(book(77, "Project Hail Mary")));
    fireEvent.click(screen.getByText("Project Hail Mary"));

    const upload = widgetCallback.mock.calls[0][0];
    expect(upload.props.prefill).toEqual({
      book_id : "", hardcover_book_id : 77, title : "Project Hail Mary", author : "Some Author", pubDate : "2021", isbn : "1", isbn13 : "2"
    });

    showWidget();
    expect(screen.getByTestId("upload")).toHaveTextContent("upload:Project Hail Mary");
    fireEvent.click(screen.getByTestId("upload"));   // the mock calls originCallback
    showWidget();
    expect(input()).toHaveValue("hail");
    expect(screen.getByText("Project Hail Mary")).toBeInTheDocument();   // from the cache
    expect(mockedSearch).toHaveBeenCalledTimes(1);
  });

  it("passes only the 4-digit year, and tolerates a numeric pubDate and missing isbns", () => {
    const { widgetCallback } = renderSearch();
    type("odd"); search();
    resolve(0, ok({ hardcover_book_id : 5, title : "Odd", pubDate : 1999 as any, already_uploaded : false }));
    expect(screen.getByText("1999")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Odd"));
    expect(widgetCallback.mock.calls[0][0].props.prefill).toEqual({ book_id : "", hardcover_book_id : 5, title : "Odd", author : "", pubDate : "1999", isbn : "", isbn13 : "" });
  });

  it("shows the already-uploaded tag when coming back after a successful upload", () => {
    const { widgetCallback, showWidget } = renderSearch();
    type("hail"); search();
    resolve(0, ok(book(77, "Project Hail Mary")));
    expect(screen.queryByText("You've uploaded this")).toBeNull();
    fireEvent.click(screen.getByText("Project Hail Mary"));
    showWidget();   // Upload replaces the search, as in App
    widgetCallback.mock.calls[0][0].props.originCallback(true, "up1");
    showWidget();
    expect(screen.getByText("You've uploaded this")).toBeInTheDocument();
    expect(mockedSearch).toHaveBeenCalledTimes(1);
  });

  it("doesn't tag the book when coming back without an upload", () => {
    const { widgetCallback, showWidget } = renderSearch();
    type("hail"); search();
    resolve(0, ok(book(77, "Project Hail Mary")));
    fireEvent.click(screen.getByText("Project Hail Mary"));
    showWidget();
    widgetCallback.mock.calls[0][0].props.originCallback();
    showWidget();
    expect(screen.queryByText("You've uploaded this")).toBeNull();
  });

  it("expires cached results after 60 seconds", () => {
    renderSearch();
    type("first"); search();
    resolve(0, ok(book(1, "First Result")));
    type("second"); search();
    resolve(1, ok(book(2, "Second Result")));
    advance(CACHE_TTL_MS - 2000);
    type("first"); search();
    expect(mockedSearch).toHaveBeenCalledTimes(2);   // still cached
    advance(CACHE_TTL_MS);
    type("second"); search();
    type("first"); search();
    expect(mockedSearch).toHaveBeenCalledTimes(4);   // both expired
  });

  it("doesn't serve one user's cached results to another user", () => {
    renderSearch();
    type("first"); search();
    resolve(0, ok(book(1, "First Result", { already_uploaded : true })));
    cleanup();
    setCookies({ authtoken : "t2", username : "other", hardcover_username : "h" });
    renderSearch();
    type("first"); search();
    expect(mockedSearch).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("You've uploaded this")).toBeNull();
  });

  it("moves focus through the results with the arrow keys", () => {
    renderSearch();
    type("first"); search();
    resolve(0, ok(book(1, "Alpha"), book(2, "Beta")));
    fireEvent.keyDown(input(), { key : "ArrowDown" });
    const alpha = screen.getByText("Alpha").closest("button")!;
    const beta = screen.getByText("Beta").closest("button")!;
    expect(alpha).toHaveFocus();
    fireEvent.keyDown(alpha, { key : "ArrowDown" });
    expect(beta).toHaveFocus();
    fireEvent.keyDown(beta, { key : "ArrowUp" });
    expect(alpha).toHaveFocus();
    fireEvent.keyDown(alpha, { key : "ArrowUp" });
    expect(input()).toHaveFocus();
  });
});
