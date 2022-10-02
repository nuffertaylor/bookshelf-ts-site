import React from 'react';
import { getCookie, sendPostRequestToServer } from '../utils/utilities';

interface YourShelfProps {
  shelf_url : string
}
interface setshelfownerRequest{
  username : string,
  authtoken : string,
  filename : string
}
interface setshelfownerResponse{
  statusCode:number,
  body:string
}
export function YourShelf({shelf_url} : YourShelfProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
  const save_to_profile = () => {
    if(!username) {
      alert("Login or register to save the generated shelf to your profile!");
      return;
    }
    const filename = shelf_url.replace("https://bookshelf-spines.s3.amazonaws.com/", "");
    sendPostRequestToServer("setshelfowner", {username:username, authtoken:authtoken, filename:filename}, (res:string)=>{
      const parsedRes : setshelfownerResponse = JSON.parse(res);
      if(parsedRes.statusCode === 200) alert("successfully save this shelf to your profile!");
      else alert("something went wrong, please try again later.");
    });

  };

  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Your Shelf</div>
      <img alt="your_generated_shelf" src={shelf_url} className="display_shelf" />
      <div className="multiple_button_wrapper">
        <a href={shelf_url} download="myshelf">
          <button className="bs_shelf_buttons">download</button>
        </a>
        <button className="bs_shelf_buttons" onClick={save_to_profile}>save to profile</button>
      </div>
    </div>
  );
}