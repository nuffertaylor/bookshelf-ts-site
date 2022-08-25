import React from 'react';

interface FoundProps {
  found : Array<Object>, 
  unfound ?: Array<Object>
}

export function Found({found, unfound} : FoundProps){
  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Found {found.length} Spines</div>
      <input type="checkbox" id="generate_fakes"/>
      <label htmlFor="generate_fakes">generate fake spines</label>
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button">Go</button></div>
    </div>
  );
}