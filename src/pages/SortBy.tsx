import React, { useEffect, useState } from 'react';
import { book, defaultProps, foundBook, shelfImage } from '../types/interfaces';
import { Select } from '@mantine/core';
import { getCookie, get_year_from_date_str, sendPostRequestToServer, split_dimensions_str_into_h_w_l } from '../utils/utilities';
import { Loading } from './Loading';
import { YourShelf } from './YourShelf';
import { sort_by_color } from '../utils/colorSort';
import { SortManual } from './SortManual';
import { Landing } from './Landing';
import { toast } from 'react-toastify';
import { BookshelfRenderer, BookshelfRendererParams } from '../utils/BookshelfRenderer';
import { CustomizeShelf } from './CustomizeShelf';

export interface sortByProps extends defaultProps{
  booklist : Array<foundBook>
}
interface genshelfRequest {
  bookList : Array<foundBook>,
  gr_shelf_name : string,
  gr_user_id : string
}
interface genshelfResponse {
  statusCode : number,
  body : shelfImage
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

export function SortBy({widgetCallback, booklist} : sortByProps) {
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Generate Shelf");
  const [disabledClass, setDisabledClass] = useState<string>("bs_disabled");
  const [showCustomizeButton, setShowCustomizeButton] = useState<string>("");


  const alphabetize_list_by_author = (list : Array<foundBook>)=> {
    const sort_by_series = (a : string, b : string) : -1 | 0 | 1 => {
      if(a.charAt(a.length-1) !== ')' || b.charAt(b.length-1) !== ')') { return 0; }
      const find_index_of_opening_prin = (s : string) => {
        for(let i = s.length-1; i > 0; i--){
          if(s.charAt(i) === '(') return i;
        }
        return -1;
      };
      const indexA = find_index_of_opening_prin(a);
      const indexB = find_index_of_opening_prin(b);
      //if either index is -1, we know something went wrong finding the opening parenthesis
      if(indexA === -1 || indexB === -1) return 0;

      const seriesAFull = a.substring(indexA);
      const seriesBFull = b.substring(indexB);
      // check if they're the same series.
      const seriesA = seriesAFull.split('#')[0];
      const seriesB = seriesBFull.split('#')[0];
      // If so, sort by the # annotation.
      if (seriesA === seriesB) {
        // some series may match and not have a specific 'num' annotation. In which case, just sort by title.
        if (seriesAFull.indexOf('#') === -1) {
          return a < b ? -1 : 1;
        }
        const seriesANum = Number(seriesAFull.split('#')[1].replace(')', ''));
        const seriesBNum = Number(seriesBFull.split('#')[1].replace(')', ''));
        return seriesANum < seriesBNum ? -1 : 1;
      }
      // else, sort alphabetically
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
  };

  const sort_books_by_year = (books :foundBook[]) => {
    return books.sort((a,b) => {
      if(a.pubDate && b.pubDate) {
        const year_a = get_year_from_date_str(a.pubDate);
        const year_b = get_year_from_date_str(b.pubDate);
        if(year_a < year_b) return -1;
        if(year_a > year_b) return 1;
        return 0;
      }
      if(a.pubDate && !b.pubDate) return 1;
      if(!a.pubDate && b.pubDate) return -1;
      return 0;
    });
  };

  const sort_books_by_rating = (books : foundBook[], rating_type : "user_rating" | "average_rating") => {
    return books.sort((a,b) => {
      const a_rating = rating_type === "user_rating" ? a.user_rating : a.average_rating;
      const b_rating = rating_type === "user_rating" ? b.user_rating : b.average_rating;
      if(a_rating && b_rating) {
        if(a_rating < b_rating) return -1;
        if(a_rating > b_rating) return 1;
        //if they have the same rating, sort books by title
        return alphabetize_by_title_algo(a,b);
      }
      if(a_rating && !b_rating) return 1;
      if(!a_rating && b_rating) return -1;
      return 0;
    });
  };

  const sort_books_by_height = (books : foundBook[]) => {
    return books.sort((a,b) => {
      const dim_a = split_dimensions_str_into_h_w_l(a.dimensions);
      const dim_b = split_dimensions_str_into_h_w_l(b.dimensions);
      if(dim_a.h < dim_b.h) return -1;
      if(dim_a.h > dim_b.h) return 1;
      return 0;
    });
  };

  const sort_books_by_date = (books : foundBook[], date_type : "user_read_at" | "pubDate") => {
    return books.sort((a,b) => {
      let a_date_str = date_type === "user_read_at" ? a.user_read_at : a.pubDate;
      let b_date_str = date_type === "user_read_at" ? b.user_read_at : b.pubDate;
      const today_date_str : string = new Date().toUTCString();
      if(typeof a_date_str === "undefined") a_date_str = today_date_str;
      if(typeof b_date_str === "undefined") b_date_str = today_date_str;
      const a_date = new Date(a_date_str);
      const b_date = new Date(b_date_str);
      if(a_date < b_date) return -1;
      if(a_date > b_date) return 1;
      return 0;
    });
  };

  const sortBookList = () => {
    if(selectValue === null) return;
    switch(selectValue){
      case "Author":
        booklist = alphabetize_list_by_author(booklist);
        break;
      case "Average Rating":
        booklist = sort_books_by_rating(booklist, "average_rating");
        break;
      case "Color":
        booklist = sort_books_by_color(booklist);
        break;
      case "Date Read by User":
        //TODO: This sort method is just busted and I haven't figured out why
        booklist = sort_books_by_date(booklist, "user_read_at");
        let x = booklist.map(b => {return {title : b.title, date: b.user_read_at}});
        console.table(x);
        // let x = booklist.map(b => {return {title : b.title, date: b.user_read_at}});
        // console.table(x);
        return;
        // break;
      case "Height":
        booklist = sort_books_by_height(booklist);
        break;
      case "Title":
        booklist = alphabetize_list_by_title(booklist);
        break;
      case "User Rating":
        booklist = sort_books_by_rating(booklist, "user_rating");
        break;
      case "Publication Year":
        booklist = sort_books_by_year(booklist);
        break;
    }
  };

  useEffect(sortBookList, [selectValue]);

  const submit_main_click = ()=>{
    if (selectValue === null) { return; }
    if (selectValue === "Sort Manually") {
      widgetCallback(<SortManual widgetCallback={widgetCallback} booklist={booklist} genShelf={generateShelf}/>)
      return;
    }
    generateShelf({books: booklist});
  };

  const customize_shelf_click = () => {
    if (selectValue === null || selectValue === "Sort Manually") {
      return;
    }
    widgetCallback(<CustomizeShelf widgetCallback={widgetCallback} booklist={booklist} genShelf={generateShelf}/>)
    return;
  };

  const generateShelf = async (params: BookshelfRendererParams) => { 
    const bookshelfRenderer = new BookshelfRenderer(params);

    bookshelfRenderer.inProgressRenderCallback = (b64ShelfImage) => {
      widgetCallback(<img alt="shelf_in_progress_render" src={b64ShelfImage} className="display_shelf" />);
    }

    try {
      const b64ShelfImage = await bookshelfRenderer.render();
      widgetCallback(<YourShelf widgetCallback={widgetCallback} from_profile={false} b64ShelfImage={b64ShelfImage}/>)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong generating your shelf. Please report this error on the discord so we can get it fixed :)")
    }
  }

  const alterSelectValue = (val: string) => {
    if (disabledClass) { setDisabledClass(""); }
    setSelectValue(val);
    if (val === "Sort Manually") {
      setButtonText("Start Manual Sort");
      setShowCustomizeButton("hide");
    }
    else {
      setButtonText("Generate Shelf");
      setShowCustomizeButton("");
    }
  }

  return(
  <div className="found_spine_box">
    <div className="bs_head">Sort by</div>
    <div className="custom-select" style={{width:"200px"}}>
    <Select
        data={[
          'Author',
          'Average Rating',
          'Color',
          // 'Date Read by User', TODO: Once this sort method is fixed.
          'Default',
          'Height',
          'Publication Year',
          'Sort Manually',
          'Title',
          'User Rating'
        ]}
        placeholder="Select Sort Method"
        value={selectValue}
        onChange={alterSelectValue}
      />
    </div>
    <div className="bs_button_wrapper">
      <button
        className={disabledClass + " bs_button"}
        id="sort_main_button"
        onClick={submit_main_click}
      >
        {buttonText}
      </button>
    </div>
    <div className="bs_button_wrapper">
      <button 
        className={disabledClass + " bs_button " + showCustomizeButton}
        id="customize_shelf_button"
        onClick={customize_shelf_click}
      >
        Customize Shelf
      </button>
    </div>
  </div>
  )
}
