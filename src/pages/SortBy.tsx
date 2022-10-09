import React, { useState } from 'react';
import { book, defaultProps, foundBook } from '../types/interfaces';
import { Select } from '@mantine/core';
import { sendPostRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';
import { YourShelf } from './YourShelf';
import { sort_by_color } from '../utils/colorSort';
import { SortManual } from './SortManual';
import { Landing } from './Landing';

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

export const alphabetize_by_title_algo = (a : book, b : book) => {
  const remove_first_article = (title : string) => {
    const articles = ["the", "a", "an"];
    let sp = title.split(' ');
    const first_word = sp.shift();
    if(first_word && articles.includes(first_word.toLowerCase()))
      return sp.join(' ');
    return title;
  };
  const x = remove_first_article(a.title).trim();
  const y = remove_first_article(b.title).trim();
  if(x < y) return -1;
  if(x > y) return 1;
  return 0;
}

export const alphabetize_list_by_title = (list : Array<foundBook>) => {
  if(!list) return list;
  return list.sort((a, b) => alphabetize_by_title_algo(a, b));
};

export function SortBy({widgetCallback, booklist} : sortByProps){
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Generate Shelf");
  const [disabledClass, setDisabledClass] = useState<string>("bs_disabled");

  const alphabetize_list_by_author = (list : Array<foundBook>)=> {
    const sort_by_series = (a : string, b : string) : -1 | 0 | 1 => {
      if(a.charAt(a.length-1) !== ')' || b.charAt(b.length-1) !== ')') return 0;
      const find_index_of_opening_prin = (s : string) => {
        for(let i = s.length-1; i > 0; i--){
          let closing_prin_counter = 0;
          if(s.charAt(i) === ')') closing_prin_counter += 1;
          else if(s.charAt(i) === '(') closing_prin_counter -= 1;
          if(closing_prin_counter === 0) return i;
        }
        return -1;
      };
      const indexA = find_index_of_opening_prin(a);
      const indexB = find_index_of_opening_prin(b);
      //if either index is -1, we know something went wrong finding the opening parenthesis
      if(indexA === -1 || indexB === -1) return 0;

      const seriesA = a.substring(indexA);
      const seriesB = b.substring(indexB);
      if(seriesA < seriesB) return -1;
      if(seriesA > seriesB) return 1;
      return 0;
    };
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

      //names are identical
      //at this point, see if we can sort by series
      const res = sort_by_series(a.title, b.title);
      if(res !== 0) return res;

      //if they aren't in a series, just sort by title
      return alphabetize_by_title_algo(a, b);
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
        widgetCallback(<SortManual widgetCallback={widgetCallback} booklist={booklist} genShelf={generateShelf}/>)
        return;
    }
    generateShelf(booklist);
  }

  const generateShelf = (bl : foundBook[])=>{
    widgetCallback(<Loading/>);
    const data : genshelfRequest = {
      bookList : bl
    }
    sendPostRequestToServer("genshelf", data, (res : string)=>{
      const resObj : genshelfResponse = JSON.parse(res);
      if(resObj.statusCode !== 200) {
        alert("something went wrong generating your shelf. Please try again later.");
        widgetCallback(<Landing widgetCallback={widgetCallback}/>);
        return;
      }
      const url : string = resObj.body as string;
      widgetCallback(<YourShelf shelf_url={url} widgetCallback={widgetCallback}/>)
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
        data={[
          'Default Sort',
          'Author',
          'Title',
          //TODO: Additional sort methods
          // 'Year',
          // 'Date Read',
          'Color',
          // 'User Rating',
          // 'Average Rating',
          'Sort Manually'
        ]}
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
