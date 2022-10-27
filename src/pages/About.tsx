import React from "react";
import { Title } from "./Title";

export function About(){
  return(
    <div>
      <Title title={"About"} includeArrow={false} includeBottomLine={false}/>
      <span>I made this website for two reasons: </span>
      <ul>
        <li>To allow readers (aka me, and maybe some others) to create virtual bookshelves so they can visualize the books they've read</li>
        <li>To create a database of book spine images (nothing else like that seems to exist on the internet)</li>
      </ul>
      <span>If either of those objectives interest you, you can help out! Make an account, take some pictures of your book spines, and upload them. We can make something really cool!</span>
    </div>
  );
}