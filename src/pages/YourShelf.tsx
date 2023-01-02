import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { IMG_URL_PREFIX } from '../types/constants';
import { defaultProps, shelfImage } from '../types/interfaces';
import { getCookie, get_cur_date_str, sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';

interface YourShelfProps extends defaultProps {
  shelf_image : shelfImage
  saved_shelf : boolean,
}
interface setshelfownerRequest{
  username : string,
  authtoken : string,
  filename : string,
  bookshelf_name : string
}
interface setshelfownerResponse{
  statusCode : number,
  body : shelfImage
}
export function YourShelf({shelf_image, widgetCallback, saved_shelf} : YourShelfProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
  const { colorScheme } = useContext(ColorSchemeCtx);

  //TODO: If they aren't signed in, give them the opportunity to sign in without losing their generated shelf.
  //TODO: Limit maximum number of bookshelves user can save to their profile
  const save_to_profile = () => {
    if(!username) {
      toast.info("Login or register to save the generated shelf to your profile!");
      return;
    }
    const bookshelf_name = prompt("What would you like to name the shelf?", get_cur_date_str());
    if(!bookshelf_name) {
      toast.info("Canceled saving shelf to profile.");
      return;
    }
    if(bookshelf_name.length > 64) {
      toast.error("That shelf name is too long! The max length is 64 characters. Try again with a shorter name.");
      return;
    }
    let req : setshelfownerRequest = {
      username : username, 
      authtoken : authtoken, 
      filename : shelf_image.filename, 
      bookshelf_name : bookshelf_name
    };
    widgetCallback(<Loading/>);
    sendPostRequestToServer("setshelfowner", req, (res:string)=>{
      const parsedRes : setshelfownerResponse = JSON.parse(res);
      if(parsedRes.statusCode === 200) toast.success("successfully saved this shelf to your profile!");
      else toast.error("something went wrong, please try again later.");
      widgetCallback(<YourShelf shelf_image={parsedRes.body} widgetCallback={widgetCallback} saved_shelf={true}/>);
    });
  };

  const delete_shelf = () => {
    console.log("attempting to delete shelf");
  };
  
  const shelf_img_url = IMG_URL_PREFIX.concat(shelf_image.filename);
  return(
    <div className="found_spine_box">
      <div className="found_spine_head">{saved_shelf ? shelf_image.bookshelf_name : "Your Shelf"}</div>
      <img alt="your_generated_shelf" src={shelf_img_url} className="display_shelf" />
      <div className="multiple_button_wrapper">
        <a href={shelf_img_url} download="myshelf" className={"a_".concat(colorScheme)}>
          <button className="bs_shelf_buttons">download</button>
        </a>
        <button className={"bs_shelf_buttons".concat(saved_shelf ? " bs_delete_bg_color" : "")} onClick={saved_shelf ? delete_shelf : save_to_profile}>{saved_shelf ? "Delete Shelf" : "Save to Profile"}</button>
      </div>
    </div>
  );
}