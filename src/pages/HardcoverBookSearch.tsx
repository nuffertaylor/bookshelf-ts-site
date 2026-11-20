import React, { useContext, useEffect, useRef, useState } from 'react';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { defaultProps } from '../types/interfaces';
import { hardcoverSearchResult, searchHardcoverBooks, startHardcoverAuth } from '../utils/hardcover';
import { getCookie } from '../utils/utilities';
import { Loading } from './Loading';
import { Upload } from './Upload';

type searchStatus = "signin" | "expired" | "connect" | "idle" | "searching" | "results" | "empty" | "error";

export const SEARCH_MIN_CHARS = 3;
export const CACHE_TTL_MS = 60000;
const CACHE_LIMIT = 20;
export const CONNECT_ATTEMPT_KEY = "hardcover_search_connect_attempt";
export const NO_ACCESS_MESSAGE = "Hardcover didn't grant search access. Please try again later or contact support.";

// Lives outside the component so going into Upload and coming back doesn't spend another request.
// Keys include the username so one user never sees another's results (including their already_uploaded flags).
const searchCache = new Map<string, { results : hardcoverSearchResult[], at : number }>();
const cacheKey = (q : string) => (getCookie("username") || "") + "\n" + q;
const cacheGet = (q : string) => {
  const key = cacheKey(q);
  const entry = searchCache.get(key);
  if(!entry) return undefined;
  if(Date.now() - entry.at > CACHE_TTL_MS){ searchCache.delete(key); return undefined; }
  return entry.results;
};
const cacheSet = (q : string, results : hardcoverSearchResult[]) => {
  if(searchCache.size >= CACHE_LIMIT) searchCache.delete(searchCache.keys().next().value as string);
  searchCache.set(cacheKey(q), { results, at : Date.now() });
};
// After a successful upload, flag the book in this user's cached lists so the tag shows when the search comes back.
const markUploaded = (hardcoverBookId : number) => {
  const prefix = cacheKey("");
  searchCache.forEach((entry, key) => {
    if(!key.startsWith(prefix)) return;
    entry.results = entry.results.map(r => r.hardcover_book_id === hardcoverBookId ? { ...r, already_uploaded : true } : r);
  });
};
export function clearHardcoverSearchCache(){ searchCache.clear(); }

interface hardcoverBookSearchProps extends defaultProps {
  initialQuery ?: string
}

const yearOf = (pubDate ?: unknown) => String(pubDate ?? "").match(/\d{4}/)?.[0] ?? "";

