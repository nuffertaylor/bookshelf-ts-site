import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { IMG_URL_PREFIX } from '../types/constants';
import { defaultProps, shelfImage } from '../types/interfaces';
import { getCookie, get_cur_date_str, sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';
import { IconPencil } from '@tabler/icons';
import { Profile } from './Profile';


interface YourShelfProps extends defaultProps {
  shelf_image?: shelfImage,
  from_profile: boolean,
  b64ShelfImage?: string,
}
interface setshelfownerRequest{
  username : string,
  authtoken : string,
  filename : string,
  bookshelf_name ?: string,
  delete_owner ?: boolean,
  b64_shelf_image?: string,
}
interface setshelfownerResponse{
  statusCode : number,
  body : shelfImage
}
export function YourShelf({shelf_image, widgetCallback, from_profile, b64ShelfImage} : YourShelfProps) {
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
  const { colorScheme } = useContext(ColorSchemeCtx);

  //TODO: If they aren't signed in, give them the opportunity to sign in without losing their generated shelf.
  //TODO: Limit maximum number of bookshelves user can save to their profile
  const save_to_profile = () => {set_shelf_name(false)};
  const rename_shelf = () => {set_shelf_name(true)};

  const set_shelf_name = (renaming : boolean) => {
    if (!username) {
      toast.info("Login or register to save the generated shelf to your profile!");
      return;
    }
    const bookshelf_name = prompt("What would you like to name the shelf?", get_cur_date_str());
    if (!bookshelf_name) {
      if(renaming) toast.info("Canceled renaming shelf.");
      else toast.info("Canceled saving shelf to profile.");
      return;
    }
    if (bookshelf_name.length > 64) {
      toast.error("That shelf name is too long! The max length is 64 characters. Try again with a shorter name.");
      return;
    }
    let req : setshelfownerRequest = {
      username : username, 
      authtoken : authtoken, 
      filename : shelf_image?.filename ?? '',
      bookshelf_name : bookshelf_name,
      b64_shelf_image: b64ShelfImage ?? '',
    };
    widgetCallback(<Loading/>);
    sendPostRequestToServer("setshelfowner", req, (res:string)=>{
      const parsedRes : setshelfownerResponse = JSON.parse(res);
      const success_msg = renaming ? "Successfully renamed shelf!" : "Successfully saved this shelf to your profile!";
      if(parsedRes.statusCode === 200) toast.success(success_msg);
      else toast.error("something went wrong, please try again later.");
      widgetCallback(<YourShelf shelf_image={parsedRes.body} widgetCallback={widgetCallback} from_profile={from_profile}/>);
    });
  };

  const delete_shelf = () => {
    widgetCallback(<Loading/>);
    let req : setshelfownerRequest = {
      username : username, 
      authtoken : authtoken, 
      filename : shelf_image?.filename ?? '',
      delete_owner : true,
    };
    widgetCallback(<Loading/>);
    sendPostRequestToServer("setshelfowner", req, (res:string)=>{
      const parsedRes : setshelfownerResponse = JSON.parse(res);
      if(parsedRes.statusCode === 200) {
        toast.success("Successfully deleted.");
        widgetCallback(<Profile widgetCallback={widgetCallback}/>);
        return;
      }
      else toast.error("something went wrong, please try again later.");
      widgetCallback(<YourShelf shelf_image={parsedRes.body} widgetCallback={widgetCallback} from_profile={from_profile}/>);
    });
  };

  // if no filename is provided, it's a newly generated b64 image.
  const shelf_img_url = !!shelf_image?.filename ? IMG_URL_PREFIX.concat(shelf_image.filename) : b64ShelfImage;
  return(
    <div className="found_spine_box">
      <div className="found_spine_head">
          {from_profile && <span className={"arrow arrow-left arrow_".concat(colorScheme)} style={{marginTop:".5em"}}onClick={()=>{widgetCallback(<Profile widgetCallback={widgetCallback}/>)}}></span>}
          <span style={{width:"100%"}}>{shelf_image?.bookshelf_name ? shelf_image?.bookshelf_name : "Your Shelf"}</span>
          {shelf_image?.owner && 
            <div className="bs_edit_pencil_yourshelf" onClick={rename_shelf}>
              <IconPencil color="#FFFFFF" size={20} stroke={1.5}/>
            </div>
          }
        </div>
      <img alt="your_generated_shelf" src={shelf_img_url} className="display_shelf" />
      <div className="multiple_button_wrapper">
        <a href={shelf_img_url} download="myshelf" className={"a_".concat(colorScheme)}>
          <button className="bs_shelf_buttons">Download</button>
        </a>
        <button className={"bs_shelf_buttons".concat(shelf_image?.owner ? " bs_delete_bg_color" : "")} onClick={shelf_image?.owner ? delete_shelf : save_to_profile}>{shelf_image?.owner ? "Delete Shelf" : "Save to Profile"}</button>
      </div>
    </div>
  );
}
