import React, { useContext } from "react";
import { getCookie, loggedIn, onlyNumbers, sendPostRequestToServer } from "../utils/utilities";
import { book, defaultProps, foundBook } from "../types/interfaces";
import { Loading } from "./Loading";
// @ts-ignore
import ColorThief from "colorthief"; //needed suppression for this error:   Try `npm i --save-dev @types/pioug__colorthief` if it exists or add a new declaration (.d.ts) file containing `declare module 'colorthief';`
import { Title } from "./Title";
import { ColorSchemeCtx } from "../ColorSchemeContext";
import { toast } from "react-toastify";
import { IMG_URL_PREFIX } from "../types/constants";
const SHOW_PREVIOUSLY_UPLOAD_IMAGE : boolean = false;

interface uploadProps extends defaultProps{
  prefill ?: book,
  foundBook ?: foundBook,
  originCallback : Function
}
interface uploadForm {
  title:string,
  book_id:string,
  dimensions:string,
  pubDate?:string,
  authorName?:string,
  genre?:string,
}
interface spinePostRequest {
  title : string,
  book_id : string | number,
  authorName : string,
  dimensions : string,
  genre : string,
  pubDate : string,
  isbn : string,
  isbn13 : string,
  image : string,
  username : string,
  authtoken : string,
  domColor : string,
  upload_id ?: string,
  replace_img ?: boolean,
  keep_upload ?: boolean
}
interface spinePostResponse {
  statusCode : number, 
  body: {
    upload_id : string,
    already_uploaded : boolean,
    fileName ?: string
  } | string
}

//TODO: if a user uploads a landscape image, it totally messes up the CSS. Now, this might not be a problem, as almost all book spines should be portrait, but if we get a landscape image, maybe we can rotate it for the user.

