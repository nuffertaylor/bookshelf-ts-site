import React from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { DragAndDropList } from './DragAndDropList';
import { SortBy } from './SortBy';
import { Title } from './Title';

interface sortManualProps extends defaultProps{
  booklist : Array<foundBook>,
  genShelf : Function
}
export function SortManual({widgetCallback, colorScheme, booklist, genShelf} : sortManualProps){
  const returnToSortBy = ()=>{widgetCallback(<SortBy widgetCallback={widgetCallback} colorScheme={colorScheme} booklist={booklist}/>)};
  const submit_man_sort = ()=>{ genShelf(booklist) };
  const update_booklist = (bl : foundBook[]) => { booklist = bl };

  //should I make the submit button sticky?
  return(
    <div>
      <Title title="Sort Manually" backArrowOnClick={returnToSortBy}/>
      <DragAndDropList data={booklist} updateParent={update_booklist}/>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submit_man_sort}>Generate Shelf</button>
      </div>
    </div>
  )
}