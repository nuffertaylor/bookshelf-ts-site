import React from 'react';
import {Loading} from './Loading';
import {validUrl, onlyDigits, sendGetRequestToServer} from '../utils/utilities';
import { book, defaultProps } from "../types/interfaces";
import { Upload } from './Upload';

interface getgrbookdetailsResponse{
  statusCode : number,
  body : book
}

export function FetchGoodreads({widgetCallback} : defaultProps){
  const getBookData = ()=>{
    const bs_url_input = document.getElementById("bs_url_input") as HTMLInputElement;
    if(!bs_url_input) {
      alert("You have to provide a URL or Book ID to continue!");
      return;
    }
    const bs_url : string = bs_url_input.value;
    if(!validUrl(bs_url) && !onlyDigits(bs_url)) {
      alert("invalid URL/Book ID provided. Please try again");
      return;
    }
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookdetails", "url=" + encodeURIComponent(bs_url), (res : string)=>{
      const responseObject : getgrbookdetailsResponse = JSON.parse(res);
      let book : book = responseObject.body;
      widgetCallback(<Upload widgetCallback={widgetCallback} prefill={book} origin={<FetchGoodreads widgetCallback={widgetCallback}/>}/>)
    });
  }
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="Paste Goodreads URL/Book ID" className="bs_text_input" id="bs_url_input"/>
      <button id="bs_enter_button" className="bs_button" onClick={getBookData}>Get Book Data</button>
    </div>
  )
}