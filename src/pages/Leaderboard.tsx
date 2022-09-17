import React from 'react';
import { defaultProps } from '../types/interfaces';

export function Leaderboard({widgetCallback} : defaultProps){
  return(
  <div className="leaderboard_box">
    <div className="leaderboard_row title_row">
      <span className="leaderboard_rank">rank</span>
      <span className="leaderboard_name">username</span>
      <span className="leaderboard_score">spines</span>
    </div>
    <div className="bs_box_line"></div>
    <div className="leaderboard_row">
      <span className="leaderboard_rank">1</span>
      <span className="leaderboard_name">jdoe</span>
      <span className="leaderboard_score">25</span>
    </div>
    <div className="bs_box_line"></div>
    <div className="leaderboard_row">
      <span className="leaderboard_rank">2</span>
      <span className="leaderboard_name">bsmith</span>
      <span className="leaderboard_score">23</span>
    </div>
    <div className="bs_box_line"></div>
        <div className="leaderboard_row">
      <span className="leaderboard_rank">3</span>
      <span className="leaderboard_name">alfred</span>
      <span className="leaderboard_score">21</span>
    </div>
    <div className="bs_box_line"></div>
        <div className="leaderboard_row">
      <span className="leaderboard_rank">...</span>
      <span className="leaderboard_name">...</span>
      <span className="leaderboard_score">...</span>
    </div>
    <div className="bs_box_line"></div>
    <div className="leaderboard_row title_row">
      <span className="leaderboard_rank">101</span>
      <span className="leaderboard_name">you</span>
      <span className="leaderboard_score">3</span>
    </div>
    <div className="bs_box_line"></div>
  </div>
  );
}