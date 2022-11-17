import { Select } from '@mantine/core';
import React, { useState } from 'react';
import { defaultProps } from "../types/interfaces";

export function SelectBookshelfBg({widgetCallback} : defaultProps){
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const alterSelectValue = (val:string)=>{
    setSelectValue(val);
  }
  const [selectData, setSelectData] = useState<string[]>([
    "default1.jpg"
  ])

  return(
    <div>
      <div className="custom-select" style={{width:"200px"}}>
        <Select
            data={selectData}
            placeholder="Select Sort Method"
            value={selectValue}
            onChange={alterSelectValue}
          />
      </div>
    </div>
  );
}
