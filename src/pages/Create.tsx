import React, { useContext, useState } from 'react';
import {Found} from "./Found";
import { book, defaultProps, foundBook, ShelfSource } from '../types/interfaces';
import {Loading} from "./Loading";
import { sendPostRequestToServer } from "../utils/utilities";
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';

interface CreateProps extends defaultProps{
  props ?: {
    userid : string,
    shelfname : string
  }
}
export interface getgrbookshelfResponse {
  statusCode : number,
  body : {
    found : foundBook[][],  // array of spine options for each book
    unfound : book[]
  }
}

interface shelfOption {
  name : string,
  count : number
}
interface importShelvesResponse {
  statusCode : number,
  body : { shelves ?: shelfOption[], error ?: string }
}

// API Gateway caps request bodies at 10 MB and Lambda at 6 MB, so stay well under that.
const MAX_CSV_CHARS = 4_000_000;

function parseResponse<T>(res : string) : T {
  try { return JSON.parse(res); }
  catch { return { statusCode : 500, body : {} } as unknown as T; }
}

// Asks the backend for the books on one shelf of a Goodreads export and which of them have spines.
// Also used to reload the shelf after the user uploads missing spines.
export function fetchShelfFromCsv(source : ShelfSource, callback : (res : getgrbookshelfResponse) => void){
  sendPostRequestToServer("importgrlibrary", source, (res : string)=>{
    callback(parseResponse<getgrbookshelfResponse>(res));
  });
}

export function Create({ widgetCallback, props }: CreateProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const [csv, setCsv] = useState<string>("");
  const [shelves, setShelves] = useState<shelfOption[]>([]);
  const [shelf, setShelf] = useState<string>("");

  const onFileChosen = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onerror = ()=>{ toast.error("Couldn't read that file."); };
    reader.onload = ()=>{
      const text = String(reader.result ?? "");
      if(text.length > MAX_CSV_CHARS){
        toast.error("That file is too large to upload.");
        return;
      }
      sendPostRequestToServer("importgrlibrary", { csv : text }, (res : string)=>{
        const resObj = parseResponse<importShelvesResponse>(res);
        if(resObj.statusCode !== 200 || !resObj.body.shelves){
          toast.error(resObj.statusCode === 400 && resObj.body.error ? resObj.body.error : "Something went wrong reading that file, please try again.");
          return;
        }
        const options = resObj.body.shelves;
        if(options.length === 0){
          toast.error("No shelves were found in that file.");
          return;
        }
        setCsv(text);
        setShelves(options);
        setShelf(options.some(s => s.name === "read") ? "read" : options[0].name);
      });
    };
    reader.readAsText(file);
  };

  const generate = ()=>{
    if(!csv || !shelf){
      toast.error("Please choose your Goodreads export file and a shelf.");
      return;
    }
    const source : ShelfSource = { csv, shelf };
    widgetCallback(<Loading/>);
    fetchShelfFromCsv(source, (resObj)=>{
      if(resObj.statusCode !== 200){
        toast.error("Something went wrong, please try again later.");
        widgetCallback(<Create widgetCallback={widgetCallback} props={props}/>);
        return;
      }
      // Backend returns an array of spine options for each book - take the first option
      const found : Array<foundBook> = resObj.body.found.map(spineOptions => spineOptions[0]);
      const unfound : Array<book> = resObj.body.unfound;
      widgetCallback(<Found found={found} unfound={unfound} widgetCallback={widgetCallback} source={source}/>);
    });
  };

  return (
  <div className="bs_input_section">
    <p>
      Goodreads no longer lets us read your shelves directly. Export your library instead:
      on Goodreads go to My Books, then Import and export, then Export Library, and upload the downloaded CSV here.
    </p>
    <input type="file" accept=".csv,text/csv" id="bs_csv_input" onChange={onFileChosen}/>
    {shelves.length > 0 &&
      <select
        id="shelfname"
        className={"bs_text_input bs_text_input_".concat(colorScheme)}
        value={shelf}
        onChange={e => setShelf(e.target.value)}
      >
        {shelves.map(s => <option key={s.name} value={s.name}>{s.name} ({s.count})</option>)}
      </select>
    }
    <button id="bs_enter_button" className="bs_button" onClick={generate} disabled={!csv}>GENERATE</button>
  </div>
  )
}
