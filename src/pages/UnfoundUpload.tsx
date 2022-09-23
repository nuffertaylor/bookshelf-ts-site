import React from 'react';
import {Found, FoundProps} from "./Found";
import {Upload} from "./Upload";
import nextId from "react-id-generator";

export function UnfoundUpload({found, unfound, widgetCallback} : FoundProps){
  const UnfoundRow = function(book : any){
    const openUpload = ()=>{widgetCallback(<Upload widgetCallback={widgetCallback} prefill={book.book} origin={<UnfoundUpload found={found} unfound={unfound} widgetCallback={widgetCallback}/>}/>)};
    let book_title = book.book.title;
    if(book_title.length > 30) book_title = book_title.substring(0, 27) + "...";
    return (
      <div key={nextId()}>
        <div key={nextId()} className="unfound_row">
          <span className="bs_unfound_book_title" key={nextId()}>{book_title}</span>
          <button className="bs_button bs_upload_unfound" key={nextId()} onClick={openUpload}>Upload</button>
        </div>
        <div className="bs_box_line"></div>
      </div>
    );
  }
  const unfoundMapped = unfound?.map(u => <UnfoundRow book={u}/>);
  const returnToPrevPage = ()=>{widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback}/>)};
  return(
    <div className="unfound_box">
      <div id={nextId()} className="unfound_row">
        <div className="bs_title_arrow">
          <span className="arrow arrow-left" onClick={returnToPrevPage}></span>
          <span className="bs_unfound_title">Unfound Books</span>
        </div>
      </div>
      {unfoundMapped}
    </div>
  );
}