import React from 'react';

export function SortBy(){
  return(
  <div className="found_spine_box">
    <div className="found_spine_head">Sort by</div>
    <div className="custom-select" style={{width:"200px"}}>
      <select>
        <option value="0">Select option:</option>
      </select>
    </div>
    <div className="bs_button_wrapper">
      <button className="bs_adaptive_button">Go</button>
    </div>
  </div>
  )
}