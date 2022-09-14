import React from "react";
import { getCookie, loggedIn, onlyNumbers } from "../utilities";
import { book } from "../types/interfaces";

function encodeImageFileAsURL(){

}
interface uploadProps{
  widgetCallback : Function,
  prefill ?: book
}
interface uploadForm {
  title:string,
  book_id:string,
  dimensions:string,
  pubDate?:string,
  authorName?:string,
  genre?:string,
}

export function Upload({widgetCallback, prefill} : uploadProps){
  console.log(prefill);
  const validDimensions = (string : string) => { return (string.match(/^([0-9]+\.*[0-9]* *[xX] *){2}([0-9]+\.*[0-9]*)/) != null); }

  const [formState, setFormState] = React.useState<uploadForm>({title:"", book_id:"", dimensions:"", pubDate:"", authorName:"", genre:""});
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
    const data = {
      title : formState.title,
      book_id : formState.book_id,
      dimensions : formState.dimensions,
      pubDate : formState.pubDate,
      authorName : formState.authorName,
      genre : formState.genre,
      // image : b64Image,
      username : getCookie("username"),
      authtoken : getCookie("authtoken")
    };
  }
  return(
    <div className="upload_activity">
      <div className="spine_preview">
        <div className="no_img_selected">?</div>
        <img src="" alt="uploaded_img" className="uploaded_img" style={{display:"none"}} />
      </div>
      <div className="form_elements">
        <input id="imageInput" type="file" accept="image/*" onChange={encodeImageFileAsURL} hidden />
        <label htmlFor="imageInput" className="bs_button" id="upload_img_override_btn">Choose File</label>
        <input className="bs_text_input" id="title" type="text" placeholder="title" defaultValue={formState.title} onChange={handleChange} />
        <input className="bs_text_input" id="book_id" type="text" placeholder="goodreads id" defaultValue={formState.book_id} onChange={handleChange} />
        <input className="bs_text_input" id="authorName" type="text" placeholder="author's name" defaultValue={formState.authorName} onChange={handleChange} />
        <input className="bs_text_input" id="dimensions" type="text" placeholder="book dimensions (&quot;6 x 1.18 x 9&quot;)" defaultValue={formState.dimensions} onChange={handleChange} />
        <input className="bs_text_input" id="pubDate" type="text" placeholder="year published" defaultValue={formState.pubDate} onChange={handleChange} />
        <input className="bs_text_input" id="genre" type="text" placeholder="genre" defaultValue={formState.genre} onChange={handleChange} />
        <button className="bs_button" type="submit" id="uploadButton" onClick={submit}>Upload</button>
      </div>
    </div>
  );
}