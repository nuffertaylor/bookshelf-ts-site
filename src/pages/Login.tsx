import React from 'react';
import { getLocalIPAddress, sendPostRequestToServer, setCookie} from '../utilities';

interface loginregisterResponse {
  statusCode : 200,
  body: {
    username : string,
    authtoken : string
  }
}

//TODO: Add register functionality to this component
export function Login(){
  const currentState = "login"; //later make this a react state so it's either "login" or "register"

  const submitLoginRegister = ()=>{
    let username = (document.getElementById("username") as HTMLInputElement)?.value;
    let password = (document.getElementById("password")as HTMLInputElement)?.value;
    // let email = document.getElementById("email").value;
    getLocalIPAddress((ip : string) => {
      var data = {
        requestType : currentState,
        username : username,
        password : password,
        // email : email,
        ip: ip
      };
      sendPostRequestToServer("loginregister", data, (res : string)=>{
        const parsed_res : loginregisterResponse = JSON.parse(res);
        if(parsed_res.statusCode == 200){
          alert("Successfully logged in");
          setCookie("username", parsed_res.body.username);
          setCookie("authtoken", parsed_res.body.authtoken);
        }
        else alert(parsed_res.body);
      });
  });
}
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="username" className="bs_text_input" id="username"/>
      <input type="password" placeholder="password" className="bs_text_input" id="password"/>
      <button id="bs_enter_button" className="bs_button" onClick={submitLoginRegister}>login</button>
    </div>
  )
}