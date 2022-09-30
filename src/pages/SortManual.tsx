import React from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { DragAndDropList } from './DragAndDropList';
import { SortBy } from './SortBy';

interface sortManualProps extends defaultProps{
  booklist : Array<foundBook>,
  genShelf : Function
}
export function SortManual({widgetCallback, booklist, genShelf} : sortManualProps){
  const returnToSortBy = ()=>{widgetCallback(<SortBy widgetCallback={widgetCallback} booklist={booklist}/>)};
  const submit_man_sort = ()=>{ genShelf(booklist) };
  const update_booklist = (bl : foundBook[]) => { booklist = bl };

  //TODO: refactor title and back arrow into its own component (i use it enough)
  //TODO: make the title bar sticky so it stays on the top of the box on scroll
  //should I also make the submit button sticky?
  return(
    <div>
      <div className="bs_title_arrow" style={{marginBottom : "15px"}}>
        <span className="arrow arrow-left" onClick={returnToSortBy}></span>
        <span className="bs_unfound_title">Sort Manually</span>
      </div>
      <div className="bs_box_line"></div>
      <DragAndDropList data={booklist} updateParent={update_booklist}/>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submit_man_sort}>Generate Shelf</button>
      </div>
    </div>
  )
}