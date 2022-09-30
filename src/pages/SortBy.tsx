import React, { useState } from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { Select } from '@mantine/core';
import { sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';
import { YourShelf } from './YourShelf';
import { sort_by_color } from '../utils/colorSort';
import { DragAndDropList } from './DragAndDropList';
import { SortManual } from './SortManual';

interface sortByProps extends defaultProps{
  booklist : Array<foundBook>
}
interface genshelfRequest {
  bookList : Array<foundBook>
}
interface genshelfResponse {
  statusCode : number,
  body : string
}

export function SortBy({widgetCallback, booklist} : sortByProps){
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Generate Shelf");
  const [disabledClass, setDisabledClass] = useState<string>("bs_disabled");

  const alphabetize_list_by_author= (list : Array<foundBook>) => {
    const get_first_name = (name : string) => {
      let l = name.split(' ');
      return l[0];
    };
    const get_last_name = (name : string) => {
      let l = name.split(' ');
      return l[l.length - 1];
    };
    return list.sort((a, b)=>{
      //sort first by last name
      let nameA = get_last_name(a.author).toLowerCase();
      let nameB = get_last_name(b.author).toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;

      //then, if last name identical, sort by first name
      nameA = get_first_name(a.author).toLowerCase();
      nameB = get_first_name(b.author).toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;

      //names are essentially identical
      //at this point, see if we can sort by series
      return 0;
    });
  };

  const alphabetize_list_by_title = (list : Array<foundBook>) => {
    const remove_first_article = (title : string) => {
      const articles = ["the", "a", "an"];
      let sp = title.split(' ');
      const first_word = sp.shift();
      if(first_word && articles.includes(first_word.toLowerCase()))
        return sp.join(' ');
      return title;
    };
    return list.sort((a, b) => {
      const x = remove_first_article(a.title);
      const y = remove_first_article(b.title);
      if(x < y) return -1;
      if(x > y) return 1;
      return 0;
    });
  };

  const sort_books_by_color = (books : Array<foundBook>) => {
    let colors : Array<string> = books.map(b => b.domColor ? b.domColor : "");
    let sortedColors = sort_by_color(colors);
    let sortedBooklist : Array<foundBook> = sortedColors.flatMap(c => {
      for(let i = 0; i < books.length; i++)
        if(books[i].domColor === c) return books[i]
        return []
    });
    return sortedBooklist;
  }

  const submit_main_click = ()=>{
    if(selectValue === null) return;
    switch(selectValue){
      case "Author":
        booklist = alphabetize_list_by_author(booklist);
        break;
      case "Average Rating":
        break;
      case "Color":
        booklist = sort_books_by_color(booklist)
        break;
      case "Date Read":
        break;
      case "Title":
        booklist = alphabetize_list_by_title(booklist);
        break;
      case "User Rating":
        break;
      case "Year":
        break;
      case "Sort Manually":
        widgetCallback(<SortManual widgetCallback={widgetCallback} booklist={booklist}/>)
        return;
    }
    generateShelf();
  }

  const generateShelf = ()=>{
    widgetCallback(<Loading/>);
    const data : genshelfRequest = {
      bookList : booklist
    }
    sendPostRequestToServer("genshelf", data, (res : string)=>{
      const resObj : genshelfResponse = JSON.parse(res);
      const url : string = resObj.body as string;
      widgetCallback(<YourShelf shelf_url={url}/>)
    });
  }

  const alterSelectValue = (val:string)=>{
    if(disabledClass) setDisabledClass("");
    setSelectValue(val);
    if(val === "Sort Manually") setButtonText("Start Manual Sort");
    else setButtonText("Generate Shelf");
  }

  return(
  <div className="found_spine_box">
    <div className="found_spine_head">Sort by</div>
    <div className="custom-select" style={{width:"200px"}}>
    <Select
        data={['Default Sort', 'Author', 'Title', 'Year', 'Date Read', 'Color', 'User Rating', 'Average Rating', 'Sort Manually']}
        placeholder="Select Sort Method"
        value={selectValue}
        onChange={alterSelectValue}
      />
    </div>
    <div className="bs_button_wrapper">
      <button className={disabledClass + " bs_button"} id="sort_main_button" onClick={submit_main_click}>{buttonText}</button>
    </div>
  </div>
  )
}