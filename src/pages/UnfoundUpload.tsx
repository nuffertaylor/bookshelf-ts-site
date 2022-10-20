import React from 'react';
import {Found, FoundProps} from "./Found";
import {Upload} from "./Upload";
import nextId from "react-id-generator";
import { Title } from './Title';
import { sendGetRequestToServer } from '../utils/utilities';
import { book, foundBook } from '../types/interfaces';
import { alphabetize_by_title_algo } from './SortBy';
import { getgrbookshelfResponse } from './Create';

export function UnfoundUpload({found, unfound, widgetCallback, colorScheme, querystr} : FoundProps){
  const sortedUnfound = unfound.sort(alphabetize_by_title_algo);
  const originCallback = (changesMade = false)=>{
    if(changesMade){
      sendGetRequestToServer("getgrbookshelf", querystr, (res : string)=>{
        const resObj : getgrbookshelfResponse = JSON.parse(res);
        if(resObj.statusCode !== 200){
          alert("something went wrong reloading your bookshelf.");
          document.location.reload();
          return;
        }
        const f : Array<foundBook> = resObj["body"]["found"];
        const u : Array<book> = resObj["body"]["unfound"];
        widgetCallback(<UnfoundUpload found={f} unfound={u} widgetCallback={widgetCallback} colorScheme={colorScheme} querystr={querystr}/>);
      });
      return;
    }
    widgetCallback(<UnfoundUpload found={found} unfound={unfound} widgetCallback={widgetCallback} colorScheme={colorScheme} querystr={querystr}/>);
  }

  interface unfoundRowProps { book : book }
  const UnfoundRow = function({book} : unfoundRowProps){
    const openUpload = ()=>{widgetCallback(<Upload widgetCallback={widgetCallback} colorScheme={colorScheme} prefill={book} originCallback={originCallback}/>)};
    let book_title = book.title;
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

  const unfoundMapped = sortedUnfound.map(u => <UnfoundRow book={u}/>);
  const returnToPrevPage = ()=>{widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback} colorScheme={colorScheme} querystr={querystr}/>)};
  return(
    <div className="unfound_box">
      <Title title="Unfound Book Spines" backArrowOnClick={returnToPrevPage}/>
      {unfoundMapped}
    </div>
  );
}