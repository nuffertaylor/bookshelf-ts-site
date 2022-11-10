import React, {useContext, useEffect, useState} from 'react';
import { defaultProps } from '../types/interfaces';
import { capitalizeFirstLetter, sendPostRequestToServer, setCookie, validEmail} from '../utils/utilities';
import { Profile } from './Profile';
import { Loading } from './Loading';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';

interface loginregisterRequest {
  requestType : string, //"login" | "register",
  username : string,
  password : string,
  email ?: string
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
  setLoginStatus : Function,
  startState ?: string
}

export function Login({widgetCallback, setLoginStatus, startState = "login"} : loginProps){
  const login_flip_text = "Don't have an account? Register one here.";
  const register_flip_text = "Already have an account? Login here.";
  const [currentState, setState] = useState(startState);
  const [flip_text, set_flip_text] = useState<string>(startState === "login" ? login_flip_text : register_flip_text);
  const { colorScheme } = useContext(ColorSchemeCtx);

  const submitLoginRegister = ()=>{
    const clear_failed_input_css = (element_ids : string[]) => {
      element_ids.forEach(i=>document.getElementById(i)?.classList.remove("bs_failed_input"));
    };
    clear_failed_input_css(["username", "password", "email"]);
    let username = (document.getElementById("username") as HTMLInputElement)?.value;
    let password = (document.getElementById("password")as HTMLInputElement)?.value;
    let email = (document.getElementById("email") as HTMLInputElement)?.value;
    let failedChecks = [];
    if(!username) { failedChecks.push("username"); }
    if(!password) { failedChecks.push("password"); }
    if(currentState==="register" && (!email || !validEmail(email))) { failedChecks.push("email"); }
    if(failedChecks.length > 0) {
      failedChecks.forEach((s) => {
        document.getElementById(s)?.classList.add("bs_failed_input");
        if(s === "email" && email) toast.error("Invalid email provided.");
        else toast.error("No " + s + " provided.");
      });
      return;
    }
    widgetCallback(<Loading />)
    let data : loginregisterRequest = {
      requestType : currentState,
      username : username,
      password : password,
    };
    if(currentState==="register") data.email = email;
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

  const flip_state = ()=>{
    if(currentState==="login") {
      setState("register");
      set_flip_text(register_flip_text);
    }
    else {
      setState("login");
      set_flip_text(login_flip_text);
    }
  };

  useEffect(()=>{
    const keyDownHandler = (event : KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitLoginRegister();
      }
    }
    document.addEventListener('keydown', keyDownHandler);
    return () => { document.removeEventListener('keydown', keyDownHandler); };
  });

  return(
    <div className="bs_input_section">
      {currentState === "register" &&
      <input type="text" placeholder="email" id="email" className={"bs_text_input bs_text_input_".concat(colorScheme)}  />
      }
      <input type="text" placeholder="username" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="username"/>
      <input type="password" placeholder="password" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="password"/>
      <span className={"bs_registerlogin_flip a_ a_".concat(colorScheme)} onClick={flip_state}>{flip_text}</span>
      <button id="bs_enter_button" className="bs_button" onClick={submitLoginRegister}>{capitalizeFirstLetter(currentState)}</button>
    </div>
  )
}