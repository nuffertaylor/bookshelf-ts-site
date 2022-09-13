import React from 'react';
import {Found} from "./Found";
import {Loading} from "./Loading";

interface CreateProps {
  props ?: 
  {
    userid : string,
    shelfname : string
  }
  widgetCallback : Function
}

export function Create({ widgetCallback, props }: CreateProps){
  const sendGetRequestToServer = async function (method : string, querystr : string, callback : Function){
    var xhttp = new XMLHttpRequest();
    var path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method + "?" + querystr;
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          callback(xhttp.responseText);
        } //TODO handle other status codes
    };
    xhttp.open("GET", path, true);
    xhttp.send();
  }

  const getGRShelf = (userid : string, shelfname : string)=>{
    let querystr = "userid=" + userid + "&shelfname=" + shelfname;
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookshelf", querystr, (res : string)=>{
      const resObj = JSON.parse(res);
      const found : Array<Object> = resObj["body"]["found"];
      const unfound : Array<Object> = resObj["body"]["unfound"];
      widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback}/>);
    });
  };

  const generate = () => {
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
    <input type="text" placeholder="goodreads user id" className="bs_text_input" id="userid" />
    <input type="text" placeholder="shelfname" className="bs_text_input" id="shelfname"/>
    <button id="bs_enter_button" className="bs_button" onClick={generate}>GENERATE</button>
  </div>
  )
}