import { book, foundBook } from '../types/interfaces';
import { get_year_from_date_str, split_dimensions_str_into_h_w_l } from './utilities';
import { sort_by_color } from './colorSort';

// Sorting algorithms for the "Sort by" screen. Kept out of the component so they can be unit tested.
// Books can come from a Goodreads export or from Hardcover, and the two don't always fill in the same fields.

export const alphabetize_by_title_algo = (a : book, b : book) => {
  const remove_first_article = (title : string) => {
    const articles = ["the", "a", "an"];
    let sp = title.split(' ');
    const first_word = sp.shift();
    if(first_word && articles.includes(first_word.toLowerCase()))
      return sp.join(' ');
    return title;
  };
  const x = remove_first_article(a.title).trim();
  const y = remove_first_article(b.title).trim();
  if(x < y) return -1;
  if(x > y) return 1;
  return 0;
}

export const alphabetize_list_by_title = (list : Array<foundBook>) => {
  if(!list) return list;
  return list.sort((a, b) => alphabetize_by_title_algo(a, b));
};

export const alphabetize_list_by_author = (list : Array<foundBook>)=> {
  const sort_by_series = (a : string, b : string) : -1 | 0 | 1 => {
    if(a.charAt(a.length-1) !== ')' || b.charAt(b.length-1) !== ')') { return 0; }
    const find_index_of_opening_prin = (s : string) => {
      for(let i = s.length-1; i > 0; i--){
        if(s.charAt(i) === '(') return i;
      }
      return -1;
    };
    const indexA = find_index_of_opening_prin(a);
    const indexB = find_index_of_opening_prin(b);
    //if either index is -1, we know something went wrong finding the opening parenthesis
    if(indexA === -1 || indexB === -1) return 0;

    const seriesAFull = a.substring(indexA);
    const seriesBFull = b.substring(indexB);
    // check if they're the same series.
    const seriesA = seriesAFull.split('#')[0];
    const seriesB = seriesBFull.split('#')[0];
    // If so, sort by the # annotation.
    if (seriesA === seriesB) {
      // some series may match and not have a specific 'num' annotation. In which case, just sort by title.
      if (seriesAFull.indexOf('#') === -1) {
        return a < b ? -1 : 1;
      }
      const seriesANum = Number(seriesAFull.split('#')[1].replace(')', ''));
      const seriesBNum = Number(seriesBFull.split('#')[1].replace(')', ''));
      return seriesANum < seriesBNum ? -1 : 1;
    }
    // else, sort alphabetically
    if(seriesA < seriesB) return -1;
    if(seriesA > seriesB) return 1;
    return 0;
  };
  const get_first_name = (name : string) => {
    let l = name.split(' ');
    return l[0];
  };
  const get_last_name = (name : string) => {
    let l = name.split(' ');
    return l[l.length - 1];
  };
  return list.sort((a, b)=>{
    //sort first by last name
    let nameA = get_last_name(a.author).toLowerCase();
    let nameB = get_last_name(b.author).toLowerCase();
    if(nameA < nameB) return -1;
    if(nameA > nameB) return 1;

    //then, if last name identical, sort by first name
    nameA = get_first_name(a.author).toLowerCase();
    nameB = get_first_name(b.author).toLowerCase();
    if(nameA < nameB) return -1;
    if(nameA > nameB) return 1;

    //names are identical
    //at this point, see if we can sort by series
    const res = sort_by_series(a.title, b.title);
    if(res !== 0) return res;

    //if they aren't in a series, just sort by title
    return alphabetize_by_title_algo(a, b);
  });
};

export const sort_books_by_color = (books : Array<foundBook>) => {
  const colors : Array<string> = books.map(b => b.domColor ? b.domColor : "");
  const sortedColors = sort_by_color(colors);
  // several books can share a color, so hand each one out once rather than always taking the first match
  const remaining = [...books];
  const sortedBooklist : Array<foundBook> = [];
  sortedColors.forEach(c => {
    const i = remaining.findIndex(b => (b.domColor ?? "").toLowerCase() === c.toLowerCase());
    if(i !== -1) sortedBooklist.push(remaining.splice(i, 1)[0]);
  });
  // anything the color sort couldn't place (e.g. no color) goes at the end instead of disappearing
  return [...sortedBooklist, ...remaining];
};

export const sort_books_by_year = (books :foundBook[]) => {
  return books.sort((a,b) => {
    if(a.pubDate && b.pubDate) {
      const year_a = get_year_from_date_str(a.pubDate);
      const year_b = get_year_from_date_str(b.pubDate);
      if(year_a < year_b) return -1;
      if(year_a > year_b) return 1;
      return 0;
    }
    if(a.pubDate && !b.pubDate) return 1;
    if(!a.pubDate && b.pubDate) return -1;
    return 0;
  });
};

export const sort_books_by_rating = (books : foundBook[], rating_type : "user_rating" | "average_rating") => {
  return books.sort((a,b) => {
    const a_rating = rating_type === "user_rating" ? a.user_rating : a.average_rating;
    const b_rating = rating_type === "user_rating" ? b.user_rating : b.average_rating;
    if(a_rating && b_rating) {
      if(a_rating < b_rating) return -1;
      if(a_rating > b_rating) return 1;
      //if they have the same rating, sort books by title
      return alphabetize_by_title_algo(a,b);
    }
    if(a_rating && !b_rating) return 1;
    if(!a_rating && b_rating) return -1;
    return 0;
  });
};

export const sort_books_by_height = (books : foundBook[]) => {
  return books.sort((a,b) => {
    const dim_a = split_dimensions_str_into_h_w_l(a.dimensions);
    const dim_b = split_dimensions_str_into_h_w_l(b.dimensions);
    if(dim_a.h < dim_b.h) return -1;
    if(dim_a.h > dim_b.h) return 1;
    return 0;
  });
};

// Oldest first. Books with a missing or unparseable date go last, ordered by title.
export const sort_books_by_date = (books : foundBook[], date_type : "user_read_at" | "pubDate") => {
  const to_time = (date_str : string | undefined) => {
    if(!date_str) return NaN;
    return new Date(date_str).getTime();
  };
  return books.sort((a,b) => {
    const a_time = to_time(date_type === "user_read_at" ? a.user_read_at : a.pubDate);
    const b_time = to_time(date_type === "user_read_at" ? b.user_read_at : b.pubDate);
    const a_valid = !isNaN(a_time);
    const b_valid = !isNaN(b_time);
    if(a_valid && b_valid && a_time !== b_time) return a_time < b_time ? -1 : 1;
    if(a_valid && !b_valid) return -1;
    if(!a_valid && b_valid) return 1;
    return alphabetize_by_title_algo(a, b);
  });
};
