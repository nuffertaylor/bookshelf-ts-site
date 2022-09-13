import React from 'react';
import {Loading} from "./Loading";
import { YourShelf } from './YourShelf';

interface FoundProps {
  found : Array<Object>, 
  unfound ?: Array<Object>,
  widgetCallback : Function
}
interface genshelfRequest {
  bookList : Array<Object>
}
interface genshelfResponse {
  statusCode : number,
  body : string
}


export function Found({found, unfound, widgetCallback} : FoundProps){
  const sendPostRequestToServer = async function (method : string, data : genshelfRequest, callback : Function) {
    var httpPost = new XMLHttpRequest();
    var path : string = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method;
    var data_json : string = JSON.stringify(data);
    httpPost.onreadystatechange = (err) =>{
      if(httpPost.readyState === 4) callback(httpPost.responseText);
    };
    // Set the content type of the request to json since that's what's being sent
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader('Content-Type', 'application/json');
    httpPost.send(data_json);
  };

  const go = ()=>{
    widgetCallback(<Loading/>);
    let booklist = found;
      if((document.getElementById("fakeSpines") as HTMLInputElement)?.checked && unfound) {
        booklist.push(...unfound);
      }
      var data = {
        bookList : booklist
      }
      sendPostRequestToServer("genshelf", data, (res : string)=>{
        const resObj : genshelfResponse = JSON.parse(res);
        const url : string = resObj.body as string;
        widgetCallback(<YourShelf shelf_url={url}/>)
      });
  };

  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Found {found.length} Spines</div>
      <input type="checkbox" id="generate_fakes"/>
      <label htmlFor="generate_fakes">generate fake spines</label>
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button" onClick={go}>Go</button></div>
    </div>
  );
}