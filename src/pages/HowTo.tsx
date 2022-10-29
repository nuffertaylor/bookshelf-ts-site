import { Faq, FaqItem } from "./Faq";
import { Title } from "./Title";

export function HowTo(){
  const faq_items : FaqItem[] = [
    {
      value: "make_shelf",
      control: "How do I make a virtual bookshelf?",
      panel: "You use the website silly"
    },
    {
      value: "goodreads_user_id",
      control: "Where do I find my goodreads user id?",
      panel: (
        <div>
          <p>Every Goodreads user has a numeric User ID. You can find this by going to your (or any other user’s) profile page. Your Goodreads User ID will be contained in the URL.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/UI9CyEY.png" alt="goodreads_profile_url"/>
          <p>You can see my goodreads profile URL is <a href="https://www.goodreads.com/user/show/119763485-jonas">https://www.goodreads.com/user/show/119763485-jonas</a>. Therefore, my User ID would be 119763485. The bookshelf website needs this ID to pull shelf information from your account.</p>
          <p>If you’re on mobile, the same URL can be found relatively easily. Navigate to your profile page in the app. Then click the “share” icon.</p>
          <p>Then just click “Copy”, and your profile URL will be copied to the clipboard.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/bE1GJiN.jpg" alt="goodreads_profile_mobile"/>
          <p>The bookshelf website is generally smart enough to parse out your Goodreads ID if you just paste your profile URL in, but it’s guaranteed to work if you paste in your numeric ID.</p>
          <p>Fun fact, the first Goodreads user, found at <a href="https://www.goodreads.com/user/show/1">https://www.goodreads.com/user/show/1</a>, is Otis Chandler, the creator of Goodreads. Makes sense.</p>
			</div>
      )
    }
  ];
  return(
    <div>
      <Title title={"How to Use My Bookshelf"} includeArrow={false} includeBottomLine={false}/>
      <Faq items={faq_items}/>
    </div>
  );
}
