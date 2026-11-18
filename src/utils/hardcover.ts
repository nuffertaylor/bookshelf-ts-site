import { toast } from 'react-toastify';
import { book, foundBook } from '../types/interfaces';
import { deleteCookie, getCookie, sendPostRequestToServer, setCookie } from './utilities';

// sessionStorage keys that survive the redirect to Hardcover and back.
const STATE_KEY = "hardcover_oauth_state";
const MODE_KEY = "hardcover_oauth_mode";
const RETURN_KEY = "hardcover_oauth_return";

export type HardcoverAuthMode = "login" | "link";
// Where to land after Hardcover sends the user back to the site.
export type HardcoverReturn = "create" | "profile" | "contribute";

export interface hardcoverShelfOption {
  id : string,    // "status:3" or "list:456"
  name : string,
  count : number
}

interface apiResponse<T> {
  statusCode : number,
  body : T | { error ?: string } | string
}

// Parses an API response, tolerating empty or non-JSON bodies (network errors, gateway errors).
export function parseApiResponse<T>(res : string) : apiResponse<T> {
  try { return JSON.parse(res); }
  catch { return { statusCode : 500, body : {} }; }
}

export function apiErrorText(res : apiResponse<unknown>) : string {
  const body = res.body;
  if(typeof body === 'string') return body;
  const err = body && typeof body === 'object' ? (body as { error ?: unknown }).error : undefined;
  return typeof err === 'string' ? err : "";
}

// Friendly text for the error codes the backend returns when linking or signing in.
export function hardcoverAuthErrorMessage(res : apiResponse<unknown>) : string {
  const err = apiErrorText(res);
  switch(err){
    // TODO: Let users merge accounts. A legacy user who signed in with Hardcover first has two accounts, and this error leaves them stuck. Needs backend support too (see _handle_link in the backend's hardcover_auth_callback handler).
    case "hardcover_already_linked":
      return "That Hardcover account is already linked to a different My Bookshelf account.";
    case "account_linked_to_different_hardcover":
      return "Your My Bookshelf account is already linked to a different Hardcover account.";
    default:
      return err || "Something went wrong with Hardcover sign-in, please try again.";
  }
}

export function hasHardcoverState() : boolean {
  return !!sessionStorage.getItem(STATE_KEY);
}

// Asks the backend for a Hardcover authorize URL and sends the browser there. The `state` is kept in
// sessionStorage so the callback page can check it before trusting anything in the URL.
export function startHardcoverAuth(mode : HardcoverAuthMode, returnTo : HardcoverReturn, onFailure ?: () => void){
  const data : { mode : string, username ?: string, authtoken ?: string } = { mode };
  if(mode === "link"){
    data.username = getCookie("username");
    data.authtoken = getCookie("authtoken");
  }
  const fail = (message : string) => { toast.error(message); if(onFailure) onFailure(); };
  sendPostRequestToServer("auth/hardcover/start", data, (res : string) => {
    const parsed = parseApiResponse<{ authorize_url : string, state : string }>(res);
    const body = parsed.body;
    if(parsed.statusCode !== 200 || typeof body !== 'object' || !('authorize_url' in body) || !body.authorize_url || !body.state){
      fail(apiErrorText(parsed) || "Couldn't start Hardcover sign-in, please try again.");
      return;
    }
    sessionStorage.setItem(STATE_KEY, body.state);
    sessionStorage.setItem(MODE_KEY, mode);
    sessionStorage.setItem(RETURN_KEY, returnTo);
    window.location.assign(body.authorize_url);
  });
}

