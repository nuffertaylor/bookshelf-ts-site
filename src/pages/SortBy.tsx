import React, { useEffect, useState } from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { Select } from '@mantine/core';
import { get_default_shelf_height_inches } from '../utils/utilities';
import { YourShelf } from './YourShelf';
import {
  alphabetize_by_title_algo, alphabetize_list_by_title, alphabetize_list_by_author,
  sort_books_by_color, sort_books_by_date, sort_books_by_height, sort_books_by_rating, sort_books_by_year
} from '../utils/sorting';
import { SortManual } from './SortManual';
import { toast } from 'react-toastify';
import { Loading } from './Loading';
import { BookshelfRenderer, BookshelfRendererParams } from '../utils/BookshelfRenderer';
import { CustomizeShelf } from './CustomizeShelf';

export interface sortByProps extends defaultProps{
  booklist : Array<foundBook>
}

// The sorting algorithms live in utils/sorting.ts (with tests). Re-exported here for existing importers.
export { alphabetize_by_title_algo, alphabetize_list_by_title };

export function SortBy({widgetCallback, booklist} : sortByProps) {
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Generate Shelf");
  const [disabledClass, setDisabledClass] = useState<string>("bs_disabled");
  const [showCustomizeButton, setShowCustomizeButton] = useState<string>("");
  const [sortedBooklist, setSortedBooklist] = useState<Array<foundBook>>(booklist);


  const sortBookList = () => {
    if(selectValue === null) return;
    let sorted: Array<foundBook>;
    switch(selectValue){
      case "Author":
        sorted = alphabetize_list_by_author(booklist);
        break;
      case "Average Rating":
        sorted = sort_books_by_rating(booklist, "average_rating");
        break;
      case "Color":
        sorted = sort_books_by_color(booklist);
        break;
      case "Date Read by User":
        sorted = sort_books_by_date(booklist, "user_read_at");
        break;
      case "Height":
        sorted = sort_books_by_height(booklist);
        break;
      case "Title":
        sorted = alphabetize_list_by_title(booklist);
        break;
      case "User Rating":
        sorted = sort_books_by_rating(booklist, "user_rating");
        break;
      case "Publication Year":
        sorted = sort_books_by_year(booklist);
        break;
      default:
        sorted = booklist;
    }
    setSortedBooklist(sorted);
  };

  useEffect(sortBookList, [selectValue, booklist]);

  const submit_main_click = ()=>{
    if (selectValue === null) { return; }
    if (selectValue === "Sort Manually") {
      widgetCallback(<SortManual widgetCallback={widgetCallback} booklist={sortedBooklist} genShelf={generateShelf}/>)
      return;
    }
    generateShelf({books: sortedBooklist});
  };

  const customize_shelf_click = () => {
    if (selectValue === null || selectValue === "Sort Manually") {
      return;
    }
    widgetCallback(<CustomizeShelf widgetCallback={widgetCallback} booklist={sortedBooklist} genShelf={generateShelf}/>)
    return;
  };

  const generateShelf = async (params: BookshelfRendererParams) => { 
    const bookshelfRenderer = new BookshelfRenderer({
      ...params,
      shelfHeightInches: params.shelfHeightInches ?? get_default_shelf_height_inches(params.books),
    });

    widgetCallback(<Loading/>);

    try {
      const b64ShelfImage = await bookshelfRenderer.render();
      widgetCallback(<YourShelf widgetCallback={widgetCallback} from_profile={false} b64ShelfImage={b64ShelfImage} renderer={bookshelfRenderer}/>)
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
          'Date Read by User',
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
