import React, { useEffect, useState } from 'react';
import './App.css';
import { ResponsiveHeader } from './ResponsiveHeader';
import {Create} from './pages/Create';
import {Curate} from './pages/Curate';
import {Landing} from './pages/Landing';
import {Leaderboard} from './pages/Leaderboard';
import {Login} from './pages/Login';
import './bs.css'
import { FetchGoodreads } from './pages/FetchGoodreads';
import { getCookie } from './utilities';
import NeedAuthentication from './pages/NeedAuthentication';
import { Loading } from './pages/Loading';

function App() {
  //base login status on existence of cookie. when cookie is expired, so is authtoken.
  const [currentStatus, setStatus] = useState(getCookie("authtoken") ? "profile" : "login");

  const [centerWidget, setCenterWidget] = useState(<Landing widgetCallback={()=>{document.getElementById("create")?.click();}}/>);
  const headerClick = (active : String) => {
    switch(active){
      case "/create":
        setCenterWidget(<Create widgetCallback={changeCenterWidget}/>);
        break;
      case "/contribute":
        if(currentStatus === "profile") setCenterWidget(<FetchGoodreads widgetCallback={changeCenterWidget}/>);
        else setCenterWidget(<NeedAuthentication widgetCallback={changeCenterWidget}/>);
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
        setCenterWidget(<Login widgetCallback={changeCenterWidget}/>);
        break;
      case "/profile": //TODO: for now we'll just use leaderboard page, but create custom profile page
        setCenterWidget(<Leaderboard widgetCallback={changeCenterWidget}/>);
        break;
    }
  };
  const changeCenterWidget = (widget : any) => {
    setCenterWidget(widget);
  }
  return (
    <div className="App">
      <ResponsiveHeader 
      links={
        [{ link: "/create", label: "create" },
        { link: "/contribute", label: "contribute" },
        // { link: "/curate", label: "curate" },
        { link: "/leaderboard", label: "leaderboard" },
        // { link: "/loading", label: "loading" },
        { link: "/" + currentStatus, label: currentStatus }
        ]}
      callback = {headerClick}
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
