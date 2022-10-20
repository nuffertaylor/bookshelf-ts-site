import React from 'react';
import {Loading} from './Loading';
import {validUrl, onlyDigits, sendGetRequestToServer} from '../utils/utilities';
import { book, defaultProps } from "../types/interfaces";
import { Upload } from './Upload';

interface getgrbookdetailsResponse{
  statusCode : number,
  body : book
}

export function FetchGoodreads({ widgetCallback, colorScheme } : defaultProps){
  const getBookData = ()=>{
    const bs_url_input = document.getElementById("bs_url_input") as HTMLInputElement;
    if(!bs_url_input) {
      alert("You have to provide a URL or Book ID to continue!");
      return;
    }
    const bs_url : string = bs_url_input.value.split('?')[0];
    if(!validUrl(bs_url) && !onlyDigits(bs_url)) {
      alert("invalid URL/Book ID provided. Please try again");
      return;
    }
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookdetails", "url=" + encodeURIComponent(bs_url), (res : string)=>{
      const responseObject : getgrbookdetailsResponse = JSON.parse(res);
      if(responseObject.statusCode !== 200) {
        alert("Something went wrong fetching the book details.");
        widgetCallback(<FetchGoodreads widgetCallback={widgetCallback} colorScheme={colorScheme}/>);
        return;
      }
      let book : book = responseObject.body;
      const originCallback = ()=>{widgetCallback(<FetchGoodreads widgetCallback={widgetCallback} colorScheme={colorScheme}/>);}
      widgetCallback(<Upload widgetCallback={widgetCallback} colorScheme={colorScheme} prefill={book} originCallback={originCallback}/>)
    });
  }
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="Paste Goodreads URL/Book ID" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="bs_url_input"/>
      <button id="bs_enter_button" className="bs_button" onClick={getBookData}>Get Book Data</button>
    </div>
  )
}