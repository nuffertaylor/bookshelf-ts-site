import React from 'react';

export function Loading(){
  return(
    <div className="bs_loading">
      <div className="bs_loading_square_container">
        <div className="bs_loading_square" id="sq1"></div>
        <div className="bs_loading_square" id="sq2"></div>
        <div className="bs_loading_square" id="sq3"></div>
        <div className="bs_loading_square" id="sq4"></div>
        <div id="moving_square"></div>
      </div>
    </div>
  );
}