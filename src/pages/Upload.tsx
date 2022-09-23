import React, { ReactElement } from "react";
import { getCookie, loggedIn, onlyNumbers, sendPostRequestToServer } from "../utilities";
import { book, defaultProps } from "../types/interfaces";
import { Loading } from "./Loading";

interface uploadProps extends defaultProps{
  prefill ?: book,
  origin : ReactElement
}
interface uploadForm {
  title:string,
  book_id:string,
  dimensions:string,
  pubDate?:string,
  authorName?:string,
  genre?:string,
}

export function Upload({widgetCallback, prefill, origin} : uploadProps){
  const validDimensions = (string : string) => { return (string.match(/^([0-9]+\.*[0-9]* *[xX] *){2}([0-9]+\.*[0-9]*)/) != null); }
  
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
  const [formState, setFormState] = React.useState<uploadForm>(defaultFormState);
  const [b64Image, setB64Image] = React.useState<string>("");
  const [display_uploaded, set_display_uploaded] = React.useState<boolean>(false);
  const encodeImageFileAsURL = (event:React.ChangeEvent<HTMLInputElement>)=>{
    if(!event.target.files || event.target.files.length === 0) return;
    const file : File = event.target.files[0];
    // document.getElementById('displayImage').src = window.URL.createObjectURL(file);
    var reader = new FileReader();
    reader.onloadend = function() {
      if(typeof reader.result === "string") {
        setB64Image(reader.result);
        set_display_uploaded(true);
      } else {
        alert("something went wrong with that file upload, please try again.");
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
  const submit = ()=>{
    if(!onlyNumbers(formState.book_id)){
      alert("invalid goodreads book id!");
      document.getElementById("book_id")?.focus();
      return;
    }
    if(!validDimensions(formState.dimensions)) {
      alert("invalid dimension input, should be in format 1 x 2 x 3");
      document.getElementById("dimensions")?.focus();
      return;
    }
    if(!loggedIn()){
      alert("must be logged in to submit new spine");
      return;
    }
    if(!b64Image){
      alert("must provide a spine image to upload.");
      return;
    }
    widgetCallback(<Loading/>)
    const data = {
      title : formState.title,
      book_id : formState.book_id,
      authorName : formState.authorName,
      dimensions : formState.dimensions,
      genre : formState.genre,
      pubDate : formState.pubDate,
      isbn : prefill?.isbn ? prefill.isbn : "",
      isbn13 : prefill?.isbn13 ? prefill.isbn13 : "",
      image : b64Image,
      username : getCookie("username"),
      authtoken : getCookie("authtoken"),
    };
    sendPostRequestToServer("spine", data, (res : string) => {
      //empty callback for calcdomcolor. we just need to send the request to get the calculation going on the server
      sendPostRequestToServer("calcdomcolor", JSON.parse(res), ()=>{});

      alert("Congrats! Your spine for " + data.title + " was successfully uploaded.");
      widgetCallback(origin);

    });
  };
  const returnToPrevPage = ()=>{widgetCallback(origin);};
  return(
    <div className="upload_super_container">
      <div className="bs_title_arrow" style={{marginBottom : "10px"}}>
        <span className="arrow arrow-left" onClick={returnToPrevPage}></span>
        <span className="bs_unfound_title">Upload Spine</span>
      </div>
      <div className="upload_activity">
        <div className="spine_preview">
          {!display_uploaded && <div className="no_img_selected">?</div>}
          {display_uploaded && <img src={b64Image} alt="uploaded_img" className="uploaded_img" id="uploaded_img" />}
        </div>
        <div className="form_elements">
          <input id="imageInput" type="file" accept="image/*" onChange={encodeImageFileAsURL} hidden />
          <label htmlFor="imageInput" className="bs_button" id="upload_img_override_btn">Choose File</label>
          <input className="bs_text_input" id="title" type="text" placeholder="title" defaultValue={formState.title} onChange={handleChange} disabled={disable_title}/>
          <input className="bs_text_input" id="book_id" type="text" placeholder="goodreads id" defaultValue={formState.book_id} onChange={handleChange} disabled={disable_book_id} />
          <input className="bs_text_input" id="authorName" type="text" placeholder="author's name" defaultValue={formState.authorName} onChange={handleChange} disabled={disable_author}/>
          <input className="bs_text_input" id="dimensions" type="text" placeholder="book dimensions (&quot;6 x 1.18 x 9&quot;)" defaultValue={formState.dimensions} onChange={handleChange} />
          <input className="bs_text_input" id="pubDate" type="text" placeholder="year published" defaultValue={formState.pubDate} onChange={handleChange} disabled={disable_pubDate}/>
          <input className="bs_text_input" id="genre" type="text" placeholder="genre" defaultValue={formState.genre} onChange={handleChange} disabled={disable_genre}/>
          <button className="bs_button" type="submit" id="uploadButton" onClick={submit}>Upload</button>
        </div>
      </div>
    </div>
  );
}