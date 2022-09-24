import React from 'react';
import { defaultProps } from '../types/interfaces';
import { getCookie, sendGetRequestToServer } from '../utilities';
import { Loading } from './Loading';

interface rank{
  username : string,
  spines : number
}
interface leaderboard_res{
  statusCode : number,
  body : Array<rank>
}

export function Leaderboard({widgetCallback} : defaultProps){
  const cur_user = getCookie("username");
  sendGetRequestToServer("leaderboard", "", (res : string)=>{
    const parsed_res : leaderboard_res = JSON.parse(res);
    const ranks = parsed_res.body.map((v, i) => {
      let classes = "leaderboard_row"
      if(v.username === cur_user) classes += " title_row";
      return(
        <div>
          <div className={classes} key={v.username + i.toString()}>
            <span className="leaderboard_rank">{i+1}</span>
            <span className="leaderboard_name">{v.username}</span>
            <span className="leaderboard_score">{v.spines}</span>
          </div>
          <div className="bs_box_line"></div>
        </div>
      );
    });
    const leaderboard = (
      <div className="leaderboard_box">
        <div>
          <div className="leaderboard_row title_row">
            <span className="leaderboard_rank">rank</span>
            <span className="leaderboard_name">username</span>
            <span className="leaderboard_score">spines</span>
          </div>
          <div className="bs_box_line"></div>
        </div>
        {ranks}
      </div>
    );
    widgetCallback(leaderboard);
  });
  return <Loading/>
}