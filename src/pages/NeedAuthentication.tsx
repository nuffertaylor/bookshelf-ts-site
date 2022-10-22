import React from 'react';
import { defaultProps } from '../types/interfaces';
import { Login } from './Login';

interface needAuthenticationProps extends defaultProps {
  setLoginStatus : Function
}

export default function NeedAuthentication({ widgetCallback, setLoginStatus } : needAuthenticationProps){
  const click_login_tab = ()=>{document.getElementById("login")?.click();}
  const flip_to_login = ()=>{click_login_tab(); widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus} startState="login"/>)};
  const flip_to_register = ()=>{click_login_tab(); widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus} startState="register"/>)};
  return(
    <div className="bs_landing bs_needsauth">
      <div className="landing_text">Login or register to contribute</div>
      <div>
        <button id="bs_enter_button" className="bs_button bs_half_button" onClick={flip_to_login}>login</button>
        <button id="bs_enter_button" className="bs_button bs_half_button" onClick={flip_to_register}>register</button>
      </div>
  </div>
  )
}