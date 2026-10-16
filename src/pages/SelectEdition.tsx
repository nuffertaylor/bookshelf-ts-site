import React, { useContext, useState } from 'react';
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { book, defaultProps, foundBook } from '../types/interfaces';
import { IMG_URL_PREFIX } from '../types/constants';
import { toast } from 'react-toastify';
import { Select } from '@mantine/core';
import { IconHelp } from '@tabler/icons';
import { Title } from './Title';
import { Found } from './Found';
import { SortBy } from './SortBy';
import { Upload } from './Upload';
import { Loading } from './Loading';
import { getgrbookshelfResponse } from './Create';
import { sendGetRequestToServer } from '../utils/utilities';
import { alphabetize_by_title_algo } from './SortBy';

export interface SelectEditionProps extends defaultProps {
  found : Array<foundBook>,
  foundOptions : Array<foundBook[]>,
  unfound : Array<book>,
  querystr : string,
  generateFakes ?: boolean,  // whether unfound books get fake spines when sorting; owned by Found's checkbox
  focusUploadId ?: string  // open on the book containing this upload instead of the first book
}

export function SelectEdition({found, foundOptions, unfound, widgetCallback, querystr, generateFakes = true, focusUploadId} : SelectEditionProps){
  // value is the index into foundOptions, so sorting the choices doesn't affect the selection state
  // most editions first, then alphabetical
  const bookChoices = foundOptions
    .map((options, i) => ({ value: String(i), label: "(" + options.length + ") " + options[0].title, title: options[0].title, count: options.length }))
    .sort((a, b) => b.count - a.count || alphabetize_by_title_algo({ title: a.title } as book, { title: b.title } as book));
  const { colorScheme } = useContext(ColorSchemeCtx);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // found may have extra entries (unfound books appended), so match the current choice by upload_id
  const [selected, setSelected] = useState<number[]>(() => {
    const chosenIds = new Set(found.map(f => f.upload_id));
    return foundOptions.map(options => Math.max(0, options.findIndex(o => chosenIds.has(o.upload_id))));
  });

  const [currentBook, setCurrentBook] = useState<number>(() => {
    const focusIdx = focusUploadId ? foundOptions.findIndex(options => options.some(o => o.upload_id === focusUploadId)) : -1;
    return focusIdx >= 0 ? focusIdx : Number(bookChoices[0]?.value ?? 0);
  });

  const select = (bookIdx : number, optionIdx : number) => {
    setSelected(prev => prev.map((s, i) => i === bookIdx ? optionIdx : s));
  };

  const returnToFound = () => {
    widgetCallback(<Found found={currentPicks()} foundOptions={foundOptions} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr} initialGenerateFakes={generateFakes}/>);
  };

  const currentPicks = () => foundOptions.map((options, i) => options[selected[i]]);

  // reload the shelf so the new spine shows up as an option, keeping the other picks and selecting the new upload
  const afterUpload = (changesMade = false, newUploadId ?: string) => {
    if(!changesMade || !newUploadId) {
      widgetCallback(<SelectEdition found={currentPicks()} foundOptions={foundOptions} unfound={unfound} widgetCallback={widgetCallback} querystr={querystr} generateFakes={generateFakes} focusUploadId={currentPicks()[currentBook].upload_id}/>);
      return;
    }
    const previousPicks = currentPicks();
    widgetCallback(<Loading/>);
    sendGetRequestToServer("getgrbookshelf", querystr, (res : string) => {
      const resObj : getgrbookshelfResponse = JSON.parse(res);
      if(resObj.statusCode !== 200) {
        toast.error("Your spine was uploaded, but something went wrong reloading your bookshelf.");
        document.location.reload();
        return;
      }
      const newOptions : Array<foundBook[]> = resObj["body"]["found"];
      const newUnfound : Array<book> = resObj["body"]["unfound"];
      const newFound : Array<foundBook> = newOptions.map(options => {
        const uploaded = options.find(o => o.upload_id === newUploadId);
        if(uploaded) return uploaded;
        const previous = previousPicks.find(p => options.some(o => o.upload_id === p.upload_id));
        return options.find(o => o.upload_id === previous?.upload_id) ?? options[0];
      });
      toast.success("Your spine was uploaded and selected.");
      widgetCallback(<SelectEdition found={newFound} foundOptions={newOptions} unfound={newUnfound} widgetCallback={widgetCallback} querystr={querystr} generateFakes={generateFakes} focusUploadId={newUploadId}/>);
    });
  };

  const openUpload = () => {
    widgetCallback(<Upload widgetCallback={widgetCallback} prefill={currentPicks()[currentBook]} originCallback={afterUpload}/>);
  };

  const currentOptions = foundOptions[currentBook] ?? [];

  const saveAndSort = () => {
    widgetCallback(<Loading/>);
    const booklist : Array<foundBook> = currentPicks();
    if(generateFakes && unfound) {
      unfound.forEach(u => booklist.push(u as foundBook));
    }
    widgetCallback(<SortBy widgetCallback={widgetCallback} booklist={booklist}/>);
  };

  return (
    <div className="found_spine_box">
      <Title
        title="Select Editions"
        backArrowOnClick={returnToFound}
        titleExtra={
          <IconHelp
            size={20}
            className="bs_help_icon"
            aria-label="help"
            onClick={() => setShowHelp(h => !h)}
          />
        }
      />
      {showHelp && <div className="bs_edition_help">
        Each book starts with its best match selected, so you can skip straight to sorting. Pick a book below to choose a different edition or upload your own.
      </div>}
      <div className="custom-select bs_pointer_select" style={{width:"300px", margin:"0 auto 15px"}}>
        <Select
          data={bookChoices}
          value={String(currentBook)}
          onChange={(v) => { if(v !== null) setCurrentBook(Number(v)); }}
          allowDeselect={false}
        />
      </div>
      <div className="bs_edition_options">
        {currentOptions.map((option, j) => (
          <img
            key={option.upload_id}
            src={IMG_URL_PREFIX + option.fileName}
            alt={option.title + " by " + option.submitter}
            title={"uploaded by " + option.submitter}
            className={"bs_edition_img" + (j === selected[currentBook] ? " bs_edition_img_selected" : "")}
            onClick={() => select(currentBook, j)}
          />
        ))}
      </div>
      <div className="bs_button_wrapper">
        <button className={"bs_adaptive_button bs_outline bs_outline_".concat(colorScheme)} onClick={openUpload}>Upload your own edition</button>
      </div>
      <div className="bs_button_wrapper">
        <button className="bs_adaptive_button" onClick={saveAndSort}>Save and Sort Your Books</button>
      </div>
    </div>
  );
}
