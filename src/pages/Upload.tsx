import React from "react";
import { getCookie, loggedIn, onlyNumbers, sendPostRequestToServer } from "../utils/utilities";
import { book, defaultProps } from "../types/interfaces";
import { Loading } from "./Loading";
// @ts-ignore
import ColorThief from "colorthief"; //needed suppression for this error:   Try `npm i --save-dev @types/pioug__colorthief` if it exists or add a new declaration (.d.ts) file containing `declare module 'colorthief';`
import { Title } from "./Title";
interface uploadProps extends defaultProps{
  prefill ?: book,
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

//TODO: if a user uploads a landscape image, it totally messes up the CSS. Now, this might not be a problem, as almost all book spines should be portrait, but if we get a landscape image, maybe we can rotate it for the user.

export function Upload({widgetCallback, prefill, originCallback} : uploadProps){
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
    const FIVE_MB : number = 5242880;
    if(file.size > FIVE_MB){
      alert("Please select a file with a size less than 5 MB. (You can probably get this file size by running your image through a compressor or converting it to a jpg)");
      return;
    }
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
    let tempImage = new Image();
    tempImage.src = b64Image;
    tempImage.onload = ()=>{
      const colorThief = new ColorThief();
      const res = colorThief.getColor(tempImage);
      const convertRGBArrToHex = (arr : Array<number>) => {
        let str = "#";
        arr.forEach(d => str = str.concat(d.toString(16)));
        return str;
      };
      const domColor = convertRGBArrToHex(res);
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
        domColor : domColor
      };
      sendPostRequestToServer("spine", data, (res : string) => {
        alert("Congrats! Your spine for " + data.title + " was successfully uploaded.");
        originCallback(true);
      });
  }
  };
  const returnToPrevPage = ()=>{originCallback()};
  return(
    <div className="upload_super_container">
      <Title title="Upload Spine" backArrowOnClick={returnToPrevPage}/>
      <div className="upload_activity">
        <div className="spine_preview">
          {!display_uploaded && <div className="no_img_selected">?</div>}
          {display_uploaded && <img src={b64Image} alt="uploaded_img" className="uploaded_img" id="uploaded_img" />}
        </div>
        <div className="form_elements">
          <input id="imageInput" type="file" accept="image/png, image/jpg, image/jpeg" onChange={encodeImageFileAsURL} hidden />
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