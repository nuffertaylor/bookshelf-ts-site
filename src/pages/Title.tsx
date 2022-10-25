import React from 'react';

interface titleProps {
    backArrowOnClick ?: Function,
    title : string,
    includeBottomLine ?: boolean
    includeArrow ?: boolean
}

//TODO: allow option for making the title bar sticky if the div scrolls
//TODO: make color of back arrow change between black and white for each colorscheme
export function Title({backArrowOnClick=()=>{}, title, includeBottomLine=true, includeArrow=true} : titleProps){
    const onClickWrapper = () => {backArrowOnClick();}
    return (
      <div>
        <div className="unfound_row" id="sectionTitle">
          <div className="bs_title_arrow">
            {includeArrow &&
            <span className="arrow arrow-left" onClick={onClickWrapper}></span>
            }
            {!includeArrow && <div></div>}
            <span className="bs_unfound_title">{title}</span>
          </div>
        </div>
          {includeBottomLine &&
          <div className="bs_box_line"></div>
          }
      </div>
    )
}