import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { HardcoverCallback } from '../pages/HardcoverCallback';
import { sendPostRequestToServer } from '../utils/utilities';

jest.mock('../utils/utilities', () => ({ ...jest.requireActual('../utils/utilities'), sendPostRequestToServer : jest.fn() }));
jest.mock('../pages/HardcoverBookSearch', () => ({ HardcoverBookSearch : () => <div>book search</div> }));
jest.mock('../pages/Create', () => ({ Create : () => <div>create page</div> }));
jest.mock('../pages/Profile', () => ({ Profile : () => <div>profile page</div> }));

// Kept apart from the link case because HardcoverCallback only handles one callback per page load (module state).
it("shows the search after signing in with Hardcover from Contribute", async () => {
  sessionStorage.setItem("hardcover_oauth_state", "st");
  sessionStorage.setItem("hardcover_oauth_mode", "login");
  sessionStorage.setItem("hardcover_oauth_return", "contribute");
  window.history.pushState({}, "", "/oauth/callback?code=c&state=st&iss=i");
  (sendPostRequestToServer as jest.Mock).mockImplementation((_p : string, _d : unknown, cb : (r : string) => void) =>
    cb(JSON.stringify({ statusCode : 200, body : { username : "u", authtoken : "t", hardcover_username : "hc" } })));
  const widgetCallback = jest.fn();
  const setLoginStatus = jest.fn();
  render(<HardcoverCallback widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>);
  await waitFor(() => expect(widgetCallback).toHaveBeenCalledTimes(2));
  expect(widgetCallback.mock.calls[1][0].type.name).toBe("HardcoverBookSearch");
  expect(setLoginStatus).toHaveBeenCalledWith("profile");
});
