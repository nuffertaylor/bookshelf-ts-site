import React from 'react'

export function Create(){
  return (
  <div className="bs_input_section">
    <input type="text" placeholder="goodreads user id" className="bs_text_input" />
    <input type="text" placeholder="shelfname" className="bs_text_input" />
    <button id="bs_enter_button" className="bs_button">GENERATE</button>
  </div>
  )
}