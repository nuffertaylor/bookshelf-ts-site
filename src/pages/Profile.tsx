import React from 'react';
import { defaultProps } from '../types/interfaces';
import { getCookie } from '../utilities';

export function Profile({widgetCallback} : defaultProps){
  const username = getCookie("username");
  return(
    <div className="bs_profile_box">
    <div className="bs_profile_title">
      <span className="bs_unfound_title">{username}'s Profile</span>
    </div>
    <div className="bs_profile_body">
      <div className="bs_submissions_row">
        <span>Your Spine Submissions</span>
        <span className="arrow arrow-right"></span>
      </div>
      <div className="bs_submissions_row">
        <span>Your Saved Virtual Bookshelves</span>
        <span className="arrow arrow-right"></span>
      </div>
      <div className="bs_gr_id_row">
        <input type="text" placeholder="goodreads user id" className="bs_text_input bs_gr_id_input" />
        <button className="bs_button bs_enter_button bs_gr_id_button">save your ID</button>
      </div>
    </div>
    <div className="bs_center_grid">
      <button className="bs_button bs_logout_button">logout</button>
    </div>
  </div>
  )
}