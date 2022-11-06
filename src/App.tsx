import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { ResponsiveHeader } from './ResponsiveHeader';
import {Create} from './pages/Create';
import {Curate} from './pages/Curate';
import {Landing} from './pages/Landing';
import {Leaderboard} from './pages/Leaderboard';
import {Login} from './pages/Login';
import './bs.css'
import { FetchGoodreads } from './pages/FetchGoodreads';
import { getCookie, logout, sendGetRequestToServer, sendPostRequestToServer } from './utils/utilities';
import NeedAuthentication from './pages/NeedAuthentication';
import { Loading } from './pages/Loading';
import { Profile } from './pages/Profile';
import { leaderboard_res, validateGetResponse } from './types/interfaces';
//@ts-ignore
import clientInfo from 'client-info';
import { MantineProvider } from '@mantine/core';
import { ColorSchemeCtx } from './ColorSchemeContext';
import { FooterCentered } from './FooterCentered';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//TODO: Every time the "alert" function appears in this app, replace it with a custom alert component.
//TODO: Add cookie consent banner (maybe use lib 'react-cookie-consent'
function App() {
  const client_info = clientInfo.getBrowser();
  const visit_body = {
    "os" : client_info.os,
    "browser" : client_info.name
  }
  let authtoken = getCookie("authtoken");
  let username = getCookie("username");
  const [loginStatus, setLoginStatus] = useState(authtoken ? "profile" : "login");

  //Empty array means this triggers when page renders. Effectively componentDidMount
  useEffect(()=>{
    //send visit post
    sendPostRequestToServer("visit", visit_body, ()=>{});

    //if we have a cookie that says we're logged in, send a validation request to the server to ensure the token is still valid.
    if(authtoken) {
      sendGetRequestToServer("validate", "username="+username+"&authtoken="+authtoken, (res : string)=>{
        const parsed_res : validateGetResponse = JSON.parse(res);
        if(parsed_res.statusCode !== 200 || !parsed_res.valid_authtoken) logout();
      });
    }
  // eslint-disable-next-line
  }, []);
  const [centerWidget, setCenterWidget] = useState(<Landing widgetCallback={()=>{document.getElementById("create")?.click();}} />);

  const fetch_leaderboard = () => {
    setCenterWidget(<Loading/>);
    sendGetRequestToServer("leaderboard", "", (res : string)=>{
      const parsed_res : leaderboard_res = JSON.parse(res);
      if(parsed_res.statusCode !== 200) {
        setCenterWidget(<span>Something went wrong loading the leaderboard. Try again later.</span>);
        return;
      }
      setCenterWidget(<Leaderboard leaderboard_data={parsed_res.body}/>);
    });
  };
  
  const headerClick = (active : String) => {
    switch(active){
      case "/create":
        setCenterWidget(<Create widgetCallback={changeCenterWidget} />);
        break;
      case "/contribute":
        if(loginStatus === "profile") setCenterWidget(<FetchGoodreads widgetCallback={changeCenterWidget} />);
        else setCenterWidget(<NeedAuthentication widgetCallback={changeCenterWidget}  setLoginStatus={setLoginStatus}/>);
        break;
      case "/curate":
        setCenterWidget(<Curate/>);
        break;
      case "/landing":
        setCenterWidget(<Landing widgetCallback={setCenterWidget} />);
        break;
      case "/leaderboard":
        fetch_leaderboard();
        break;
      case "/loading":
        setCenterWidget(<Loading/>);
        break;
      case "/login":
        setCenterWidget(<Login widgetCallback={changeCenterWidget}  setLoginStatus={ setLoginStatus }/>);
        break;
      case "/profile":
        setCenterWidget(<Profile widgetCallback={changeCenterWidget} />);
        break;
    }
  };

  const changeCenterWidget = (widget : any) => {
    setCenterWidget(widget);
  }
  const { colorScheme } = useContext(ColorSchemeCtx);
  return (
    <MantineProvider theme={{ colorScheme: colorScheme === "light" ? "light" : "dark" }} withGlobalStyles withNormalizeCSS>
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
          headerClick = {headerClick}
        />
        <div className="bs_main_tile">
          <div className={"bs_main_box bs_main_box_".concat(colorScheme)}>
            {centerWidget}
          </div>
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={colorScheme}
        />
        <div className="bs_filler_div"></div>
        <FooterCentered widgetCallback={setCenterWidget} links={
        [
          {
            "link": "about",
            "label": "About"
          },
          {
            "link": "howto",
            "label": "How to Use"
          },
          {
            "link": "api",
            "label": "API"
          },
          {
            "link": "discord",
            "label": "Discord"
          }
        ]
          }/>
      </div>
    </MantineProvider>
  );
}

export default App;
