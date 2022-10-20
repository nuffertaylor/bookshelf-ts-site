import React from 'react'
import { defaultProps } from '../types/interfaces';
import { Create } from './Create';

export function Landing({ widgetCallback, colorScheme } : defaultProps){
  const load_create = ()=>{widgetCallback(<Create widgetCallback={widgetCallback} colorScheme={colorScheme}/>)};
  return(
    <div className="bs_landing">
      <div className="landing_text">create a virtual bookshelf</div>
      <div>
        <button id="bs_enter_button" className="bs_button" onClick={load_create}>generate</button>
      </div>
      <div className="landing_text">based on your goodreads</div>
    </div>
);
}