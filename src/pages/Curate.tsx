import React from 'react';

export function Curate(){
  return(
    <div className="curate_box">
      <div className="book_title_head">
        <a id="book_name_href" href="https://www.goodreads.com/book/show/9647532">Fuzzy Nation</a>
      </div>
      <div className="emoji_rater pointer_no_select" id="bad">
        <div className="emoji_head">bad</div>
        <div className="emoji_emoji">👎</div>
      </div>
        <div className="spine_container"><img alt="spine_to_review" className="curate_spine" src="https://bookshelf-spines.s3.amazonaws.com/FuzzyNationFuzzySapiens7-9647532.jpeg" /></div>
      <div className="emoji_rater pointer_no_select" id="good">
        <div className="emoji_head">good</div>
        <div className="emoji_emoji">👍</div>
      </div>
      <div className="emoji_rater pointer_no_select" id="report">
        <div className="emoji_head">report</div>
        <div className="emoji_emoji">🚫</div>
      </div>
    </div>
  );
}