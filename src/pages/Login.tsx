import React from 'react';
import { defaultProps } from '../types/interfaces';
import { getLocalIPAddress, sendPostRequestToServer, setCookie} from '../utilities';
import { Leaderboard } from './Leaderboard';
import { Loading } from './Loading';
import { Register } from './Register';


interface loginregisterResponse {
  statusCode : 200,
  body: {
    username : string,
    authtoken : string
  }
}

//TODO: Add register functionality to this component
export function Login({widgetCallback} : defaultProps){
  const currentState = "login"; //later make this a react state so it's either "login" or "register"

  const submitLoginRegister = ()=>{
    let username = (document.getElementById("username") as HTMLInputElement)?.value;
    let password = (document.getElementById("password")as HTMLInputElement)?.value;
    let failedChecks = [];
    if(!username) { failedChecks.push("username"); }
    if(!password) { failedChecks.push("password"); }
    if(failedChecks.length > 0) {
      failedChecks.forEach(s=>document.getElementById(s)?.classList.add("bs_failed_input"));
      return;
    }
    widgetCallback(<Loading />)
    getLocalIPAddress((ip : string) => {
      var data = {
        requestType : currentState,
        username : username,
        password : password,
        ip: ip
      };
      sendPostRequestToServer("loginregister", data, (res : string)=>{
        const parsed_res : loginregisterResponse = JSON.parse(res);
        if(parsed_res.statusCode == 200){
          alert("Welcome " + parsed_res.body.username + "!");
          setCookie("username", parsed_res.body.username);
          setCookie("authtoken", parsed_res.body.authtoken);
          //For now we callback to the leaderboard page
          widgetCallback(<Leaderboard widgetCallback={widgetCallback}/>);
        }
        else {
          alert(parsed_res.body);
          widgetCallback(<Login widgetCallback={widgetCallback} />);
        }
      });
    });
  }
  const flip_to_register = ()=>{widgetCallback(<Register widgetCallback={widgetCallback}/>)};
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="username" className="bs_text_input" id="username"/>
      <input type="password" placeholder="password" className="bs_text_input" id="password"/>
      <span className="bs_registerlogin_flip" onClick={flip_to_register}>Don't have an account? Register one here.</span>
      <button id="bs_enter_button" className="bs_button" onClick={submitLoginRegister}>Login</button>
    </div>
  )
}