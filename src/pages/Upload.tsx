import React from "react";

function encodeImageFileAsURL(){

}

export function Upload(){
  return(
    <div className="upload_activity">
      <div className="spine_preview">
        <div className="no_img_selected">?</div>
        <img src="" alt="uploaded_img" className="uploaded_img" style={{display:"none"}} />
      </div>
      <div className="form_elements">
        <input id="imageInput" type="file" accept="image/*" onChange={encodeImageFileAsURL} hidden />
        <label htmlFor="imageInput" className="bs_button" id="upload_img_override_btn">Choose File</label>
        <input className="bs_text_input" id="title" type="text" placeholder="title" />
        <input className="bs_text_input" id="book_id" type="text" placeholder="goodreads id" />
        <input className="bs_text_input" id="authorName" type="text" placeholder="author's name" />
        <input className="bs_text_input" id="dimensions" type="text" placeholder="book dimensions (&quot;6 x 1.18 x 9&quot;)" />
        <input className="bs_text_input" id="pubDate" type="text" placeholder="year published" />
        <input className="bs_text_input" id="genre" type="text" placeholder="genre" />
        <button className="bs_button" type="submit" id="uploadButton">Upload</button>
      </div>
    </div>
  );
}