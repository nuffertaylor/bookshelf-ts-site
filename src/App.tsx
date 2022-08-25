import React, { useEffect, useState } from 'react';
import './App.css';
import { ResponsiveHeader } from './ResponsiveHeader';
import {Create} from './pages/Create';
import {Curate} from './pages/Curate';
import {Landing} from './pages/Landing';
import {Leaderboard} from './pages/Leaderboard';
import {Login} from './pages/Login';
import {Upload} from './pages/Upload';
import './bs.css'
import { JsxElement } from 'typescript';

function App() {
  const [currentStatus, check_login] = useState("login");
  const [centerWidget, setCenterWidget] = useState(<Landing/>);
  const headerClick = (active : String) => {
    switch(active){
      case "/create":
        setCenterWidget(<Create widgetCallback={changeCenterWidget}/>);
        break;
      case "/contribute":
        setCenterWidget(<Upload/>);
        break;
      case "/curate":
        setCenterWidget(<Curate/>);
        break;
      case "/leaderboard":
        setCenterWidget(<Leaderboard/>);
        break;
      case "/login":
        setCenterWidget(<Login/>);
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
        { link: "/curate", label: "curate" },
        { link: "/leaderboard", label: "leaderboard" },
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
