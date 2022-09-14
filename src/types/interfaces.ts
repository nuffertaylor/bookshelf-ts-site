export interface book {
  author : string,
  book_id : string,
  title : string,
  isbn ?: string,
  isbn13 ?: string,
  pubDate ?: string,
  numPages ?: string,
  genre ?: string
}
export interface foundBook extends book {
  dimensions : string,
  domColor ?: string,
  fileName : string,
  submitter : string
}
export interface bookContainer {
  book : book
}