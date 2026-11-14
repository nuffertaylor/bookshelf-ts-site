import React, { ReactNode, useContext } from 'react';
import { ColorSchemeCtx } from '../ColorSchemeContext';

interface titleProps {
    backArrowOnClick ?: Function,
    title : string,
    includeBottomLine ?: boolean
    includeArrow ?: boolean,
    titleExtra ?: ReactNode  // rendered inline right after the title, e.g. a help icon
}

//TODO: allow option for making the title bar sticky if the div scrolls
export function Title({backArrowOnClick=()=>{}, title, includeBottomLine=true, includeArrow=true, titleExtra} : titleProps){
  const { colorScheme } = useContext(ColorSchemeCtx);
    const onClickWrapper = () => {backArrowOnClick();}
    return (
      <div>
        <div className="unfound_row" id="sectionTitle">
          <div className="bs_title_arrow">
            {includeArrow &&
            <span className={"arrow arrow-left arrow_".concat(colorScheme)} onClick={onClickWrapper}></span>
            }
            {!includeArrow && <div></div>}
            <span className="bs_unfound_title">{title}{titleExtra}</span>
          </div>
        </div>
          {includeBottomLine &&
          <div className="bs_box_line"></div>
          }
      </div>
    )
}