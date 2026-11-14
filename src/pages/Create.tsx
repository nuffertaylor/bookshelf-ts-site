import React, { useContext, useState } from 'react';
import {Found} from "./Found";
import { book, defaultProps, foundBook, ShelfSource } from '../types/interfaces';
import {Loading} from "./Loading";
import { sendPostRequestToServer } from "../utils/utilities";
import { ColorSchemeCtx } from '../ColorSchemeContext';
import { toast } from 'react-toastify';
import { HowTo } from './HowTo';

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
  const [fileName, setFileName] = useState<string>("");
  const [readingCsv, setReadingCsv] = useState<boolean>(false);

  const onFileChosen = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const chosenName = file.name;
    // Clear the input so picking the same file again (after an error) still triggers onChange.
    e.target.value = "";
    setReadingCsv(true);
    const reader = new FileReader();
    reader.onerror = ()=>{
      setReadingCsv(false);
      toast.error("Couldn't read that file.");
    };
    reader.onload = ()=>{
      const text = String(reader.result ?? "");
      if(text.length > MAX_CSV_CHARS){
        setReadingCsv(false);
        toast.error("That file is too large to upload.");
        return;
      }
      sendPostRequestToServer("importgrlibrary", { csv : text }, (res : string)=>{
        setReadingCsv(false);
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
        setFileName(chosenName);
        setShelves(options);
        setShelf(options.some(s => s.name === "read") ? "read" : options[0].name);
      });
    };
    reader.readAsText(file);
  };

  const loadShelf = ()=>{
    if(!csv || !shelf){
      toast.error("Please choose your Goodreads CSV and a shelf.");
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

  if(readingCsv) return <Loading/>;

  return (
  <div className="bs_input_section">
    <input id="bs_csv_input" type="file" accept=".csv,text/csv" onChange={onFileChosen} hidden />
    <label htmlFor="bs_csv_input" className="bs_button bs_file_button">{csv ? "Choose a Different CSV" : "Choose CSV"}</label>
    {csv && <p className="bs_csv_filename">{fileName}</p>}
    {!csv &&
      <p className="bs_csv_help">
        Upload your Goodreads library export.{" "}
        <span className={"a_ a_".concat(colorScheme)} onClick={()=>{widgetCallback(<HowTo openItem="goodreads_csv"/>)}}>How to get my Goodreads CSV</span>
      </p>
    }
    {shelves.length > 0 &&
      <>
        <label htmlFor="shelfname" className="bs_shelf_label">Available Shelves</label>
        <select
          id="shelfname"
          className={"bs_text_input bs_text_input_".concat(colorScheme)}
          value={shelf}
          onChange={e => setShelf(e.target.value)}
        >
          {shelves.map(s => <option key={s.name} value={s.name}>{s.name} ({s.count})</option>)}
        </select>
      </>
    }
    <button id="bs_enter_button" className="bs_button" onClick={loadShelf} disabled={!csv}>LOAD SHELF</button>
  </div>
  )
}
