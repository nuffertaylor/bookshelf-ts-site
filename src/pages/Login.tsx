import React, {useState} from 'react';
import { defaultProps } from '../types/interfaces';
import { getLocalIPAddress, sendPostRequestToServer, setCookie} from '../utilities';
import { Profile } from './Profile';
import { Loading } from './Loading';

interface loginregisterRequest {
  requestType : string, //"login" | "register",
  username : string,
  password : string,
  ip : string,
  email ?: string
}
interface loginregisterResponse {
  statusCode : 200,
  body: {
    username : string,
    authtoken : string,
    goodreads_id ?: string
  }
}

interface loginProps extends defaultProps {
  setLoginStatus : Function,
  startState ?: string
}

//TODO: Add register functionality to this component
export function Login({widgetCallback,setLoginStatus, startState = "login"} : loginProps){
  const [currentState, setState] = useState(startState);

  const submitLoginRegister = ()=>{
    let username = (document.getElementById("username") as HTMLInputElement)?.value;
    let password = (document.getElementById("password")as HTMLInputElement)?.value;
    let email = (document.getElementById("email") as HTMLInputElement)?.value;
    let failedChecks = [];
    if(!username) { failedChecks.push("username"); }
    if(!password) { failedChecks.push("password"); }
    if(currentState==="register" && !email) { failedChecks.push("email"); }
    if(failedChecks.length > 0) {
      failedChecks.forEach(s=>document.getElementById(s)?.classList.add("bs_failed_input"));
      return;
    }
    widgetCallback(<Loading />)
    getLocalIPAddress((ip : string) => {
      let data : loginregisterRequest = {
        requestType : currentState,
        username : username,
        password : password,
        ip : ip
      };
      if(currentState==="register") data.email = email;
      sendPostRequestToServer("loginregister", data, (res : string)=>{
        const parsed_res : loginregisterResponse = JSON.parse(res);
        if(parsed_res.statusCode === 200){
          alert("Welcome " + parsed_res.body.username + "!");
          setCookie("username", parsed_res.body.username);
          setCookie("authtoken", parsed_res.body.authtoken);
          if(parsed_res.body.goodreads_id) setCookie("goodreads_id", parsed_res.body.goodreads_id);
          setLoginStatus("profile");
          widgetCallback(<Profile widgetCallback={widgetCallback}/>);
        }
        else {
          alert(parsed_res.body);
          widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>);
        }
      });
    });
  }
  const flip_state = ()=>{currentState==="login" ? setState("register") : setState("login")};
  return(
    <div className="bs_input_section">
      {currentState === "register" &&
      <input type="text" placeholder="email" id="email" className="bs_text_input" />
      }
      <input type="text" placeholder="username" className="bs_text_input" id="username"/>
      <input type="password" placeholder="password" className="bs_text_input" id="password"/>
      <span className="bs_registerlogin_flip" onClick={flip_state}>Don't have an account? Register one here.</span>
      <button id="bs_enter_button" className="bs_button" onClick={submitLoginRegister}>Login</button>
    </div>
  )
}