import React from 'react';

export function Register(){
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="email" className="bs_text_input" />
      <input type="text" placeholder="username" className="bs_text_input" />
      <input type="password" placeholder="password" className="bs_text_input" />
      <button id="bs_enter_button" className="bs_button" >login</button>
    </div>
  )
}