const bookTestData = [
  {
    "upload_id": "9ffd4520-aea3-42ab-afe5-f1791c60ea1d",
    "book_id": "52780142",
    "title": "Get Out of Your Head: Stopping the Spiral of Toxic Thoughts",
    "author": "Jennie Allen",
    "dimensions": "5.7x8.54x1",
    "domColor": "#ebeaec",
    "fileName": "GetOutofYourHeadStoppingtheSpiralofToxicThoughts-52780142-XX67QMs7p1.jpeg",
    "genre": "Self-help",
    "isbn": "1601429649",
    "isbn13": "9781601429643",
    "pubDate": "2020",
    "submitter": "jonas",
    "rating": 0,
    "flagged": null,
    "user_read_at": "Sat, 19 Dec 2020 00:00:00 +0000",
    "average_rating": "4.06",
    "user_rating": "2"
},
{
    "upload_id": "73b56a19-06fc-4560-ac34-d013141ef275",
    "book_id": "26834094",
    "title": "Taduno's Song",
    "author": "Odafe Atogun",
    "dimensions": "5.2 x 0.9 x 8.2",
    "domColor": "#f75868",
    "fileName": "TadunosSong-26834094-VbNhyAYsIp.jpeg",
    "genre": "Fiction",
    "isbn": "1782118055",
    "isbn13": "9781782118053",
    "pubDate": "2016",
    "submitter": "jonas",
    "rating": 0,
    "flagged": null,
    "user_read_at": "Mon, 1 Jun 2020 00:00:00 +0000",
    "average_rating": "3.53",
    "user_rating": "3"
},
{
    "upload_id": "25471d77-8864-4500-bef5-9cd7c8f417ef",
    "book_id": "43015",
    "title": "A Long Way Gone: Memoirs of a Boy Soldier",
    "author": "Ishmael Beah",
    "dimensions": "5.5x8.5x0.75",
    "domColor": "#aba653",
    "fileName": "ALongWayGoneMemoirsofaBoySoldier-43015-zrN0wVPXsG.jpeg",
    "genre": "Nonfiction",
    "isbn": "0374105235",
    "isbn13": "9780374105235",
    "pubDate": "2007",
    "submitter": "jonas",
    "rating": 0,
    "flagged": null,
    "user_read_at": "Sat, 1 Aug 2020 00:00:00 +0000",
    "average_rating": "4.16",
    "user_rating": "4"
},
{
    "upload_id": "249856f9-5d75-455c-adb4-b9d0b8ffba98",
    "book_id": "23493839",
    "title": "Maximus",
    "author": "Richard L. Black",
    "dimensions": "6.3 x 1.7 x 9.2",
    "domColor": "#43383a",
    "fileName": "Maximus-23493839-6cLJmeeuDc.jpeg",
    "genre": "Historical",
    "isbn": "160907985X",
    "isbn13": null,
    "pubDate": "2015",
    "submitter": "jonas",
    "rating": 0,
    "flagged": null,
    "user_read_at": "Sun, 27 Dec 2020 00:00:00 +0000",
    "average_rating": "4.01",
    "user_rating": "4"
},
]
const IMG_URL_PREFIX = "https://bookshelf-spines.s3.amazonaws.com/";

const renderImage = () => {
  // create and place image
  const b64 = canvas.toDataURL("image/png");

  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.src = b64;
}

const borderWidth = 50;
const shelfWidth = 1500;
const shelfWidthInches = 24;
const inchPixelRatio = shelfWidth / shelfWidthInches;
const shelfHeight = 3000;
const rowHeight = shelfHeight / 4;


let leftStart = borderWidth;
let leftCurrent = borderWidth;
let bottomStart = rowHeight;
let bottomCurrent = rowHeight;

const convertBookDimensionsToPx = (book) => {
  const dimensions = book.dimensions.split('x');
  const pxValues = dimensions.map(dimension => {
    const floatValue = Number(dimension.trim());
    return floatValue * inchPixelRatio;
  }).sort((a, b) => a - b);
  // smallest value should be spine width, largest should be height
  return {
    width: pxValues[0],
    height: pxValues[2],
  }
}

const loadImages = async () => {
  for (const book of bookTestData) {
    const spine = new Image();
    spine.crossOrigin = "anonymous";
    spine.src = IMG_URL_PREFIX + book.fileName;
    // need to convert inches to px
    const dimensions = convertBookDimensionsToPx(book);
    // wait for image to load
    await spine.decode();
    if (leftCurrent > shelfWidth) {
      leftCurrent = borderWidth;
      bottomCurrent += rowHeight;
    }

    // because canvas places the image from the top-left corner, we need to add the calculated height to the bottom
    ctx.drawImage(spine, leftCurrent, bottomCurrent - dimensions.height, dimensions.width, dimensions.height);
    leftCurrent += dimensions.width;
  }

  renderImage();

}


const canvas = document.createElement("canvas");
canvas.width = shelfWidth;
canvas.height = shelfHeight;
const ctx = canvas.getContext("2d");
// draw background
ctx.fillStyle = "#afb2b6";
ctx.fillRect(0, 0, 1500, 3000);

// draw borders
ctx.fillStyle = "#454856";

// left border
ctx.fillRect(0, 0, borderWidth, 3000);
// right border
ctx.fillRect(1500 - borderWidth, 0, borderWidth, 3000);
// top border
ctx.fillRect(0, 0, 1500, borderWidth);
// bottom border
ctx.fillRect(0, shelfHeight - borderWidth, 1500, borderWidth);

// draw shelves
for (let i = rowHeight; i < shelfHeight; i += rowHeight ) {
ctx.fillRect(0, i, 1500, borderWidth);
}

loadImages();