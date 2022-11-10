import React, { useContext } from 'react'
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { defaultProps } from '../types/interfaces';
import { Create } from './Create';

export function Landing({ widgetCallback } : defaultProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const load_create = ()=>{widgetCallback(<Create widgetCallback={widgetCallback} />)};
  return(
    <div className="bs_landing">
      <div className="landing_text">create a virtual bookshelf</div>
      <div>
        <button id="bs_enter_button" className="bs_button" onClick={load_create}>generate</button>
      </div>
      <div className="landing_text">based on your goodreads</div>
      <div className={"a_ a_".concat(colorScheme)} onClick={()=>{document.getElementById("howto")?.click();}}>How do I use this site?</div>
    </div>
);
}