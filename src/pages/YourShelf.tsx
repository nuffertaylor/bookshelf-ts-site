import React from 'react';

interface YourShelfProps {
  shelf_url : string
}

//TODO: Add "save to profile functionality"
export function YourShelf({shelf_url} : YourShelfProps){
  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Your Shelf</div>
      <img alt="your_generated_shelf" src={shelf_url} className="display_shelf" />
      <div className="multiple_button_wrapper">
        <a href={shelf_url} download="myshelf">
          <button className="bs_shelf_buttons">download</button>
        </a>
        <button className="bs_shelf_buttons">save to profile</button>
      </div>
    </div>
  );
}