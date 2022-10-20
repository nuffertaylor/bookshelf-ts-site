import React from 'react';
import { defaultProps } from '../types/interfaces';
import { getCookie, sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';

interface YourShelfProps extends defaultProps {
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
export function YourShelf({shelf_url, widgetCallback, colorScheme} : YourShelfProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");

  //TODO: If they aren't signed in, give them the opportunity to sign in without losing their generated shelf.
  //TODO: Limit maximum number of bookshelves user can save to their profile
  const save_to_profile = () => {
    if(!username) {
      alert("Login or register to save the generated shelf to your profile!");
      return;
    }
    const filename = shelf_url.replace("https://bookshelf-spines.s3.amazonaws.com/", "");
    const req : setshelfownerRequest = {username:username, authtoken:authtoken, filename:filename};
    widgetCallback(<Loading/>);
    sendPostRequestToServer("setshelfowner", req, (res:string)=>{
      const parsedRes : setshelfownerResponse = JSON.parse(res);
      if(parsedRes.statusCode === 200) alert("successfully saved this shelf to your profile!");
      else alert("something went wrong, please try again later.");
      widgetCallback(<YourShelf shelf_url={shelf_url} widgetCallback={widgetCallback} colorScheme={colorScheme}/>);
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