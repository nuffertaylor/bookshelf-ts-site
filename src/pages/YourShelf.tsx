import React from 'react';

export function YourShelf(){
  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Your Shelf</div>
      <img alt="your_generated_shelf" src="https://bookshelf-spines.s3.amazonaws.com/lyhjzqrpsj.jpg" className="display_shelf" />
      <div className="multiple_button_wrapper">
        <button className="bs_shelf_buttons">download</button>
        <button className="bs_shelf_buttons">save to profile</button>
      </div>
    </div>
  );
}