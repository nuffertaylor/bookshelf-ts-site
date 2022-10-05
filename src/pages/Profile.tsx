import React, { useState } from 'react';
import nextId from 'react-id-generator';
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
  const loading = [<Loading/>];
  const [submissionsSection, setSubmissionsSection] = useState(loading);
  const [shelvesSection, setShelvesSection] = useState(loading);
  const [loadedSubmissions, setLoadedSubmissions] = useState(false);
  const [loadedShelves, setLoadedShelves] = useState(false);
  const IMG_URL_PREFIX : string = "https://bookshelf-spines.s3.amazonaws.com/";

  //async load submissions section
  const async_load_submissions = () => {
    sendGetRequestToServer("getbookspinesbysubmitter", "username=".concat(username), (res:string)=>{
      const parsedRes : getbookspinesbysubmitterResponse = JSON.parse(res);
      if(parsedRes.statusCode !== 200){
        setSubmissionsSection([<div key={nextId()} className="profile_err_text_container"><span className="profile_err_text">Something went wrong loading your spine submissions.</span></div>]);
        return;
      }

      const foundBooks : foundBook[] = alphabetize_list_by_title(parsedRes.body);

      if(!foundBooks || foundBooks.length === 0){
        setSubmissionsSection([<div key={nextId()} className="profile_err_text_container"><span className="profile_err_text">You haven't submitted any book spine images.</span></div>]);
        return;
      }

      const built = foundBooks.map(b => 
        <div key={b.upload_id}>
          <a href={IMG_URL_PREFIX + b.fileName}>{b.title}</a>
          <div style={{marginTop:"10px"}} className="bs_box_line"></div>
        </div>
      );
      setSubmissionsSection(built);
      setLoadedSubmissions(true);
    });
  };

  //async load shelves section
  const async_load_shelves = ()=>{
    sendGetRequestToServer("getownershelves", "username=".concat(username), (res:string)=>{
      const parsedRes : getownershelvesResponse = JSON.parse(res);
      if(parsedRes.statusCode !== 200){
        setShelvesSection([<div key={nextId()} className="profile_err_text_container"><span className="profile_err_text">Something went wrong loading you bookshelves.</span></div>]);
        return;
      }

      let shelfImages : shelfImage[] = parsedRes.body;
      //sort shelves by date created
      shelfImages.sort((a, b) => {
        if(a.timestamp < b.timestamp) return -1;
        if(a.timestamp > b.timestamp) return 1;
        return 0;
      });

      if(!shelfImages || shelfImages.length === 0){
        setShelvesSection([<div key={nextId()} className="profile_err_text_container"><span className="profile_err_text">You haven't saved any bookshelves.</span></div>]);
        return;
      }

      interface shelfImageElementProps{ s : shelfImage };
      const ShelfImageElement = ({s} : shelfImageElementProps) => {
        const date = new Date(s.timestamp*1000);
        const date_str : string = date.toLocaleDateString();
        const shelf_url = IMG_URL_PREFIX + s.filename;

        //TODO: Add functionality to name saved shelf
        //TODO: Allow user to delete saved shelf
        //TODO: maybe move all the functionality - when you click on a given shelf, it pops up full screen, and then you can mess with it
        return (
        <div className="shelf_image_element_container">
          <span className="shelf_image_date">{date_str}</span>
          <img src={shelf_url} className="shelf_image_element_img" alt={"shelf generated on " + date_str}/>
          <a href={shelf_url} download="myshelf">
            <button className="bs_shelf_buttons" style={{transform: "scale(.7)", width:"100px"}}>download</button>
          </a>
        </div>
        );
      }

      const built = shelfImages.map(s => <ShelfImageElement s={s}/>);
      setShelvesSection(built);
      setLoadedShelves(true);
    });
  };

  const flipArrow = (prev:string)=>{
    if(prev==="arrow-right") return "arrow-down";
    return "arrow-right";
  }

  const flipSubmissions = ()=>{
    setYourSubmissionsArrow(flipArrow);
    if(!loadedSubmissions) async_load_submissions();
  }

  const flipBookshelves = ()=>{
    setYourBookshelvesArrow(flipArrow);
    if(!loadedShelves) async_load_shelves();
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
      <div className={yourBookshelvesArrow === "arrow-right" ? "hide" :  loadedShelves ? "shelves_section_grid" : ""}>
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