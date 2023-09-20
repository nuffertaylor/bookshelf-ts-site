import React from 'react';
import {Found, FoundProps} from "./Found";
import {Upload} from "./Upload";
import nextId from "react-id-generator";
import { Title } from './Title';
import { getCookie, sendGetRequestToServer, sendPostRequestToServer } from '../utils/utilities';
import { book, foundBook } from '../types/interfaces';
import { alphabetize_by_title_algo } from './SortBy';
import { getgrbookshelfResponse } from './Create';
import { toast } from 'react-toastify';

interface SaveUnfoundToProfileReq {
  unfound: book[],
  username: string,
  authtoken: string
}

export function UnfoundUpload({found, unfound, widgetCallback, querystr} : FoundProps){
  const sortedUnfound = unfound.sort(alphabetize_by_title_algo);
  const originCallback = (changesMade = false)=>{
    if(changesMade){
      sendGetRequestToServer("getgrbookshelf", querystr, (res : string)=>{
        const resObj : getgrbookshelfResponse = JSON.parse(res);
        if(resObj.statusCode !== 200){
          toast.error("Something went wrong reloading your bookshelf.");
          document.location.reload();
          return;
        }
        const f : Array<foundBook> = resObj["body"]["found"];
        const u : Array<book> = resObj["body"]["unfound"];
        if(u.length === 0) {
          toast.success("You've uploaded all the missing spines from this shelf!");
          widgetCallback(<Found found={f} unfound={u} widgetCallback={widgetCallback} querystr={querystr}/>);
        }
        else { widgetCallback(<UnfoundUpload found={f} unfound={u} widgetCallback={widgetCallback} querystr={querystr}/>); }
      });
      return;
    }
    widgetCallback(<UnfoundUpload found={found} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>);
  }

  interface unfoundRowProps { book : book }
  const UnfoundRow = function({book} : unfoundRowProps){
    const openUpload = ()=>{widgetCallback(<Upload widgetCallback={widgetCallback} prefill={book} originCallback={originCallback}/>)};
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
  const returnToPrevPage = ()=>{widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>)};
  const authtoken = getCookie("authtoken");
  const saveUnfound = ()=>{
    const req: SaveUnfoundToProfileReq = {
      unfound: unfound,
      username: getCookie("username"),
      authtoken: authtoken,
    };
    sendPostRequestToServer("saveUnfoundToProfile", req, (res : string) => {
      const parsed_res: {statusCode: number} = JSON.parse(res);
      if (parsed_res.statusCode === 200) {
        toast.success("You've saved these books to your profile to upload later.");
      }
      else {
        toast.error("Something went wrong. Try again later?");
      }
    });
  }

  return(
    <div className="unfound_box">
      <Title title="Unfound Book Spines" backArrowOnClick={returnToPrevPage}/>
      { authtoken && <div className="bs_button_wrapper">
        <button className="bs_adaptive_button bs_gray" style={{marginBottom: '10px'}} onClick={()=>{saveUnfound()}}>Save Missing Spines To Profile</button>
        <div className="bs_box_line"></div>
      </div> }
      {unfoundMapped}
    </div>
  );
}