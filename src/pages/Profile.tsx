import React, { ReactElement, useContext, useState } from 'react';
import nextId from 'react-id-generator';
import { toast } from 'react-toastify';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { IMG_URL_PREFIX } from '../types/constants';
import { book, defaultProps, foundBook, shelfImage, user } from '../types/interfaces';
import { getCookie, logout, onlyNumbers, remove_non_numeric_char_from_str, remove_query_string, remove_text_title, sendGetRequestToServer, sendPostRequestToServer, setCookie } from '../utils/utilities';
import { Loading } from './Loading';
import { alphabetize_by_title_algo, alphabetize_list_by_title } from './SortBy';
import { Upload } from './Upload';
import { YourShelf } from './YourShelf';
import { UnfoundRow } from './UnfoundUpload';

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

interface getunfoundtouploadResponse{
  statusCode : number,
  body : book[]
}

export function Profile({widgetCallback} : defaultProps){
  const username = getCookie("username");
  const authtoken = getCookie("authtoken");
  const [yourSubmissionsArrow, setYourSubmissionsArrow] = useState("arrow-right");
  const [yourBookshelvesArrow, setYourBookshelvesArrow] = useState("arrow-right");
  const [yourUnfoundArrow, setYourUnfoundArrow] = useState("arrow-right");
  const gr_id = getCookie("goodreads_id");
  const [goodreadsUserId, setGoodreadsUserId] = useState(gr_id);
  const loading = [<Loading/>];
  const [submissionsSection, setSubmissionsSection] = useState(loading);
  const [shelvesSection, setShelvesSection] = useState(loading);
  const [unfoundSection, setUnfoundSection] = useState(loading);
  const [loadedSubmissions, setLoadedSubmissions] = useState(false);
  const [loadedShelves, setLoadedShelves] = useState(false);
  const [loadedUnfound, setLoadedUnfound] = useState(false);
  const { colorScheme } = useContext(ColorSchemeCtx);
  const [viewSelected, setViewSelected] = useState<null | ReactElement>(null);
  const setViewSelectedCallback = (re: ReactElement) => setViewSelected(re);
  let scrollPosition = 0;

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

      const built = foundBooks.map(b => {
        let title = b.title;
        if(title.length > 30) title = title.substring(0, 27) + "...";
        return (
        <div key={b.upload_id} style={{userSelect: "none", cursor: "pointer"}}>
          <span
            className={"a_".concat(colorScheme)}
            key={b.upload_id.concat(b.fileName)} 
            onClick={() => {
              scrollPosition = window.pageYOffset;
              setViewSelected(
                <Upload 
                  foundBook={b}
                  widgetCallback={setViewSelectedCallback}
                  originCallback={() => {
                    setViewSelected(null);
                    setTimeout(() => window.scrollTo(0, scrollPosition), 0);
                  }}
                />);
            }}
          >
            {title}
          </span>
          <div key={b.upload_id.concat("line")} style={{marginTop:"10px"}} className="bs_box_line"></div>
        </div>
        );
      }
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
        const bookshelf_name = s.bookshelf_name;
        let title = bookshelf_name ? bookshelf_name : date_str;
        if(title.length > 10) title = title.substring(0,7).concat("...");

        const open_shelf_image = () => {
          widgetCallback(<YourShelf shelf_image={s} from_profile={true} widgetCallback={widgetCallback}/>);
        };

        return (
        <div className="shelf_image_container_container" key={nextId()}>
          <div className={"shelf_image_element_container shelf_image_element_container_".concat(colorScheme)} onClick={open_shelf_image} key={nextId()}>
            <span className="shelf_image_date" key={nextId()}>{title}</span>
            <img src={shelf_url} className="shelf_image_element_img" alt={"shelf generated on " + date_str} key={nextId()}/>
          </div>
        </div>
        );
      }

      const built = shelfImages.map(s => <ShelfImageElement s={s}/>);
      setShelvesSection(built);
      setLoadedShelves(true);
    });
  };

  const async_load_unfound = ()=>{
    sendGetRequestToServer("getunfoundtoupload", "username=".concat(username) + "&authtoken=".concat(authtoken), (res:string)=>{
      const parsedRes = JSON.parse(res) as getunfoundtouploadResponse;
      if (parsedRes.statusCode !== 200) {
        setUnfoundSection([<span>Something went wrong</span>]);
        return;
      }
      const sortedUnfound = parsedRes.body.sort(alphabetize_by_title_algo);
      const unfoundMapped = sortedUnfound.map(u => <UnfoundRow book={u} widgetCallback={widgetCallback} originCallback={() => {
        widgetCallback(<Profile widgetCallback={widgetCallback}/>);
      }}/>);
      setLoadedUnfound(true);
      setUnfoundSection(unfoundMapped);
    });
  }

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

  const flipUnfound = ()=>{
    setYourUnfoundArrow(flipArrow);
    if(!loadedUnfound) async_load_unfound();

  }

  const changeId = ()=>{
    let val : string = (document.getElementById("new_gr_id") as HTMLInputElement)?.value;
    if(!onlyNumbers(val)){
      val = remove_query_string(val);
      val = remove_text_title(val);
      val = remove_non_numeric_char_from_str(val);
    }
    if(!val) {
      toast.error("Invalid input. Please provide Goodreads Profile URL or User ID.");
      document.getElementById("new_gr_id")?.classList.add("bs_failed_input");
      return;
    }
    else { document.getElementById("new_gr_id")?.classList.remove("bs_failed_input"); }
    if(val === gr_id) {
      toast.error(val + " is already your saved Goodreads ID.");
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
        toast.success("Successfully set your Goodreads User ID to: " + updated_user.goodreads_id);
        setCookie("goodreads_id", updated_user.goodreads_id);
        setGoodreadsUserId(updated_user.goodreads_id);
        return;
      }
      toast.error("something went wrong saving your new goodreads user id. Please try again later.");
      return;
    });
  }

  return(
    <div>
      <div className={viewSelected ? "" : "hide"}>
        {viewSelected}
      </div>
      <div className={viewSelected ? "hide" : "bs_profile_box"}>
        <div className="bs_profile_title">
          <span className="bs_unfound_title">{username}'s Profile</span>
        </div>
        <div className="bs_profile_body">
          <div className="bs_submissions_row" onClick={flipSubmissions}>
            <span>Your Spine Submissions</span>
            <span className={("arrow " + yourSubmissionsArrow) + " arrow_" + colorScheme}></span>
          </div>
          <div style={{display : yourSubmissionsArrow === "arrow-right" ? "none" : "block"}}>
            {submissionsSection}
          </div>
          <div className="bs_submissions_row" onClick={flipBookshelves}>
            <span>Your Saved Virtual Bookshelves</span>
            <span className={("arrow " + yourBookshelvesArrow) + " arrow_" + colorScheme}></span>
          </div>
          <div className={yourBookshelvesArrow === "arrow-right" ? "hide" :  loadedShelves ? "shelves_section_grid" : ""}>
            {shelvesSection}
          </div>
          <div className="bs_submissions_row" onClick={flipUnfound}>
            <span>{"Unfound to Upload " + (loadedUnfound ? "(" + unfoundSection.length.toString() + ")" : "")}</span>
            <span className={("arrow " + yourUnfoundArrow) + " arrow_" + colorScheme}></span>
          </div>
          <div className={yourUnfoundArrow === "arrow-right" ? "hide" :  ""}>
            {unfoundSection}
          </div>
          <div className="bs_gr_id_row">
            <input type="text" placeholder="Goodreads ID" id="new_gr_id" defaultValue={goodreadsUserId} className={"bs_gr_id_input bs_text_input bs_text_input_".concat(colorScheme)} />
            <button onClick={changeId} className="bs_button bs_enter_button bs_gr_id_button">Save your ID</button>
          </div>
        </div>
        <div className="bs_center_grid">
          <button onClick={logout} className="bs_button bs_logout_button">logout</button>
        </div>
      </div>
    </div>
  )
}