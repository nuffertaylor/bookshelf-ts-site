import React from "react";
import { Title } from "./Title";

export function AboutApi(){
  return(
    <div>
      <Title title={"API"} includeArrow={false} includeBottomLine={false}/>
      <span>A Public Book Spine API is a work in progress. It will be the world's largest book spine API (by virtue of being the only one). You'll be able to poll for books via their title, author, or goodreads book id. We may be able to add other ways to query down the line, if requested. Once the public API is developed, you'll be able to submit a request for an API key (and see documentation) here.</span>
    </div>
  );
}