// Reads and clears the pending sign-in. Returns null if none was started in this browser tab.
export function takePendingHardcoverAuth() : { state : string, mode : HardcoverAuthMode, returnTo : HardcoverReturn } | null {
  const state = sessionStorage.getItem(STATE_KEY);
  const mode = sessionStorage.getItem(MODE_KEY);
  const storedReturn = sessionStorage.getItem(RETURN_KEY);
  const returnTo : HardcoverReturn = storedReturn === "profile" || storedReturn === "contribute" ? storedReturn : "create";
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(MODE_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  if(!state || (mode !== "login" && mode !== "link")) return null;
  return { state, mode, returnTo };
}

export function setHardcoverUsername(name : string | undefined | null){
  if(name) setCookie("hardcover_username", name);
}

// Remembers whether this account has Hardcover linked (and whether it needs reconnecting), from a login response.
export function setHardcoverLink(name : string | undefined | null, needsReauth ?: boolean){
  if(!name){
    deleteCookie("hardcover_username");
    deleteCookie("hardcover_needs_reauth");
    return;
  }
  setCookie("hardcover_username", name);
  if(needsReauth) setCookie("hardcover_needs_reauth", "1");
  else deleteCookie("hardcover_needs_reauth");
}

export type hardcoverLibraryResult =
  | { kind : "ok", shelves : hardcoverShelfOption[] }
  | { kind : "needs_connect" }       // never linked, or the connection was revoked/expired: reconnect
  | { kind : "session_expired" }     // the My Bookshelf session itself is no longer valid
  | { kind : "error", message : string };

function libraryFailure(res : apiResponse<unknown>) : hardcoverLibraryResult {
  if(res.statusCode === 401 && apiErrorText(res) === "hardcover_reauth_required") return { kind : "needs_connect" };
  if(res.statusCode === 403) return { kind : "session_expired" };
  if(res.statusCode === 429) return { kind : "error", message : "Hardcover is rate limiting requests. Please try again in a minute." };
  return { kind : "error", message : apiErrorText(res) || "Something went wrong talking to Hardcover, please try again." };
}

export function fetchHardcoverShelves(callback : (r : hardcoverLibraryResult) => void){
  const data = { username : getCookie("username"), authtoken : getCookie("authtoken") };
  sendPostRequestToServer("hardcover/shelves", data, (res : string) => {
    const parsed = parseApiResponse<{ shelves : hardcoverShelfOption[] }>(res);
    const body = parsed.body;
    if(parsed.statusCode === 200 && typeof body === 'object' && 'shelves' in body && Array.isArray(body.shelves)){
      callback({ kind : "ok", shelves : body.shelves });
      return;
    }
    callback(libraryFailure(parsed));
  });
}

export interface hardcoverShelfResponse {
  statusCode : number,
  body : { found : foundBook[][], unfound : book[] } | { error ?: string } | string
}

// The same {found, unfound} shape as the Goodreads CSV import.
export function fetchHardcoverShelf(shelf : string, callback : (res : hardcoverShelfResponse) => void){
  const data = { username : getCookie("username"), authtoken : getCookie("authtoken"), shelf };
  sendPostRequestToServer("hardcover/shelf", data, (res : string) => {
    callback(parseApiResponse<hardcoverShelfResponse["body"]>(res) as hardcoverShelfResponse);
  });
}

// Message to show when loading a Hardcover shelf failed.
export function hardcoverShelfErrorMessage(res : hardcoverShelfResponse) : { message : string, needsConnect : boolean } {
  const f = libraryFailure(res);
  if(f.kind === "needs_connect") return { message : "Your Hardcover connection needs to be refreshed. Please connect Hardcover again.", needsConnect : true };
  if(f.kind === "session_expired") return { message : "Your session expired, please log in again.", needsConnect : false };
  if(f.kind === "error") return { message : f.message, needsConnect : false };
  return { message : "Something went wrong, please try again later.", needsConnect : false };
}

export interface hardcoverSearchResult {
  hardcover_book_id : number,
  title : string,
  subtitle ?: string,
  author ?: string,
  pubDate ?: string,
  isbn ?: string,
  isbn13 ?: string,
  already_uploaded : boolean
}

export type hardcoverSearchOutcome =
  | { kind : "ok", results : hardcoverSearchResult[] }
  | { kind : "needs_connect" }
  | { kind : "session_expired" }
  | { kind : "error", message : string, rateLimited ?: boolean };

const optionalText = (v : unknown) => (typeof v === "string" || typeof v === "number") ? String(v) : undefined;
// Drops anything that isn't a usable book and coerces the rest, so an odd item can't crash the list.
function cleanSearchResult(item : unknown) : hardcoverSearchResult[] {
  if(!item || typeof item !== "object") return [];
  const r = item as Record<string, unknown>;
  if(typeof r.hardcover_book_id !== "number" || !Number.isFinite(r.hardcover_book_id) || typeof r.title !== "string") return [];
  return [{
    hardcover_book_id : r.hardcover_book_id, title : r.title,
    subtitle : optionalText(r.subtitle), author : optionalText(r.author), pubDate : optionalText(r.pubDate),
    isbn : optionalText(r.isbn), isbn13 : optionalText(r.isbn13), already_uploaded : r.already_uploaded === true
  }];
}

// Searches Hardcover's catalog for books matching the query, to contribute a spine for.
export function searchHardcoverBooks(query : string, callback : (r : hardcoverSearchOutcome) => void){
  const data = { username : getCookie("username"), authtoken : getCookie("authtoken"), query };
  sendPostRequestToServer("hardcover/search", data, (res : string) => {
    const parsed = parseApiResponse<{ results : hardcoverSearchResult[] }>(res);
    const body = parsed.body;
    if(parsed.statusCode === 200){
      if(body && typeof body === 'object' && 'results' in body && Array.isArray(body.results)){
        callback({ kind : "ok", results : (body.results as unknown[]).flatMap(cleanSearchResult) });
      }
      else callback({ kind : "error", message : "Got an unexpected response from the search, please try again." });
      return;
    }
    const f = libraryFailure(parsed);
    if(f.kind === "error" && parsed.statusCode === 429) callback({ ...f, rateLimited : true });
    else if(f.kind === "ok") callback({ kind : "error", message : "Something went wrong talking to Hardcover, please try again." });
    else callback(f);
  });
}
