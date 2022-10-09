import React from 'react';
import { defaultProps } from '../types/interfaces';
import { getCookie, sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';

//TODO: Fix error {"errorMessage": "float() argument must be a string or a number, not 'NoneType'", "errorType": "TypeError", "stackTrace": ["  File \"/var/task/genShelfLambda.py\", line 23, in lambda_handler\n    bookshelf.fillShelf(sortedBooks)\n", "  File \"/var/task/bookshelf.py\", line 74, in fillShelf\n    h,w,l = self.getBookHeightWidthLength(f[\"dimensions\"])\n", "  File \"/var/task/bookshelf.py\", line 41, in getBookHeightWidthLength\n    return float(h), float(w), float(l)\n"]}
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
export function YourShelf({shelf_url, widgetCallback} : YourShelfProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
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
      widgetCallback(<YourShelf shelf_url={shelf_url} widgetCallback={widgetCallback}/>);
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