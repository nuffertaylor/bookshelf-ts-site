import { IMG_URL_PREFIX } from "../types/constants";
import { foundBook } from "../types/interfaces";
import JSZip from "jszip"
import { saveAs } from 'file-saver';

export function getCookie(cname : string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const NUM_DAYS_STAY_LOGGEDIN = 7;
export function setCookie(cname : string, cvalue : string) {
  const d = new Date();
  d.setTime(d.getTime() + (NUM_DAYS_STAY_LOGGEDIN * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function deleteCookie(name : string) {
  if(getCookie(name)) {
    document.cookie = name + "=" +
    ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

export function validUrl(url : string){
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(url);
}

export function validEmail(email : string){
  // eslint-disable-next-line
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
}

export function onlyDigits(str : string){
  return /^\d+$/.test(str);
}

export function onlyNumbers(str : string) { 
  return /^[0-9]+$/.test(str); 
}

export function getRequest(path : string, callback : any){
  let httpGet = new XMLHttpRequest();
  httpGet.onreadystatechange = callback;
  httpGet.open("GET", path, true);
  httpGet.send();
}

export function loggedIn(){
  let u = getCookie("username");
  let a = getCookie("authtoken");
  if(u === null || a === null) return false;
  return true;
}

export const sendGetRequestToServer = async function (method : string, querystr : string, callback : Function){
  const httpGet = new XMLHttpRequest();
  httpGet.ontimeout = (e) => { callback(JSON.stringify({statusCode : 500})); };
  const path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method + "?" + querystr;
  httpGet.onreadystatechange = function() {
      if(this.readyState === 4) callback(httpGet.responseText);
  };
  httpGet.open("GET", path, true);
  httpGet.send();
}

export const sendPostRequestToServer = async function(method : string, data : object, callback : Function)
{
  const httpPost = new XMLHttpRequest();
  httpPost.ontimeout = (e) => { callback(JSON.stringify({statusCode : 500})); };
  const path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method;
  let json_data = JSON.stringify(data);
  httpPost.onreadystatechange = (err) => {
    if(httpPost.readyState === 4) callback(httpPost.responseText);
  };
  // Set the content type of the request to json since that's what's being sent
  httpPost.open("POST", path, true);
  httpPost.setRequestHeader('Content-Type', 'application/json');
  httpPost.send(json_data);
};

export function capitalizeFirstLetter(string : string) : string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function logout() {
  deleteCookie("username");
  deleteCookie("authtoken");
  deleteCookie("goodreads_id");
  document.location.reload();
}

export function get_year_from_date_str(str : string) : number {
  const d = new Date(str);
  const year = d.getUTCFullYear();
  return year;
}
export const get_cur_date_str = () : string => {
  return new Date().toLocaleString().toString().split(',')[0]
}
export const get_last_sub_dir_from_url = (url : string) => {
  let res = url.split('/').at(-1);
  if(res === '') res = url.split('/').at(-2);
  if(typeof res === "string") return res;
  return "";
}
export const remove_query_string = (url : string) => { return url.split('?')[0]; };
export const remove_text_title = (url : string) => { return url.split(/-/)[0]; };
export const remove_non_numeric_char_from_str = (str : string) => { return str.replace(/\D/g,''); };

export const split_dimensions_str_into_h_w_l = (dimensions : string) => {
  const int_arr : number[] = dimensions.toLowerCase().split('x').map(item => parseFloat(item.trim()));
  const h = Math.max(...int_arr);
  const w = Math.min(...int_arr);
  let l = 0;
  for(let i = 0; i < 3; i++) {
    if(int_arr[i] === h) continue;
    else if(int_arr[i] === w) continue;
    else l = int_arr[i];
  }
  if(l === 0) l = h; //we have a square book
  return { h : h, w : w, l : l };
};

export const download_imgs_in_zip = async (books: foundBook[]) => {
  const zip = new JSZip();
  for (const book of books) {
    const response = await fetch(IMG_URL_PREFIX + book.fileName);
    const bookData = await response.blob();
    zip.file(book.fileName, bookData);
  }

  const content = await zip.generateAsync({type:"blob"});
  saveAs(content, 'yourBookSpines.zip');
}

export const convert_cm_to_in = (cmValue: number): number => {
  return cmValue / 2.54;
}

export const convert_in_to_cm = (inValue: number): number => {
  return inValue * 2.54;
}

