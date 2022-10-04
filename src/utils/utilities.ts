
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

export function onlyDigits(str : string){
  return /^\d+$/.test(str);
}

export function onlyNumbers(string : string) { 
  return (string.match(/^[0-9]+$/) != null); 
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
  var xhttp = new XMLHttpRequest();
  var path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method + "?" + querystr;
  xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        callback(xhttp.responseText);
      } //TODO handle other status codes
  };
  xhttp.open("GET", path, true);
  xhttp.send();
}

export const sendPostRequestToServer = async function(method : string, data : object, callback : Function)
{
  const httpPost = new XMLHttpRequest();
  const path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method;
  let json_data = JSON.stringify(data);
  httpPost.onreadystatechange = (err) => {
    if (httpPost.readyState === 4) callback(httpPost.responseText);
  };
  // Set the content type of the request to json since that's what's being sent
  httpPost.open("POST", path, true);
  httpPost.setRequestHeader('Content-Type', 'application/json');
  httpPost.send(json_data);
};

export function capitalizeFirstLetter(string : string) : string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}