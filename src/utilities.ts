
export function getCookie(cname : string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
const NUM_DAYS_STAY_LOGGEDIN = 7;
export function setCookie(cname : string, cvalue : string) {
  const d = new Date();
  d.setTime(d.getTime() + (NUM_DAYS_STAY_LOGGEDIN * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getLocalIPAddress(callback : Function) {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function(err){
    if (oReq.readyState == 4 && oReq.status == 200){
      let res = oReq.responseText.replace('?', '').replace('(','').replace(')','').replace(';','');
      callback(JSON.parse(res)["ip"]);
    }
  }
  oReq.open("GET", "https://api.ipify.org?format=jsonp&callback=?");
  oReq.send();
}

export function validUrl(url : string){
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(url);
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