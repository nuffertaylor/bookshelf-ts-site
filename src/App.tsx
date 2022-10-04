import React, { useState } from 'react';
import './App.css';
import { ResponsiveHeader } from './ResponsiveHeader';
import {Create} from './pages/Create';
import {Curate} from './pages/Curate';
import {Landing} from './pages/Landing';
import {Leaderboard} from './pages/Leaderboard';
import {Login} from './pages/Login';
import './bs.css'
import { FetchGoodreads } from './pages/FetchGoodreads';
import { getCookie } from './utils/utilities';
import NeedAuthentication from './pages/NeedAuthentication';
import { Loading } from './pages/Loading';
import { Profile } from './pages/Profile';

//TODO: Every time the "alert" function appears in this app, replace it with a custom alert component.
function App() {
  //base login status on existence of cookie. when cookie is expired, so is authtoken.
  //TODO: on load, send request to check if authtoken has expired (happens also if they login elsewhere). log them out if so
  const [loginStatus, setLoginStatus] = useState(getCookie("authtoken") ? "profile" : "login");

  const [centerWidget, setCenterWidget] = useState(<Landing widgetCallback={()=>{document.getElementById("create")?.click();}}/>);
  
  const headerClick = (active : String) => {
    switch(active){
      case "/create":
        setCenterWidget(<Create widgetCallback={changeCenterWidget}/>);
        break;
      case "/contribute":
        if(loginStatus === "profile") setCenterWidget(<FetchGoodreads widgetCallback={changeCenterWidget}/>);
        else setCenterWidget(<NeedAuthentication widgetCallback={changeCenterWidget} setLoginStatus={setLoginStatus}/>);
        break;
      case "/curate":
        setCenterWidget(<Curate/>);
        break;
      case "/landing":
        setCenterWidget(<Landing widgetCallback={setCenterWidget}/>);
        break;
      case "/leaderboard":
        setCenterWidget(<Leaderboard widgetCallback={changeCenterWidget}/>);
        break;
      case "/loading":
        setCenterWidget(<Loading/>);
        break;
      case "/login":
        setCenterWidget(<Login widgetCallback={changeCenterWidget} setLoginStatus={ setLoginStatus }/>);
        break;
      case "/profile":
        setCenterWidget(<Profile widgetCallback={changeCenterWidget}/>);
        break;
    }
  };

  const changeCenterWidget = (widget : any) => {
    setCenterWidget(widget);
  }

  //TODO: Add footer with relevant links (about, how-to, buy me coffee)
  return (
    <div className="App">
      <ResponsiveHeader 
      links={
        [{ link: "/create", label: "create" },
        { link: "/contribute", label: "contribute" },
        // { link: "/curate", label: "curate" },
        { link: "/leaderboard", label: "leaderboard" },
        // { link: "/loading", label: "loading" },
        { link: "/" + loginStatus, label: loginStatus }
        ]}
        widgetCallback = {headerClick}
        />
      <div className="bs_main_tile">
        <div className="bs_main_box">
          {centerWidget}
        </div>
      </div>
    </div>
  );
}

export default App;
