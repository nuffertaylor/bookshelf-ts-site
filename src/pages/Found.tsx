import React from 'react';
import {Loading} from "./Loading";
import { UnfoundUpload } from './UnfoundUpload';
import { book, defaultProps, foundBook } from '../types/interfaces';
import { SortBy } from './SortBy';
import { download_imgs_in_zip } from '../utils/utilities';
import { toast } from 'react-toastify';
import { Checkbox } from '@mantine/core';

export interface FoundProps extends defaultProps{
  found : Array<foundBook>, 
  unfound : Array<book>,
  querystr : string
}

//TODO: if there are 0 spines found, display an alternate screen.
export function Found({found, unfound, widgetCallback, querystr} : FoundProps){
  const createUnfoundUpload =()=>{
    widgetCallback(<UnfoundUpload found={found} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>);
  }

  const [generateFakes, setGenerateFakes] = React.useState<boolean>(true);

  const openSortBy = ()=>{
    widgetCallback(<Loading/>);
    let booklist : Array<foundBook> = found;
    if (generateFakes && unfound) {
      unfound.forEach(u => booklist.push(u as foundBook));
    }
    widgetCallback(<SortBy widgetCallback={widgetCallback} booklist={booklist}/>);
  }

  // state 1 = not downloading, 2 = currently downloading, 3 = finished downloading
  const [downloadingFound, setDownloadingFound] = React.useState<number>(1);

  const downloadBookSpines = async () => {
    setDownloadingFound(2);
    await download_imgs_in_zip(found);
    setDownloadingFound(3);
    toast.success("Successfully downloaded your book spines!");
  }

  return(
    <div className="found_spine_box">
      <div className="bs_head">Found {found.length} Spines</div>
      {unfound && unfound.length > 0 &&
      <div>
        <div className="unfound_spine_subhead">Missing {unfound.length} Spines</div>
        <div className="grid-center">
          <Checkbox
            label="generate fake spines"
            id="generate_fakes"
            checked={generateFakes}
            onChange={(event) => setGenerateFakes(event.currentTarget.checked)}
          />
        </div>      
      </div>
      }
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button" onClick={openSortBy}>Sort your Books</button>
      </div>
      {unfound && unfound.length > 0 &&
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button bs_gray" onClick={createUnfoundUpload}>Upload Missing Spines</button>
      </div>
      }
      {downloadingFound === 1 && <div className="bs_button_wrapper">
        <button className="bs_adaptive_button bs_gray" onClick={downloadBookSpines}>Download Book Spines</button>
      </div>}
      {downloadingFound === 2 && <Loading/>}
    </div>
  );
}