import React from 'react';
import { defaultProps } from '../types/interfaces';
import { Login } from './Login';


export default function NeedAuthentication({widgetCallback} : defaultProps){
  const flip_to_login = ()=>{widgetCallback(<Login widgetCallback={widgetCallback} startState="login"/>)};
  const flip_to_register = ()=>{widgetCallback(<Login widgetCallback={widgetCallback} startState="register"/>)};
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