export function Upload({widgetCallback, prefill, originCallback, foundBook} : uploadProps){
  const validDimensions = (string : string) => { return (string.match(/^([0-9]+\.*[0-9]* *[xX] *){2}([0-9]+\.*[0-9]*)/) != null); }
  const { colorScheme } = useContext(ColorSchemeCtx);
  
  let disable_title = false, disable_book_id = false, disable_author = false, disable_pubDate = false, disable_genre = false;
  let defaultFormState : uploadForm = {title:"", book_id:"", dimensions:"", pubDate:"", authorName:"", genre:""}
  if(prefill) {
    defaultFormState = {title : prefill.title, book_id : prefill.book_id, dimensions : "", pubDate : prefill.pubDate, authorName : prefill.author, genre : prefill.genre};
     //use !! to convert non-empty string to true
    disable_title = !!prefill.title;
    disable_book_id = !!prefill.book_id;
    disable_author = !!prefill.author;
    disable_pubDate = !!prefill.pubDate;
    disable_genre = !!prefill.genre;
  }
  if(foundBook) {
    defaultFormState = {title : foundBook.title, book_id : foundBook.book_id, dimensions : foundBook.dimensions, pubDate : foundBook.pubDate, authorName : foundBook.author, genre : foundBook.genre};
  }

  const [formState, setFormState] = React.useState<uploadForm>(defaultFormState);
  const [b64Image, setB64Image] = React.useState<string>(foundBook ? IMG_URL_PREFIX + foundBook.fileName : "");
  const [display_uploaded, set_display_uploaded] = React.useState<boolean>(foundBook ? true : false);
  const encodeImageFileAsURL = (event:React.ChangeEvent<HTMLInputElement>)=>{
    if(!event.target.files || event.target.files.length === 0) return;
    const file : File = event.target.files[0];
    const FIVE_MB : number = 5242880;
    if(file.size > FIVE_MB){
      toast.info("Please select a file with a size less than 5 MB. (You can probably get this file size by running your image through a compressor or converting it to a jpg)");
      return;
    }
    var reader = new FileReader();
    reader.onloadend = function() {
      if(typeof reader.result === "string") {
        setB64Image(reader.result);
        set_display_uploaded(true);
      } else {
        toast.error("something went wrong with that file upload, please try again.");
      }
    }
    reader.readAsDataURL(file);
  }
  const handleChange = (event : any)=>{
    setFormState((s)=>{
      type ObjectKey = keyof typeof s;
      let i = event.target.id as ObjectKey;
      s[i] = event.target.value;
      return s;
    });
  };
  const return_to_prev_page = ()=>{originCallback()};
  const submit = ()=>{
    let validInput : boolean = true;

    if(!onlyNumbers(formState.book_id)){
      toast.error("Invalid Goodreads book id!");
      document.getElementById("book_id")?.classList.add("bs_failed_input");
      validInput = false;
    } 
    else { document.getElementById("book_id")?.classList.remove("bs_failed_input"); }

    if(!validDimensions(formState.dimensions)) {
      toast.error("Invalid dimension input. Should be in format 1 x 2 x 3");
      document.getElementById("dimensions")?.classList.add("bs_failed_input");
      validInput = false;
    }
    else { document.getElementById("dimensions")?.classList.remove("bs_failed_input"); }

    if(!loggedIn()){
      toast.error("must be logged in to submit new spine");
      validInput = false;
    }

    if(!b64Image){
      toast.error("must provide a spine image to upload.");
      validInput = false;
    }

    if(!validInput) return;

    widgetCallback(<Loading/>);
    //TODO: don't allow the user to "Save Changes" if no changes have been made. Probably best to disable to button.
    const genSpinePostRequest = (domColor : string, keep_upload : boolean) : spinePostRequest => {
      let data : spinePostRequest = {
        title : formState.title,
        book_id : formState.book_id,
        authorName : formState.authorName ? formState.authorName : "",
        dimensions : formState.dimensions,
        genre : formState.genre ? formState.genre : "",
        pubDate : formState.pubDate ? formState.pubDate : "",
        isbn : prefill?.isbn ? prefill.isbn : "",
        isbn13 : prefill?.isbn13 ? prefill.isbn13 : "",
        image : b64Image,
        username : getCookie("username"),
        authtoken : getCookie("authtoken"),
        domColor : domColor
      };
      if(foundBook) {
        data.replace_img = true;
        data.upload_id = foundBook.upload_id;
        data.keep_upload = keep_upload;
        if(keep_upload) data.image = "empty";
      }
      return data;
    }

    const sendSpinePost = (data : spinePostRequest) => {
      sendPostRequestToServer("spine", data, (res : string) => {
        const parsed_res : spinePostResponse = JSON.parse(res);
        if(parsed_res.statusCode !== 200) {
          toast.error("something went wrong with your upload. Try again later?");
          originCallback();
          return;
        }
        if(typeof parsed_res.body === 'object' && !parsed_res.body.already_uploaded) {
          toast.success("Congrats! Your spine for " + data.title + " was successfully uploaded.");
          originCallback(true);
          return;
        }
        if(typeof parsed_res.body === 'object' && parsed_res.body.already_uploaded && parsed_res.body.fileName && parsed_res.body.upload_id) {
          const upload_id : string = parsed_res.body.upload_id;
          const replace_upload = () => {
            data.replace_img = true;
            data.upload_id = upload_id;
            widgetCallback(<Loading/>);
            sendSpinePost(data);
          };
          widgetCallback(
          <div>
            <Title title="Already Uploaded" backArrowOnClick={()=>{originCallback()}}/>
            {SHOW_PREVIOUSLY_UPLOAD_IMAGE && 
            <img src={IMG_URL_PREFIX.concat(parsed_res.body.fileName)} alt="uploaded_img" className="uploaded_img" id="uploaded_img" /> }
            <span>You've already uploaded a spine for this book. Would you like to replace the spine you previously uploaded?</span>
            <div className="bs_gr_id_row" style={{marginTop:"15px"}}>
              <button onClick={return_to_prev_page} className="bs_button bs_enter_button bs_gr_id_button" style={{background:"red"}}>No</button>
              <button onClick={replace_upload} className="bs_button bs_enter_button bs_gr_id_button">Yes</button>
            </div>
          </div>
          );
          return;
        }
      });
    };



    //if b64image is a the foundBook URL, that means we've previously uploaded a spine and we're keeping the previous upload. Inform the backend so it keeps the same file and domColor
    if(foundBook && b64Image === IMG_URL_PREFIX + foundBook.fileName) {
      sendSpinePost(genSpinePostRequest("", true));
      return;
    }
    let tempImage = new Image();
    tempImage.src = b64Image;
    tempImage.onload = () => {
      const colorThief = new ColorThief();
      const res = colorThief.getColor(tempImage);
      const convertRGBArrToHex = (arr : Array<number>) => {
        let str = "#";
        arr.forEach(d => str = str.concat(d.toString(16)));
        return str;
      };
      const domColor = convertRGBArrToHex(res);
      sendSpinePost(genSpinePostRequest(domColor, false));
    };
  };
    
  return(
    <div className="upload_super_container">
      <Title title="Upload Spine" backArrowOnClick={return_to_prev_page}/>
      <div className="upload_activity">
        <div className="spine_preview">
          {!display_uploaded && <div className="no_img_selected" id="no_img_placeholder">?</div>}
          {display_uploaded && <img src={b64Image} alt="uploaded_img" className="uploaded_img" id="uploaded_img" />}
        </div>
        <div className="form_elements">
          <input id="imageInput" type="file" accept="image/png, image/jpg, image/jpeg" onChange={encodeImageFileAsURL} hidden />
          <label htmlFor="imageInput" className="bs_button" id="upload_img_override_btn">Choose File</label>
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="title" type="text" placeholder="title" defaultValue={formState.title} onChange={handleChange} disabled={disable_title}/>
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="book_id" type="text" placeholder="goodreads id" defaultValue={formState.book_id} onChange={handleChange} disabled={disable_book_id} />
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="authorName" type="text" placeholder="author's name" defaultValue={formState.authorName} onChange={handleChange} disabled={disable_author}/>
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="dimensions" type="text" placeholder="book dimensions (&quot;6 x 1.18 x 9&quot;)" defaultValue={formState.dimensions} onChange={handleChange} />
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="pubDate" type="text" placeholder="year published" defaultValue={formState.pubDate} onChange={handleChange} disabled={disable_pubDate}/>
          <input className={"bs_text_input bs_text_input_".concat(colorScheme)}  id="genre" type="text" placeholder="genre" defaultValue={formState.genre} onChange={handleChange} disabled={disable_genre}/>
          <button className="bs_button" type="submit" id="uploadButton" onClick={submit}>{foundBook ? "Save Changes" : "Upload"}</button>
        </div>
      </div>
    </div>
  );
}