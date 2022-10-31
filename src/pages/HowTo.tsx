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
    },
    {
      value: "goodreads_book_id",
      control: "Where do I find a goodreads book id?",
      panel: (
        <div>
				  <p>Every edition of every book has a unique numeric Book ID. You can find this by going to the page of the specific edition you’re looking for. The Book ID will be contained in the URL.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/LKcdcca.png" alt="where the bookid is in the url"/>
          <p>For the purposes of the “My Bookshelf” website, you'll only need the URL. You can paste that into the website, and it will parse out the book id for you.</p>
          <p>You can also find this ID on the mobile app. Just go to the book edition you want, click the “share” icon, and click copy. This will copy the URL to your clipboard. You can then paste it somewhere and extract that numeric book id. Or, if you’re using the bookshelf website, just paste that url directly.</p>
          <p>Fun fact: The book with the lowest Book ID on Goodreads (1, it is 1 not 0 indexed) is <a href="https://www.goodreads.com/book/show/1">Harry Potter #6</a>. This seems to imply that this specific book was the first one added to the service. If you keep going up 1-7, you’ll find the rest of the Harry Potter series, in a seemingly random order. So at its roots, Goodreads was created by and for Harry Potter fans. Or perhaps they were just using one of the most popular series of all time to start with, who knows? 🤔</p>
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
