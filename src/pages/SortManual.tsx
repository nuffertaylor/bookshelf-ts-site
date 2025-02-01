import React from 'react';
import { defaultProps, foundBook } from '../types/interfaces';
import { DragAndDropList } from './DragAndDropList';
import { SortBy } from './SortBy';
import { Title } from './Title';
import { BookshelfRendererParams } from '../utils/BookshelfRenderer';
import { CustomizeShelf } from './CustomizeShelf';

export interface sortManualProps extends defaultProps{
  booklist : Array<foundBook>,
  genShelf : (params: BookshelfRendererParams) => void
}
export function SortManual({widgetCallback, booklist, genShelf} : sortManualProps){
  const returnToSortBy = ()=>{widgetCallback(<SortBy widgetCallback={widgetCallback} booklist={booklist}/>)};
  const submit_man_sort = ()=>{ genShelf({books: booklist}) };
  const update_booklist = (bl : foundBook[]) => { booklist = bl };
  const customize_shelf_click = () => {
    widgetCallback(<CustomizeShelf widgetCallback={widgetCallback} booklist={booklist} genShelf={genShelf}/>)
  };
  //should I make the submit button sticky?
  return(
    <div>
      <Title title="Sort Manually" backArrowOnClick={returnToSortBy}/>
      <DragAndDropList data={booklist} updateParent={update_booklist}/>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submit_man_sort}>Generate Shelf</button>
      </div>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="customize_shelf_button" onClick={customize_shelf_click}>
          Customize Shelf
        </button>
      </div>
    </div>
  )
}