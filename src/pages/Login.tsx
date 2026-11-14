import React, {useContext, useEffect} from 'react';
import { defaultProps } from '../types/interfaces';
import { sendPostRequestToServer, setCookie } from '../utils/utilities';
import { startHardcoverAuth } from '../utils/hardcover';
import { Profile } from './Profile';
import { Loading } from './Loading';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';

interface loginRequest {
  requestType : "login",
  username : string,
  password : string
}
interface loginregisterResponse {
  statusCode : 200,
  body: {
    username : string,
    authtoken : string,
    goodreads_id ?: string
  } | string
}

interface loginProps extends defaultProps {
  setLoginStatus : Function
}

export function Login({widgetCallback, setLoginStatus} : loginProps){
  const { colorScheme } = useContext(ColorSchemeCtx);

  // New accounts are created by signing in with Hardcover. This password form is for accounts made before that.
  const signInWithHardcover = ()=>{
    widgetCallback(<Loading />);
    startHardcoverAuth("login", "create", ()=>{
      widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>);
    });
  };

  const submitLogin = ()=>{
    const clear_failed_input_css = (element_ids : string[]) => {
      element_ids.forEach(i=>document.getElementById(i)?.classList.remove("bs_failed_input"));
    };
    clear_failed_input_css(["username", "password"]);
    let username = (document.getElementById("username") as HTMLInputElement)?.value;
    let password = (document.getElementById("password")as HTMLInputElement)?.value;
    let failedChecks = [];
    if(!username) { failedChecks.push("username"); }
    if(!password) { failedChecks.push("password"); }
    if(failedChecks.length > 0) {
      failedChecks.forEach((s) => {
        document.getElementById(s)?.classList.add("bs_failed_input");
        toast.error("No " + s + " provided.");
      });
      return;
    }
    widgetCallback(<Loading />)
    let data : loginRequest = {
      requestType : "login",
      username : username,
      password : password,
    };
    sendPostRequestToServer("loginregister", data, (res : string)=>{
      const parsed_res : loginregisterResponse = JSON.parse(res);
      if(parsed_res.statusCode === 200 && typeof parsed_res.body !== 'string') {
        toast.success("Welcome " + parsed_res.body.username + "!");
        setCookie("username", parsed_res.body.username);
        setCookie("authtoken", parsed_res.body.authtoken);
        if(parsed_res.body.goodreads_id) setCookie("goodreads_id", parsed_res.body.goodreads_id);
        setLoginStatus("profile");
        widgetCallback(<Profile widgetCallback={widgetCallback}/>);
      }
      else {
        toast.error(typeof parsed_res.body === 'string' ? parsed_res.body : "Something went wrong with your login.");
        widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>);
      }
    });
  };

  useEffect(()=>{
    const keyDownHandler = (event : KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitLogin();
      }
    }
    document.addEventListener('keydown', keyDownHandler);
    return () => { document.removeEventListener('keydown', keyDownHandler); };
  });

  return(
    <div className="bs_input_section">
      <button id="bs_hardcover_signin_button" className="bs_button bs_file_button" onClick={signInWithHardcover}>Sign in with Hardcover</button>
      <p className="bs_csv_help">
        New here? Sign in with Hardcover and we'll make your account.<br/>
        Already have a My Bookshelf account? Log in with your password below, then link Hardcover from your profile.
        (Signing in with Hardcover from an existing account's login creates a second, empty account.)
      </p>
      <input type="text" placeholder="username" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="username"/>
      <input type="password" placeholder="password" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="password"/>
      <button id="bs_enter_button" className="bs_button" onClick={submitLogin}>Login</button>
    </div>
  )
}
