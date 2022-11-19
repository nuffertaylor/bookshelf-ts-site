import { Select } from '@mantine/core';
import React, { useState } from 'react';
import { defaultProps } from "../types/interfaces";

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
  shelf_bgs : shelf_bg[]
}

export function SelectBookshelfBg({widgetCallback, shelf_bgs} : selectBookshelfProps){
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
            placeholder="Select Sort Method"
            value={selectValue}
            onChange={alterSelectValue}
          />
      </div>
    </div>
  );
}
