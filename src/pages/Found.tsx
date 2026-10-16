import React, { useContext } from 'react';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { Loading } from './Loading';
import { UnfoundUpload } from './UnfoundUpload';
import { book, defaultProps, foundBook } from '../types/interfaces';
import { download_imgs_in_zip } from '../utils/utilities';
import { SelectEdition } from './SelectEdition';
import { toast } from 'react-toastify';
import { Checkbox } from '@mantine/core';

export interface FoundProps extends defaultProps{
  found : Array<foundBook>, 
  foundOptions : Array<foundBook[]>,  // every spine option for each found book; found holds the selected option
  unfound : Array<book>,
  querystr : string,
  initialGenerateFakes ?: boolean  // restores the checkbox when returning from Select Editions
}

//TODO: if there are 0 spines found, display an alternate screen.
export function Found({found, foundOptions, unfound, widgetCallback, querystr, initialGenerateFakes = true} : FoundProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const createUnfoundUpload =()=>{
    widgetCallback(<UnfoundUpload found={found} foundOptions={foundOptions} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr}/>);
  }

  const [generateFakes, setGenerateFakes] = React.useState<boolean>(initialGenerateFakes);

  const openSelectEdition = ()=>{
    widgetCallback(<SelectEdition widgetCallback={widgetCallback} found={found} foundOptions={foundOptions} unfound={unfound} querystr={querystr} generateFakes={generateFakes}/>);
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
        <button className="bs_adaptive_button" onClick={openSelectEdition}>Select Editions</button>
      </div>
      {unfound && unfound.length > 0 &&
      <div className="bs_button_wrapper">
        <button className={"bs_adaptive_button bs_outline bs_outline_".concat(colorScheme)} onClick={createUnfoundUpload}>Upload Missing Spines</button>
      </div>
      }
      {downloadingFound === 1 && <div className="bs_button_wrapper">
        <button className={"bs_adaptive_button bs_outline bs_outline_".concat(colorScheme)} onClick={downloadBookSpines}>Download Book Spines</button>
      </div>}
      {downloadingFound === 2 && <Loading/>}
    </div>
  );
}