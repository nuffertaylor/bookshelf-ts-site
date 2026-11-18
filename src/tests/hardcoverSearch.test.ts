import { searchHardcoverBooks, hardcoverSearchOutcome, startHardcoverAuth, takePendingHardcoverAuth } from '../utils/hardcover';
import { sendPostRequestToServer } from '../utils/utilities';

jest.mock('../utils/utilities', () => ({
  ...jest.requireActual('../utils/utilities'),
  sendPostRequestToServer: jest.fn()
}));
const mockedSend = sendPostRequestToServer as jest.Mock;

// Makes the mocked server answer with the given raw response string.
const respondWith = (res : string) => mockedSend.mockImplementation((_path : string, _data : unknown, cb : (r : string) => void) => cb(res));
const reply = (statusCode : number, body : unknown) => respondWith(JSON.stringify({ statusCode, body }));
const search = () : hardcoverSearchOutcome => {
  let out : hardcoverSearchOutcome | undefined;
  searchHardcoverBooks("hail mary", r => { out = r; });
  return out!;
};

beforeEach(() => { mockedSend.mockReset(); document.cookie = "username=tay"; document.cookie = "authtoken=tok"; });

describe("searchHardcoverBooks", () => {
  it("posts the query with the session cookies to hardcover/search", () => {
    reply(200, { results : [] });
    search();
    expect(mockedSend).toHaveBeenCalledWith("hardcover/search", { username : "tay", authtoken : "tok", query : "hail mary" }, expect.any(Function));
  });

  it("maps a 200 to ok with the results", () => {
    const results = [{ hardcover_book_id : 1, title : "Project Hail Mary", author : "Andy Weir", pubDate : "2021", already_uploaded : false }];
    reply(200, { results });
    expect(search()).toEqual({ kind : "ok", results });
  });

  it("drops items without a numeric id and a string title, and coerces the rest", () => {
    reply(200, { results : [
      null, "x", 7, { title : "No id" }, { hardcover_book_id : "3", title : "String id" }, { hardcover_book_id : null, title : "Null id" },
      { hardcover_book_id : 4 }, { hardcover_book_id : 5, title : 9 },
      { hardcover_book_id : 6, title : "Good", pubDate : 1999, author : null, isbn : {}, already_uploaded : "yes" }
    ] });
    expect(search()).toEqual({ kind : "ok", results : [{ hardcover_book_id : 6, title : "Good", pubDate : "1999", already_uploaded : false }] });
  });

  it("maps 401 hardcover_reauth_required to needs_connect", () => {
    reply(401, { error : "hardcover_reauth_required" });
    expect(search()).toEqual({ kind : "needs_connect" });
  });

  it("maps 403 to session_expired", () => {
    reply(403, "forbidden");
    expect(search()).toEqual({ kind : "session_expired" });
  });

  it("maps 429 to a rate limited error", () => {
    reply(429, {});
    const out = search();
    expect(out.kind).toBe("error");
    expect(out).toMatchObject({ rateLimited : true });
  });

  it("maps 502 to an error with the backend's message", () => {
    reply(502, { error : "Hardcover is unreachable" });
    expect(search()).toEqual({ kind : "error", message : "Hardcover is unreachable" });
  });

  it("maps a 502 with no message to a generic error", () => {
    reply(502, {});
    const out = search();
    expect(out.kind).toBe("error");
    expect((out as { message : string }).message).not.toBe("");
  });

  it("treats a non-JSON response as an error", () => {
    respondWith("<html>bad gateway</html>");
    expect(search().kind).toBe("error");
  });

  it("treats a 200 with no results array as an error instead of crashing", () => {
    reply(200, {});
    expect(search().kind).toBe("error");
    reply(200, { results : "nope" });
    expect(search().kind).toBe("error");
    reply(200, "ok");
    expect(search().kind).toBe("error");
  });
});

describe("contribute return target", () => {
  it("round-trips through startHardcoverAuth and takePendingHardcoverAuth", () => {
    const assign = jest.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', { configurable : true, value : { ...original, assign } });
    respondWith(JSON.stringify({ statusCode : 200, body : { authorize_url : "https://hardcover.app/oauth", state : "s1" } }));
    startHardcoverAuth("link", "contribute");
    Object.defineProperty(window, 'location', { configurable : true, value : original });
    expect(assign).toHaveBeenCalledWith("https://hardcover.app/oauth");
    expect(takePendingHardcoverAuth()).toEqual({ state : "s1", mode : "link", returnTo : "contribute" });
    expect(takePendingHardcoverAuth()).toBeNull();
  });

  it("still defaults unknown return targets to create", () => {
    sessionStorage.setItem("hardcover_oauth_state", "s");
    sessionStorage.setItem("hardcover_oauth_mode", "login");
    sessionStorage.setItem("hardcover_oauth_return", "bogus");
    expect(takePendingHardcoverAuth()?.returnTo).toBe("create");
  });
});
