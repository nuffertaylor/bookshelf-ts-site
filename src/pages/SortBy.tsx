import React, { MouseEventHandler, useState } from 'react';
import { book, defaultProps } from '../types/interfaces';
import { Select } from '@mantine/core';
import { sendPostRequestToServer } from '../utilities';
import { Loading } from './Loading';
import { YourShelf } from './YourShelf';

interface sortByProps extends defaultProps{
  booklist : Array<book>
}
interface genshelfRequest {
  bookList : Array<Object>
}
interface genshelfResponse {
  statusCode : number,
  body : string
}

export function SortBy({widgetCallback, booklist} : sortByProps){
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Generate Shelf");
  const [disabledClass, setDisabledClass] = useState<string>("bs_disabled");

  const submit_main_click = ()=>{
    if(selectValue === null) return;
    //TODO: Add sort method calls here before calling generateShelf for each type
    generateShelf();
  }

  const generateShelf = ()=>{
    widgetCallback(<Loading/>);
    const data = {
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
        data={['Default Sort', 'Title', 'Year', 'Date Read', 'Author', 'Color', 'User Rating', 'Average Rating', 'Sort Manually']}
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