import React, { useContext } from 'react';
import { Loading } from './Loading';
import { validUrl, onlyDigits, sendGetRequestToServer } from '../utils/utilities';
import { book, defaultProps } from "../types/interfaces";
import { Upload } from './Upload';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';

interface getgrbookdetailsResponse{
  statusCode : number,
  body : book
}

export function FetchGoodreads({ widgetCallback } : defaultProps){
  const { colorScheme } = useContext(ColorSchemeCtx);

  const getBookData = ()=>{
    const bs_url_input = document.getElementById("bs_url_input") as HTMLInputElement;
    if(!bs_url_input.value) {
      toast.info("You have to provide a URL or Book ID to continue!");
      return;
    }
    let bs_url : string = bs_url_input.value.split('?')[0];
    if(!validUrl(bs_url) && !onlyDigits(bs_url)) {
      toast.error("Invalid URL/Book ID provided. Please try again!");
      return;
    }
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookdetails", "url=" + encodeURIComponent(bs_url), (res : string)=>{
      const originCallback = ()=>{widgetCallback(<FetchGoodreads widgetCallback={widgetCallback} />);}
      const responseObject : getgrbookdetailsResponse = JSON.parse(res);
      if(responseObject.statusCode !== 200) {
        if(responseObject.body && responseObject.body.book_id) {
          toast.info("Something went wrong fetching the book details - please fill out the form manually.");
          widgetCallback(<Upload widgetCallback={widgetCallback} prefill={{book_id: responseObject.body.book_id, author: "", title: ""}} originCallback={originCallback}/>);
        }
        else {
          toast.error("Something went wrong fetching the book details - maybe an invalid URL/book_id?");
          widgetCallback(<FetchGoodreads widgetCallback={widgetCallback} />);
        }
        return;
      }
      let book : book = responseObject.body;
      widgetCallback(<Upload widgetCallback={widgetCallback} prefill={book} originCallback={originCallback}/>)
    });
  }
  return(
    <div className="bs_input_section">
      <input type="text" placeholder="Paste Goodreads URL/Book ID" className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="bs_url_input"/>
      <button id="bs_enter_button" className="bs_button" onClick={getBookData}>Get Book Data</button>
    </div>
  )
}