import React from 'react';
import {Loading} from "./Loading";
import { UnfoundUpload } from './UnfoundUpload';
import { YourShelf } from './YourShelf';
import { book, bookContainer, foundBook } from '../types/interfaces';

export interface FoundProps {
  found : Array<foundBook>, 
  unfound ?: Array<bookContainer>,
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
    let booklist : Array<book> = found;
      if((document.getElementById("fakeSpines") as HTMLInputElement)?.checked && unfound) {
        unfound.forEach(u=>booklist.push(u.book));
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

  const createUnfoundUpload =()=>{
    widgetCallback(<UnfoundUpload found={found} unfound={unfound} widgetCallback={widgetCallback}/>);
  }

  return(
    <div className="found_spine_box">
      <div className="found_spine_head">Found {found.length} Spines</div>
      {unfound && unfound.length > 0 &&
      <div>
        <div className="unfound_spine_subhead">Missing {unfound.length} Spines</div>
        <input type="checkbox" id="generate_fakes"/>
        <label htmlFor="generate_fakes">generate fake spines</label>
      </div>
      }
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button" onClick={go}>Generate</button>
      </div>
      {unfound && unfound.length > 0 &&
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button bs_gray" onClick={createUnfoundUpload}>Upload Missing Spines</button>
      </div>
      }
    </div>
  );
}