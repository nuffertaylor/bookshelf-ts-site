import React, { useContext } from 'react';
import {Found} from "./Found";
import { book, defaultProps, foundBook } from '../types/interfaces';
import {Loading} from "./Loading";
import {getCookie, onlyDigits, remove_non_numeric_char_from_str, remove_query_string, remove_text_title, sendGetRequestToServer, setCookie} from "../utils/utilities";
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';

interface CreateProps extends defaultProps{
  props ?: {
    userid : string,
    shelfname : string
  }
}
export interface getgrbookshelfResponse {
  statusCode : number,
  body : {
    found : foundBook[],
    unfound : book[]
  }
}

export function Create({ widgetCallback, props }: CreateProps){
  const gr_id = getCookie("goodreads_id");
  const { colorScheme } = useContext(ColorSchemeCtx);

  const getGRShelf = (userid : string, shelfname : string)=>{
    let querystr = "userid=" + userid + "&shelfname=" + shelfname;
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookshelf", querystr, (res : string)=>{
      const resObj : getgrbookshelfResponse = JSON.parse(res);
      if(resObj.statusCode !== 200) {
        toast.error("Something went wrong, please try again later.");
        widgetCallback(<Create widgetCallback={widgetCallback} props={props}/>);
        return;
      }
      setCookie("gr_shelf_name", shelfname);
      setCookie("gr_user_id", userid);
      const found : Array<foundBook> = resObj["body"]["found"];
      const unfound : Array<book> = resObj["body"]["unfound"];
      widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>);
    });
  };

  const generate = () => {
    const userIdEl = document.getElementById("userid") as HTMLInputElement;
    let userid : string = "";
    if(userIdEl != null) userid = userIdEl.value;
    //if not only digits, assume its a url
    if(!onlyDigits(userid)) {
      userid = remove_query_string(userid);
      userid = remove_text_title(userid);
      userid = remove_non_numeric_char_from_str(userid);
    }
    let validInput : boolean = true;
    if(userid === ""){
      toast.error("Please provide a valid Goodreads Profile URL or User ID.");
      userIdEl?.classList.add("bs_failed_input");
      validInput = false;
    }
    else { userIdEl?.classList.remove("bs_failed_input"); }

    const shelfNameEl = document.getElementById("shelfname") as HTMLInputElement;
    let shelfname : string = "";
    if(shelfNameEl != null) shelfname = shelfNameEl.value;
    if(shelfname === ""){
      toast.error("Please provide the shelf you'd like to make a shelf of.");
      shelfNameEl?.classList.add("bs_failed_input");
      validInput = false;
    }
    else { shelfNameEl?.classList.remove("bs_failed_input"); }

    if(!validInput) return;
    getGRShelf(userid, shelfname);
  };

  return (
  <div className="bs_input_section">
    <input type="text" placeholder="goodreads profile url or user id" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="userid" defaultValue={gr_id}/>
    <input type="text" placeholder="shelfname" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="shelfname"/>
    <button id="bs_enter_button" className="bs_button" onClick={generate}>GENERATE</button>
  </div>
  )
}