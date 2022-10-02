import React, { useState } from 'react';
import { defaultProps, foundBook, shelfImage, user } from '../types/interfaces';
import { deleteCookie, getCookie, onlyNumbers, sendGetRequestToServer, sendPostRequestToServer, setCookie } from '../utils/utilities';
import { Loading } from './Loading';
import { alphabetize_list_by_title } from './SortBy';

interface setusergridRes{
  statusCode : number,
  body : user
}
interface getbookspinesbysubmitterResponse{
  statusCode : number,
  body : foundBook[]
}
interface getownershelvesResponse{
  statusCode : number,
  body : shelfImage[]
}

export function Profile({widgetCallback} : defaultProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
  const [yourSubmissionsArrow, setYourSubmissionsArrow] = useState("arrow-right");
  const [yourBookshelvesArrow, setYourBookshelvesArrow] = useState("arrow-right");
  const gr_id = getCookie("goodreads_id");
  const [goodreadsUserId, setGoodreadsUserId] = useState(gr_id);
  const [submissionsSection, setSubmissionsSection] = useState([<Loading/>]);
  const [shelvesSection, setShelvesSection] = useState([<Loading/>]);
  const IMG_URL_PREFIX : string = "https://bookshelf-spines.s3.amazonaws.com/";

  //async load submissions section
  sendGetRequestToServer("getbookspinesbysubmitter", "username=".concat(username), (res:string)=>{
    const parsedRes : getbookspinesbysubmitterResponse = JSON.parse(res);
    const foundBooks : foundBook[] = alphabetize_list_by_title(parsedRes.body);

    if(foundBooks.length === 0){
      setSubmissionsSection([<div style={{marginBottom:"15px"}}><span style={{fontStyle:"italic"}}>You haven't submitted any book spine images.</span></div>]);
      return;
    }

    const built = foundBooks.map(b => 
      <div key={b.upload_id}>
        <a href={IMG_URL_PREFIX + b.fileName}>{b.title}</a>
        <div style={{marginTop:"10px"}} className="bs_box_line"></div>
      </div>
    );
    setSubmissionsSection(built);
  });

  //async load shelves section
  sendGetRequestToServer("getownershelves", "username=".concat(username), (res:string)=>{
    const parsedRes : getownershelvesResponse = JSON.parse(res);
    const shelfImages : shelfImage[] = parsedRes.body;
    if(shelfImages.length === 0){
      setShelvesSection([<div style={{marginBottom:"15px"}}><span style={{fontStyle:"italic"}}>You haven't saved any bookshelves.</span></div>]);
      return;
    }

    //TODO: ADD CSS TO DISPLAY THESE SHELVES IN A GRID
    //TODO: ADD AN OPTION TO DELETE SHELVES FROM YOUR PROFILE
    const built = shelfImages.map(s => 
      <div>
        <img src={IMG_URL_PREFIX + s.filename} style={{height:"100px"}}/>
      </div>
    );
    setShelvesSection(built);
  });

  const flipArrow = (prev:string)=>{
    if(prev==="arrow-right") return "arrow-down";
    return "arrow-right";
  }

  const flipSubmissions = ()=>{
    setYourSubmissionsArrow(flipArrow);
  }

  //TODO: get user's saved bookshelves 
  const flipBookshelves = ()=>{
    setYourBookshelvesArrow(flipArrow);
  }

  const changeId = ()=>{
    let val = (document.getElementById("new_gr_id") as HTMLInputElement)?.value;
    if(!val) {
      alert("cannot set nothing as your id");
      return;
    }
    if(!onlyNumbers(val)){
      alert("Your goodreads id should only consist of numbers, for example : \"123\"");
      return;
    }
    const data = {
      username : username,
      authtoken : authtoken,
      goodreads_id : val
    }
    sendPostRequestToServer("setusergrid", data, (res : string)=>{
      const response : setusergridRes = JSON.parse(res);
      if(response.statusCode === 200){
        const updated_user : user = response.body;
        alert("successfully set your goodreads user id to: " + updated_user.goodreads_id);
        setCookie("goodreads_id", updated_user.goodreads_id);
        setGoodreadsUserId(updated_user.goodreads_id);
      }
    });
  }

  const logout = ()=>{
    deleteCookie("username");
    deleteCookie("authtoken");
    deleteCookie("goodreads_id");
    document.location.reload();
  }

  return(
    <div className="bs_profile_box">
    <div className="bs_profile_title">
      <span className="bs_unfound_title">{username}'s Profile</span>
    </div>
    <div className="bs_profile_body">
      <div className="bs_submissions_row" onClick={flipSubmissions}>
        <span>Your Spine Submissions</span>
        <span className={"arrow " + yourSubmissionsArrow}></span>
      </div>
      <div style={{display : yourSubmissionsArrow === "arrow-right" ? "none" : "block"}}>
        {submissionsSection}
      </div>
      <div className="bs_submissions_row" onClick={flipBookshelves}>
        <span>Your Saved Virtual Bookshelves</span>
        <span className={"arrow " + yourBookshelvesArrow}></span>
      </div>
      <div style={{display : yourBookshelvesArrow === "arrow-right" ? "none" : "block"}}>
        {shelvesSection}
      </div>
      <div className="bs_gr_id_row">
        <input type="text" placeholder="goodreads id" id="new_gr_id" defaultValue={goodreadsUserId} className="bs_text_input bs_gr_id_input" />
        <button onClick={changeId} className="bs_button bs_enter_button bs_gr_id_button" >save your ID</button>
      </div>
    </div>
    <div className="bs_center_grid">
      <button onClick={logout} className="bs_button bs_logout_button">logout</button>
    </div>
  </div>
  )
}