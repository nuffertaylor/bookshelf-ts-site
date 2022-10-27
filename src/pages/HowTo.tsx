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
      panel: "It's the number in the url of your profile page."
    }
  ];
  return(
    <div>
      <Title title={"How to Use My Bookshelf"} includeArrow={false} includeBottomLine={false}/>
      <Faq items={faq_items}/>
    </div>
  );
}