// Lets a signed-in user with Hardcover linked find a book to contribute a spine for.
export function HardcoverBookSearch({ widgetCallback, initialQuery = "" } : hardcoverBookSearchProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const signedIn = !!getCookie("authtoken");
  const linked = !!getCookie("hardcover_username");
  const [status, setStatus] = useState<searchStatus>(!signedIn ? "signin" : !linked ? "connect" : "idle");
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<hardcoverSearchResult[]>([]);
  const [message, setMessage] = useState<string>("");
  const [needsReconnect, setNeedsReconnect] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const requestId = useRef<number>(0);
  const lastQuery = useRef<string>("");
  const listRef = useRef<HTMLUListElement>(null);
  const canSearch = signedIn && linked;

  const showResults = (list : hardcoverSearchResult[]) => {
    setResults(list);
    setStatus(list.length === 0 ? "empty" : "results");
  };

  const runSearch = (raw : string, force : boolean = false) => {
    const q = raw.trim();
    if(q.length < SEARCH_MIN_CHARS) return;
    if(!force && q === lastQuery.current && (status === "results" || status === "empty" || status === "searching")) return;
    lastQuery.current = q;
    setNeedsReconnect(false);
    const cached = cacheGet(q);
    if(cached){
      requestId.current++;   // a slower request still in flight must not overwrite this
      showResults(cached);
      return;
    }
    const id = ++requestId.current;
    setStatus("searching");
    searchHardcoverBooks(q, (r) => {
      if(id !== requestId.current) return;   // a newer search or edit superseded this one
      switch(r.kind){
        case "ok":
          sessionStorage.removeItem(CONNECT_ATTEMPT_KEY);
          cacheSet(q, r.results);
          showResults(r.results);
          return;
        case "needs_connect":
          lastQuery.current = "";
          if(sessionStorage.getItem(CONNECT_ATTEMPT_KEY)){
            // We already sent them through Hardcover and it still doesn't work; another round trip would loop.
            setNeedsReconnect(false);
            setMessage(NO_ACCESS_MESSAGE);
          }
          else {
            setNeedsReconnect(true);
            setMessage("Your Hardcover connection needs to be refreshed to search.");
          }
          setStatus("error");
          return;
        case "session_expired":
          lastQuery.current = "";
          setMessage("Your session expired. Please log in again.");
          setStatus("expired");
          return;
        default:
          lastQuery.current = "";
          setMessage(r.message);
          setStatus("error");
      }
    });
  };

  // Restore cached results when returning from Upload.
  useEffect(() => {
    if(!canSearch || !initialQuery) return;
    const cached = cacheGet(initialQuery.trim());
    if(cached){
      lastQuery.current = initialQuery.trim();
      showResults(cached);
    }
  }, [canSearch, initialQuery]);

  const goToHardcover = (mode : "login" | "link") => {
    setRedirecting(true);
    if(mode === "link") sessionStorage.setItem(CONNECT_ATTEMPT_KEY, "1");
    startHardcoverAuth(mode, "contribute", () => {
      sessionStorage.removeItem(CONNECT_ATTEMPT_KEY);   // never left the page
      setRedirecting(false);
    });
  };

  const pick = (r : hardcoverSearchResult) => {
    const q = lastQuery.current;
    // Upload calls originCallback(true, id) after a successful upload.
    const originCallback = (uploaded ?: boolean) => {
      if(uploaded === true) markUploaded(r.hardcover_book_id);
      widgetCallback(<HardcoverBookSearch widgetCallback={widgetCallback} initialQuery={q}/>);
    };
    widgetCallback(
      <Upload
        widgetCallback={widgetCallback}
        originCallback={originCallback}
        prefill={{ book_id : "", hardcover_book_id : r.hardcover_book_id, title : r.title, author : r.author ?? "", pubDate : yearOf(r.pubDate), isbn : String(r.isbn ?? ""), isbn13 : String(r.isbn13 ?? "") }}
      />
    );
  };

  const focusResult = (index : number) => {
    const items = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if(items && items.length) items[Math.max(0, Math.min(index, items.length - 1))].focus();
  };
  const onResultKeyDown = (e : React.KeyboardEvent<HTMLButtonElement>, index : number) => {
    if(e.key === "ArrowDown"){ e.preventDefault(); focusResult(index + 1); }
    else if(e.key === "ArrowUp"){
      e.preventDefault();
      if(index === 0) document.getElementById("hardcover_search_input")?.focus();
      else focusResult(index - 1);
    }
  };

  if(redirecting) return <Loading/>;

  if(status === "signin" || status === "expired"){
    return (
      <div className="bs_input_section">
        <p className="bs_csv_help" role={status === "expired" ? "status" : undefined}>{status === "expired" ? message : "Sign in with Hardcover to contribute spines."}</p>
        <button className="bs_button bs_file_button bs_hardcover_button" onClick={() => goToHardcover("login")}>Sign in with Hardcover</button>
        <p className="bs_csv_help">
          Already have a My Bookshelf account?{" "}
          <span className={"a_ a_".concat(colorScheme)} onClick={() => document.getElementById("login")?.click()}>Log in with your password</span>
          , then link Hardcover from your profile.
        </p>
      </div>
    );
  }

  if(status === "connect"){
    return (
      <div className="bs_input_section">
        <p className="bs_csv_help">Link Hardcover to contribute</p>
        <button className="bs_button bs_file_button bs_hardcover_button" onClick={() => goToHardcover("link")}>Connect Hardcover</button>
      </div>
    );
  }

  return (
    <div className="bs_input_section">
      <input
        id="hardcover_search_input"
        aria-label="Search Hardcover by title"
        type="text"
        placeholder="Search by title"
        className={"bs_text_input bs_text_input_".concat(colorScheme)}
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          requestId.current++;
          lastQuery.current = "";
          setStatus("idle");
          setNeedsReconnect(false);
        }}
        onKeyDown={e => {
          if(e.key === "Enter" && !e.nativeEvent.isComposing){
            e.preventDefault();
            runSearch(query, status === "error");
          }
          if(e.key === "ArrowDown" && status === "results"){ e.preventDefault(); focusResult(0); }
        }}
      />
      <button type="button" className="bs_button" onClick={() => runSearch(query, status === "error")}>Search</button>
      {status === "searching" && <div role="status" aria-live="polite" aria-label="Searching"><Loading/></div>}
      {status === "empty" && <p className="bs_csv_help" role="status" aria-live="polite">No matches. Try adding the author or more of the title.</p>}
      {status === "error" && (
        <div className="bs_input_section">
          <p className="bs_csv_help" role="status" aria-live="polite">{message}</p>
          {needsReconnect && <button className="bs_button bs_file_button bs_hardcover_button" onClick={() => goToHardcover("link")}>Connect Hardcover</button>}
        </div>
      )}
      {status === "results" && (
        <ul className="bs_search_results" ref={listRef}>
          {results.map((r, i) => (
            <li key={r.hardcover_book_id + ":" + i}>
              <button className={"bs_search_result bs_search_result_".concat(colorScheme)} onClick={() => pick(r)} onKeyDown={e => onResultKeyDown(e, i)}>
                <div className="bs_search_result_title">
                  {r.title}{r.subtitle && <span className="bs_search_result_meta">{": " + r.subtitle}</span>}
                </div>
                <div className="bs_search_result_meta">{[r.author, yearOf(r.pubDate)].filter(Boolean).join(" · ")}</div>
                {r.already_uploaded && <span className={"bs_search_result_tag bs_search_result_tag_".concat(colorScheme)}>You've uploaded this</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
