import React from 'react';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import NeedAuthentication from '../pages/NeedAuthentication';
import { HardcoverCallback } from '../pages/HardcoverCallback';
import { startHardcoverAuth } from '../utils/hardcover';
import { sendGetRequestToServer, sendPostRequestToServer } from '../utils/utilities';

jest.mock('client-info', () => ({ getBrowser : () => ({ os : "test", name : "test" }) }), { virtual : true });
jest.mock('../utils/utilities', () => ({
  ...jest.requireActual('../utils/utilities'),
  sendPostRequestToServer : jest.fn(),
  sendGetRequestToServer : jest.fn()
}));
jest.mock('../utils/hardcover', () => ({ ...jest.requireActual('../utils/hardcover'), startHardcoverAuth : jest.fn() }));
jest.mock('../pages/HardcoverBookSearch', () => ({ HardcoverBookSearch : () => <div>book search</div> }));
jest.mock('../pages/Create', () => ({ Create : () => <div>create page</div> }));
jest.mock('../pages/Profile', () => ({ Profile : () => <div>profile page</div> }));
jest.mock('../ResponsiveHeader', () => ({
  ResponsiveHeader : (props : any) => <button onClick={() => props.headerClick("/contribute")}>go contribute</button>
}));
jest.mock('../FooterCentered', () => ({ FooterCentered : () => null }));

const mockedPost = sendPostRequestToServer as jest.Mock;
const mockedGet = sendGetRequestToServer as jest.Mock;
const mockedAuth = startHardcoverAuth as jest.Mock;

const clearCookies = () => ["authtoken", "username"].forEach(c => { document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; });

beforeEach(() => {
  mockedPost.mockReset();
  mockedGet.mockReset();
  mockedAuth.mockReset();
  mockedPost.mockImplementation(() => {});
  mockedGet.mockImplementation((_p : string, _q : string, cb : (r : string) => void) => cb(JSON.stringify({ statusCode : 200, valid_authtoken : true })));
  clearCookies();
});

describe("/contribute", () => {
  it("renders the Hardcover search for a signed-in user", () => {
    document.cookie = "authtoken=t"; document.cookie = "username=u";
    render(<App/>);
    fireEvent.click(screen.getByText("go contribute"));
    expect(screen.getByText("book search")).toBeInTheDocument();
  });

  it("renders NeedAuthentication when signed out", () => {
    render(<App/>);
    fireEvent.click(screen.getByText("go contribute"));
    expect(screen.getByText("Log in to contribute")).toBeInTheDocument();
    expect(screen.queryByText("book search")).toBeNull();
  });
});

describe("NeedAuthentication", () => {
  it("signs in with Hardcover and returns to contribute", () => {
    render(<NeedAuthentication widgetCallback={jest.fn()} setLoginStatus={jest.fn()}/>);
    fireEvent.click(screen.getByText("hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("login", "contribute", expect.any(Function));
  });

  it("uses the returnTo prop when given", () => {
    render(<NeedAuthentication widgetCallback={jest.fn()} setLoginStatus={jest.fn()} returnTo="create"/>);
    fireEvent.click(screen.getByText("hardcover"));
    expect(mockedAuth).toHaveBeenCalledWith("login", "create", expect.any(Function));
  });
});

describe("HardcoverCallback with a contribute return target", () => {
  // The callback page only handles one callback per page load (module state), so the sign-in case is in contributeLoginCallback.test.tsx.
  it("shows the search after linking", async () => {
    sessionStorage.setItem("hardcover_oauth_state", "st");
    sessionStorage.setItem("hardcover_oauth_mode", "link");
    sessionStorage.setItem("hardcover_oauth_return", "contribute");
    window.history.pushState({}, "", "/oauth/callback?code=c&state=st&iss=i");
    mockedPost.mockImplementation((_p : string, _d : unknown, cb : (r : string) => void) => cb(JSON.stringify({ statusCode : 200, body : { linked : true, hardcover_username : "hc" } })));
    const widgetCallback = jest.fn();
    render(<HardcoverCallback widgetCallback={widgetCallback} setLoginStatus={jest.fn()}/>);
    await waitFor(() => expect(widgetCallback).toHaveBeenCalledTimes(2));
    expect(widgetCallback.mock.calls[1][0].type.name).toBe("HardcoverBookSearch");
  });
});

describe("FetchGoodreads deprecation", () => {
  it("is not imported anywhere", () => {
    const walk = (dir : string) : string[] => fs.readdirSync(dir, { withFileTypes : true }).flatMap(e =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    const offenders = walk(path.join(__dirname, "..")).filter(f =>
      /\.(ts|tsx)$/.test(f) && !f.endsWith("FetchGoodreads.tsx") && !f.endsWith("contributeWiring.test.tsx") && /from\s+['"].*FetchGoodreads['"]/.test(fs.readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
