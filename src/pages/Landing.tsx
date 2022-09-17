import React from 'react'
import { defaultProps } from '../types/interfaces';

export function Landing({widgetCallback} : defaultProps){
  return(
    <div className="bs_landing">
      <div className="landing_text">create a virtual bookshelf</div>
      <div>
        <button id="bs_enter_button" className="bs_button">generate</button>
      </div>
      <div className="landing_text">based on your goodreads</div>
    </div>
);
}