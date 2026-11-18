import React from 'react';
import { defaultProps } from '../types/interfaces';
import { HardcoverReturn, startHardcoverAuth } from '../utils/hardcover';
import { Loading } from './Loading';
import { Login } from './Login';

interface needAuthenticationProps extends defaultProps {
  setLoginStatus : Function,
  returnTo ?: HardcoverReturn
}

export default function NeedAuthentication({ widgetCallback, setLoginStatus, returnTo = "contribute" } : needAuthenticationProps){
  const click_login_tab = ()=>{document.getElementById("login")?.click();}
  const flip_to_login = ()=>{click_login_tab(); widgetCallback(<Login widgetCallback={widgetCallback} setLoginStatus={setLoginStatus}/>)};
  const sign_in_with_hardcover = ()=>{
    widgetCallback(<Loading/>);
    startHardcoverAuth("login", returnTo, ()=>{ widgetCallback(<NeedAuthentication widgetCallback={widgetCallback} setLoginStatus={setLoginStatus} returnTo={returnTo}/>); });
  };
  return(
    <div className="bs_landing bs_needsauth">
      <div className="landing_text">Log in to contribute</div>
      <div>
        <button id="bs_enter_button" className="bs_button bs_half_button" onClick={flip_to_login}>login</button>
        <button className="bs_button bs_half_button bs_hardcover_button" onClick={sign_in_with_hardcover}>hardcover</button>
      </div>
  </div>
  )
}
