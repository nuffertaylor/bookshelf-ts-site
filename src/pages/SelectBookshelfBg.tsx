import { Select } from '@mantine/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { defaultProps } from "../types/interfaces";
import { sendGetRequestToServer } from '../utils/utilities';
import { Loading } from './Loading';

export interface shelf_bg{
    bg_id : string,
    submitter : string,
    filename : string,
    width_inches : number,
    width_pixels : number,
    shelf_bottoms : number[],
    shelf_left : number,
    timestamp : number,
    title : string
}
interface selectBookshelfProps extends defaultProps {
  shelf_bgs ?: shelf_bg[]
}
interface getShelfBgResponse {
  statusCode : number,
  body : shelf_bg[]
}

export function SelectBookshelfBg({widgetCallback, shelf_bgs} : selectBookshelfProps){
  if(!shelf_bgs) {
    widgetCallback(<Loading/>);
    shelf_bgs = [];
    sendGetRequestToServer("shelfbg", "", (json:string)=>{
      const res : getShelfBgResponse = JSON.parse(json);
      if(res.statusCode !== 200) {
        toast.error("failed to fetch shelf backgrounds; please try again later.");
        return;
      }
      widgetCallback(<SelectBookshelfBg widgetCallback={widgetCallback} shelf_bgs={res.body}/>);
    });
  }
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const alterSelectValue = (val:string)=>{
    setSelectValue(val);
  }
  const [selectData, setSelectData] = useState<shelf_bg[]>(shelf_bgs);

  return(
    <div>
      <div className="custom-select" style={{width:"200px"}}>
        <Select
            data={selectData.map(d => d.title)}
            placeholder="Choose a Bookshelf"
            value={selectValue}
            onChange={alterSelectValue}
          />
      </div>
    </div>
  );
}
