import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { defaultProps } from '../types/interfaces';
import { apiErrorText, hardcoverAuthErrorMessage, parseApiResponse, setHardcoverLink, takePendingHardcoverAuth } from '../utils/hardcover';
import { sendPostRequestToServer, setCookie } from '../utils/utilities';
import { Create } from './Create';
import { HardcoverBookSearch } from './HardcoverBookSearch';
import { Landing } from './Landing';
import { Loading } from './Loading';
import { Login } from './Login';
import { Profile } from './Profile';

interface HardcoverCallbackProps extends defaultProps {
  setLoginStatus : Function
}
interface loginBody {
  username : string,
  authtoken : string,
  goodreads_id ?: string | null,
  hardcover_username ?: string,
  is_new_account ?: boolean
}
interface linkBody {
  linked : boolean,
  hardcover_username ?: string
}

// React can run an effect more than once for the same page load. The sign-in state can only be spent once,
// so a second run would see "expired or already used" and wrongly report a failure.
let callbackHandled = false;

// The page Hardcover sends the browser back to (/oauth/callback?code=...&state=...&iss=...).
export function HardcoverCallback({ widgetCallback, setLoginStatus } : HardcoverCallbackProps){
  useEffect(() => {
    if(callbackHandled) return;
    callbackHandled = true;

    const params = new URLSearchParams(window.location.search);
    // Drop the code and state from the address bar right away, so they can't be reused by reloading or sharing.
    window.history.replaceState({}, "", "/");
    const pending = takePendingHardcoverAuth();

    const returnToLanding = () => widgetCallback(<Landing widgetCallback={() => { document.getElementById("create")?.click(); }}/>);
    const abort = (message : string) => {
      toast.error(message);
      returnToLanding();
    };

    // Check that this sign-in is the one this browser started BEFORE sending anything to the backend. Without
    // this, an attacker could hand a victim a callback URL from the attacker's own Hardcover sign-in.
    const state = params.get("state");
    if(!pending || !state || state !== pending.state){
      abort("That Hardcover sign-in link has expired or didn't start here. Please try again.");
      return;
    }

    const failed = (message : string) => {
      toast.error(message);
      if(pending.mode === "login") widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>);
      else widgetCallback(<Profile widgetCallback={widgetCallback}/>);
    };

    // Hardcover reports a denied or failed sign-in with ?error=...; tell the backend so it discards the state.
    const body = params.get("error")
      ? { error : params.get("error"), error_description : params.get("error_description") ?? "", state }
      : { code : params.get("code"), state, iss : params.get("iss") };

    widgetCallback(<Loading/>);
    sendPostRequestToServer("auth/hardcover/callback", body, (res : string) => {
        const parsed = parseApiResponse<loginBody | linkBody>(res);
        const data = parsed.body;
        if(parsed.statusCode !== 200 || typeof data !== 'object'){
          failed(hardcoverAuthErrorMessage(parsed) || apiErrorText(parsed));
          return;
        }

        if(pending.mode === "link"){
          const linked = data as linkBody;
          setHardcoverLink(linked.hardcover_username);
          toast.success("Hardcover linked" + (linked.hardcover_username ? " as " + linked.hardcover_username : "") + ".");
          if(pending.returnTo === "profile") widgetCallback(<Profile widgetCallback={widgetCallback}/>);
          else if(pending.returnTo === "contribute") widgetCallback(<HardcoverBookSearch widgetCallback={widgetCallback}/>);
          else widgetCallback(<Create widgetCallback={widgetCallback} initialSource="hardcover"/>);
          return;
        }

        const session = data as loginBody;
        if(!session.username || !session.authtoken){
          failed("Something went wrong with Hardcover sign-in, please try again.");
          return;
        }
        setCookie("username", session.username);
        setCookie("authtoken", session.authtoken);
        if(session.goodreads_id) setCookie("goodreads_id", session.goodreads_id);
        setHardcoverLink(session.hardcover_username);
        setLoginStatus("profile");
        toast.success((session.is_new_account ? "Welcome, " : "Welcome back, ") + session.username + "!");
        if(pending.returnTo === "contribute") widgetCallback(<HardcoverBookSearch widgetCallback={widgetCallback}/>);
        else widgetCallback(<Create widgetCallback={widgetCallback} initialSource="hardcover"/>);
      });
  // eslint-disable-next-line
  }, []);

  return <Loading/>;
}
