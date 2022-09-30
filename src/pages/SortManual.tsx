import React from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { DragAndDropList } from './DragAndDropList';
import { SortBy } from './SortBy';

interface sortManualProps extends defaultProps{
  booklist : Array<foundBook>
}
export function SortManual({widgetCallback, booklist} : sortManualProps){
  const returnToSortBy = ()=>{widgetCallback(<SortBy widgetCallback={widgetCallback} booklist={booklist}/>)};
  const submit_man_sort = ()=>{
    
  };
  return(
    <div>
      <div className="bs_title_arrow">
        <span className="arrow arrow-left" onClick={returnToSortBy}></span>
        <span className="bs_unfound_title">Sort Manually</span>
      </div>
      <DragAndDropList data={booklist}/>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submit_man_sort}>Generate Shelf</button>
      </div>
    </div>
  )
}