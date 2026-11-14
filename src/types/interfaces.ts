import { ReactElement } from "react"

export interface book {
  author : string,
  book_id : string,
  title : string,
  isbn ?: string,
  isbn13 ?: string,
  pubDate ?: string,
  numPages ?: string,
  genre ?: string,
  user_read_at? : string,
  average_rating ?: string,
  user_rating ?: string,
  hardcover_book_id ?: string | number | null  // set for books that came from Hardcover (they have no Goodreads book_id)
}
export interface foundBook extends book {
  upload_id : string,
  dimensions : string,
  domColor ?: string,
  fileName : string,
  submitter : string
}
// Where a shelf of books came from, so it can be reloaded after the user uploads a missing spine.
//  - csv: the text of a Goodreads library export plus the shelf name chosen from it
//  - hardcover: the id of a Hardcover status shelf or list ("status:3", "list:456") from the signed-in user's library
export type ShelfSource =
  | { kind : "csv", csv : string, shelf : string }
  | { kind : "hardcover", shelf : string };
export interface bookContainer {
  book : book
}
export interface defaultProps {
  widgetCallback: (arg: ReactElement) => void
}
export interface shelfImage {
  upload_id : string,
  filename : string,
  timestamp : number,
  owner ?: string,
  bookshelf_name ?: string,
  gr_shelf_name ?: string,
  gr_user_id ?: string
}
export interface user {
  username : string,
  hashedPassword : string,
  email : string,
  authtoken : string,
  expiry : number,
  salt : string,
  ip : string,
  banned : boolean,
  goodreads_id : string
}
export interface validateGetResponse {
  statusCode : number,
  valid_authtoken : boolean
}
export interface rank{
  username : string,
  spines : number
}
export interface leaderboard_res{
  statusCode : number,
  body : Array<rank>
}