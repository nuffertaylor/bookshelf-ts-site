import React from 'react';
import { rank } from '../types/interfaces';
import { getCookie } from '../utils/utilities';

interface leaderboardProps {
  leaderboard_data : Array<rank>
}

//TODO: If the user clicks on another item from the header before this loads, cancel the result. Not sure how to do this.
//TODO: If there are many users, scroll the leaderboard so the user sees their ranking when they first login.
//TODO: Lazy loading if many users
export function Leaderboard({leaderboard_data} : leaderboardProps){
  const cur_user = getCookie("username");
  let counter = 0, prevSpines = 0;
  const ranks = leaderboard_data.map((v, i) => {
    let classes = "leaderboard_row"
    if(v.username === cur_user) classes += " title_row";
    if(prevSpines !== v.spines) counter += 1;
    prevSpines = v.spines;
    return(
      <div key={v.username + i.toString()}>
        <div className={classes}>
          <span className="leaderboard_rank">{counter}</span>
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
  return leaderboard;
}