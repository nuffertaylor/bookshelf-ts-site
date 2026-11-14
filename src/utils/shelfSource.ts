import { book, foundBook, ShelfSource } from '../types/interfaces';
import { fetchHardcoverShelf, parseApiResponse } from './hardcover';
import { sendPostRequestToServer } from './utilities';

export interface shelfResponse {
  statusCode : number,
  body : {
    found : foundBook[][],  // array of spine options for each book
    unfound : book[]
  }
}

// Loads a shelf from wherever it came from and reports which of its books have spines. Used to reload the
// shelf after the user uploads a missing spine. The callback sees the same shape for every source.
export function fetchShelf(source : ShelfSource, callback : (res : shelfResponse) => void){
  if(source.kind === "hardcover"){
    fetchHardcoverShelf(source.shelf, (res) => callback(res as shelfResponse));
    return;
  }
  sendPostRequestToServer("importgrlibrary", { csv : source.csv, shelf : source.shelf }, (res : string)=>{
    callback(parseApiResponse<shelfResponse["body"]>(res) as shelfResponse);
  });
}
