import { useContext } from "react";
import nextId from "react-id-generator";
import { ColorSchemeCtx } from "../ColorSchemeContext";
import { Faq, FaqItem } from "./Faq";
import { Title } from "./Title";

export function HowTo(){
  const { colorScheme } = useContext(ColorSchemeCtx);
  const faq_items : FaqItem[] = [
    {
      value: "make_shelf",
      control: "How do I make a virtual bookshelf?",
      panel: (
      <div key={nextId()}>
        <p>To use this site, you'll need to have a Goodreads account. If you don't have on yet, <a href="https://www.goodreads.com/user/sign_up" className={"a_".concat(colorScheme)}>you can register for one here.</a></p>
        <p>In your Goodreads account, make a new shelf with whatever name you want. You can do this from any Goodreads book page, or from any other shelf page.</p>
        <img className="bs_faq_img" src="https://i.imgur.com/wLkjkui.png" alt="add shelf from book page" style={{marginBottom:"1vw"}}/>
        <img className="bs_faq_img" src="https://i.imgur.com/5Kb8dGc.png" alt="add shelf from shelf page"/>
        <p>Add all the books you want to be displayed on your virtual bookshelf to that Goodreads shelf.</p>
        <p className={"a_".concat(colorScheme)} onClick={()=>{document.getElementById("create")?.click()}}>Go to the Create tab</p>
        <p>Here, paste your Goodreads profile URL (or your Goodreads User ID, there's another FAQ item explaining that) and the name of the shelf you're using. The name needs to match exactly, with the same capitalization. If Goodreads can't find the shelf name you provided, it will instead return a list of every book you've added on your Goodreads account, which probably isn't what you're looking for.</p>
        <p>Click "Generate"</p>
        <p>Now you'll be provided the option to sort your books, or to upload spine images for books on shelf that aren't in the system yet. That's a different objective, so for now, just click the sort button.</p>
        <p>Here you're given some sort options. There's a bunch of options, like sorting by author last name, or alphabetically. Pick the one you want. If none of those options are to your liking, click "Sort Manually" and you can drag and drop the books in a list until they're in the order you want. Once you've selected something, click "Generate."</p>
        <p>Once the website has finished creating your virtual bookshelf, it will show you the image it created. You can now either download it, and/or, if you've registered an account, save that bookshelf to your profile for later access.</p>
      </div>
      )
    },
    {
      value: "goodreads_user_id",
      control: "Where do I find my goodreads user id?",
      panel: (
        <div key={nextId()}>
          <p>Every Goodreads user has a numeric User ID. You can find this by going to your (or any other user's) profile page. Your Goodreads User ID will be contained in the URL.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/UI9CyEY.png" alt="goodreads_profile_url"/>
          <p>You can see my goodreads profile URL is <a href="https://www.goodreads.com/user/show/119763485-jonas" className={"a_".concat(colorScheme)}>https://www.goodreads.com/user/show/119763485-jonas</a>. Therefore, my User ID would be 119763485. The bookshelf website needs this ID to pull shelf information from your account.</p>
          <p>If you're on mobile, the same URL can be found relatively easily. Navigate to your profile page in the app. Then click the “share” icon.</p>
          <p>Then just click “Copy”, and your profile URL will be copied to the clipboard.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/bE1GJiN.jpg" alt="goodreads_profile_mobile"/>
          <p>The bookshelf website is generally smart enough to parse out your Goodreads ID if you just paste your profile URL in, but it's guaranteed to work if you paste in your numeric ID.</p>
          <p>Fun fact, the first Goodreads user, found at <a href="https://www.goodreads.com/user/show/1" className={"a_".concat(colorScheme)}>https://www.goodreads.com/user/show/1</a>, is Otis Chandler, the creator of Goodreads. Makes sense.</p>
			</div>
      )
    },
    {
      value: "goodreads_book_id",
      control: "Where do I find a goodreads book id?",
      panel: (
        <div key={nextId()}>
				  <p>Every edition of every book has a unique numeric Book ID. You can find this by going to the page of the specific edition you're looking for. The Book ID will be contained in the URL.</p>
          <img className="bs_faq_img" src="https://i.imgur.com/LKcdcca.png" alt="where the bookid is in the url"/>
          <p>For the purposes of the “My Bookshelf” website, you'll only need the URL. You can paste that into the website, and it will parse out the book id for you.</p>
          <p>You can also find this ID on the mobile app. Just go to the book edition you want, click the “share” icon, and click copy. This will copy the URL to your clipboard. You can then paste it somewhere and extract that numeric book id. Or, if you're using the bookshelf website, just paste that url directly.</p>
          <p>Fun fact: The book with the lowest Book ID on Goodreads (1, it is 1 not 0 indexed) is <a href="https://www.goodreads.com/book/show/1" className={"a_".concat(colorScheme)}>Harry Potter #6</a>. This seems to imply that this specific book was the first one added to the service. If you keep going up 1-7, you'll find the rest of the Harry Potter series, in a seemingly random order. So at its roots, Goodreads was created by and for Harry Potter fans. Or perhaps they were just using one of the most popular series of all time to start with, who knows? 🤔</p>
			</div>
      )
    },
    {
      value: "contribute_spines",
      control: "How do I contribute book spines?",
      panel: ""
    },
    {
      value: "edit_spines",
      control: "How do you edit spine images?",
      panel: ""
    },
    {
      value: "find_dimensions",
      control: "Where can I find the dimensions for my book?",
      panel: (
        <div key={nextId()}>
          <p>Regrettably, I haven't found a foolproof way to source physical dimensions of a book yet. The most consistent place I've found is Amazon. But just searching the book title doesn't always work. You've got to make sure you find the right edition. And Amazon, you know, the company originally created to sell books, absolutely sucks at letting me search by edition. You can click “hardcover” or “paperback” or “mass market paperback” and hope that printing lines up with the spine image you found.</p>
          <p>From there, scroll down on the page (or press ctrl+f) and search for the term “dimensions”. There's the data we need. The bookshelf website (currently) only takes input in inches. You can just copy the text in the dimensions area (excluding the “inches” if it's present) and paste that in the bookshelf website. It should look something like “6 x 0.7 x 9”.</p>
          <p>A more consistent way to find the exact edition you're looking for is via the ISBN. Copy that and paste it directly in the Amazon search bar, and in most cases, the book edition you're looking for will pop up. If that edition doesn't have any dimensions listed, you can just base your dimension input off the default provided for the given format. Or just guess. The bookshelf website only really cares about the height and width of a book. Most books are 7-9 inches tall, and .5-1.5 inches wide. An input like “5 x 8 x 0.8”, while an inaccurate guess, will most likely look okay. Oh, and the order of the numbers doesn't matter. The largest number is always recognized as the height, the middlest as the length (which we ignore anyways), and the smallest as the width.</p>
          <p>Sometimes the dimensions on Amazon aren't accurate. You'll notice this when the bookshelf website places a spine that just appears stretched. In those cases, you can either manually adjust the dimensions till it looks right, or break out a ruler and measure the physical book yourself (if you have a copy).</p>
          <p>I'm not sure why Amazon bothers to include the dimensions on the product page in the first place, as I highly doubt there's any worthwhile amount of customers basing their purchase off a book's height. I suspect that data is gathered moreso for Amazon shipping warehouses, so they can estimate what size/kind of packaging they'll need to ship your order.</p>
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
