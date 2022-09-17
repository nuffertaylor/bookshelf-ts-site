import React from 'react';
import { defaultProps } from '../types/interfaces';
import { Login } from './Login';

export function Register({widgetCallback} : defaultProps){
  const flip_to_login = ()=>{widgetCallback(<Login widgetCallback={widgetCallback}/>)};
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="email" className="bs_text_input" />
      <input type="text" placeholder="username" className="bs_text_input" />
      <input type="password" placeholder="password" className="bs_text_input" />
      <span className="bs_registerlogin_flip" onClick={flip_to_login}>Already have an account? Login here.</span>
      <button id="bs_enter_button" className="bs_button">Register</button>
    </div>
  )
}