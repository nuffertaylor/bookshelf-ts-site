import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { book, defaultProps, foundBook, ShelfSource } from '../types/interfaces';
import { fetchHardcoverShelf, fetchHardcoverShelves, hardcoverShelfErrorMessage, hardcoverShelfOption, startHardcoverAuth } from '../utils/hardcover';
import { getCookie } from '../utils/utilities';
import { Create } from './Create';
import { Found } from './Found';
import { Loading } from './Loading';

type pickerStatus = "loading" | "ready" | "connect" | "signin" | "error";

// Lets a signed-in user build a shelf from one of their Hardcover lists (status shelves like "Read" included).
export function HardcoverShelfPicker({ widgetCallback } : defaultProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const signedIn = !!getCookie("authtoken");
  const [status, setStatus] = useState<pickerStatus>(signedIn ? "loading" : "signin");
  const [shelves, setShelves] = useState<hardcoverShelfOption[]>([]);
  const [shelf, setShelf] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const loadShelves = () => {
    setStatus("loading");
    fetchHardcoverShelves((r) => {
      switch(r.kind){
        case "ok":
          if(r.shelves.length === 0){
            setMessage("No lists were found in your Hardcover library.");
            setStatus("error");
            return;
          }
          setShelves(r.shelves);
          setShelf((r.shelves.find(s => s.name.toLowerCase() === "read") ?? r.shelves[0]).id);
          setStatus("ready");
          return;
        case "needs_connect":
          setStatus("connect");
          return;
        case "session_expired":
          setMessage("Your session expired. Please log in again.");
          setStatus("signin");
          return;
        default:
          setMessage(r.message);
          setStatus("error");
      }
    });
  };

  useEffect(() => {
    if(signedIn) loadShelves();
  // eslint-disable-next-line
  }, []);

  const goToHardcover = (mode : "login" | "link") => {
    setRedirecting(true);
    startHardcoverAuth(mode, "create", () => setRedirecting(false));
  };

  const loadShelf = () => {
    if(!shelf){
      toast.error("Please choose a list.");
      return;
    }
    const source : ShelfSource = { kind : "hardcover", shelf };
    widgetCallback(<Loading/>);
    fetchHardcoverShelf(shelf, (res) => {
      const body = res.body;
      if(res.statusCode === 200 && typeof body === 'object' && 'found' in body){
        // Backend returns an array of spine options for each book - default to the first option
        const foundWithOptions : Array<foundBook[]> = body.found;
        const found : Array<foundBook> = foundWithOptions.map(spineOptions => spineOptions[0]);
        const unfound : Array<book> = body.unfound;
        widgetCallback(<Found found={found} foundOptions={foundWithOptions} unfound={unfound} widgetCallback={widgetCallback} source={source}/>);
        return;
      }
      toast.error(hardcoverShelfErrorMessage(res).message);
      widgetCallback(<Create widgetCallback={widgetCallback} initialSource="hardcover"/>);
    });
  };

  if(redirecting || status === "loading") return <Loading/>;

  if(status === "signin"){
    return (
      <div className="bs_input_section">
        {message && <p className="bs_csv_help">{message}</p>}
        <p className="bs_csv_help">Sign in with Hardcover to build a shelf from one of your Hardcover lists.</p>
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
        <p className="bs_csv_help">Connect your Hardcover account to build shelves from your Hardcover lists.</p>
        <button className="bs_button bs_file_button bs_hardcover_button" onClick={() => goToHardcover("link")}>Connect Hardcover</button>
      </div>
    );
  }

  if(status === "error"){
    return (
      <div className="bs_input_section">
        <p className="bs_csv_help">{message}</p>
        <button className="bs_button bs_file_button" onClick={loadShelves}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="bs_input_section">
      <label htmlFor="hardcover_shelfname" className="bs_shelf_label">Available Lists</label>
      <select
        id="hardcover_shelfname"
        className={"bs_text_input bs_text_input_".concat(colorScheme)}
        value={shelf}
        onChange={e => setShelf(e.target.value)}
      >
        {shelves.map(s => <option key={s.id} value={s.id}>{s.name} ({s.count})</option>)}
      </select>
      <button className="bs_button" onClick={loadShelf}>LOAD LIST</button>
    </div>
  );
}
