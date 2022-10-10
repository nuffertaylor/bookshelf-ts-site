import React from 'react';
import {Found} from "./Found";
import { book, defaultProps, foundBook } from '../types/interfaces';
import {Loading} from "./Loading";
import {getCookie, sendGetRequestToServer} from "../utils/utilities";

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

  const getGRShelf = (userid : string, shelfname : string)=>{
    let querystr = "userid=" + userid + "&shelfname=" + shelfname;
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookshelf", querystr, (res : string)=>{
      const resObj : getgrbookshelfResponse = JSON.parse(res);
      if(resObj.statusCode !== 200) {
        alert("something went wrong, please try again later.");
        widgetCallback(<Create widgetCallback={widgetCallback} props={props}/>);
        return;
      }
      const found : Array<foundBook> = resObj["body"]["found"];
      const unfound : Array<book> = resObj["body"]["unfound"];
      widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>);
    });
  };

  const generate = () => {
    //TODO: Allow user to input their profile URL as well
    //Constrain the actual userid to just the numbers
    const userIdEl = document.getElementById("userid") as HTMLInputElement;
    let userid : string = "";
    if(userIdEl != null) userid = userIdEl.value;
    if(userid === ""){
      alert("Please provide your goodreads user id!");
      if(userIdEl != null) userIdEl.focus();
      return;
    }
    const shelfNameEl = document.getElementById("shelfname") as HTMLInputElement;
    let shelfname : string = "";
    if(shelfNameEl != null) shelfname = shelfNameEl.value;
    if(shelfname === ""){
      alert("Please provide the shelf you'd like to make a shelf of");
      if(shelfNameEl != null) shelfNameEl.focus();
      return;
    }
    getGRShelf(userid, shelfname);
  };

  return (
  <div className="bs_input_section">
    <input type="text" placeholder="goodreads user id" className="bs_text_input" id="userid" defaultValue={gr_id}/>
    <input type="text" placeholder="shelfname" className="bs_text_input" id="shelfname"/>
    <button id="bs_enter_button" className="bs_button" onClick={generate}>GENERATE</button>
  </div>
  )
}