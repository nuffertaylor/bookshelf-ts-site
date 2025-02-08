import { IMG_URL_PREFIX } from "../types/constants";
import { book, foundBook } from "../types/interfaces";

interface Dimensions {
  width: number;
  height: number;
}

interface FakeSpineData {
  dataURL: string;
  heightInPx: number;
  widthInPx: number;
}

export interface BookshelfRendererParams {
  books: (foundBook | book)[],
  shelfWidthInches?: number,
  shelfHeightInches?: number,
  borderWidthInches?: number,
  shelfBgColor?: string,
  shelfFgColor?: string,
}

export class BookshelfRenderer {
  books: (foundBook | book)[] = [];
  // can be manually overriden
  inProgressRenderCallback: ((b64ShelfString: string) => void) | null = null;

  public get borderWidthInches() { return this._borderWidthInches; }
  set borderWidthInches(borderWidthInches: number) {
    this._borderWidthInches = borderWidthInches;
    this.borderWidth = borderWidthInches * this.inchPixelRatio;
    this.recalculateStartingPositions();
  }
  private _borderWidthInches = 1;
  private borderWidth: number;

  public get shelfWidthInches() { return this._shelfWidthInches; }
  set shelfWidthInches(widthInches: number) {
    this._shelfWidthInches = widthInches;
    this.shelfWidth = this.shelfWidthInches * this.inchPixelRatio;
    if (this.canvas) {
      this.canvas.width = this.shelfWidth;
    }
  }
  private _shelfWidthInches = 30;
  private shelfWidth: number;

  public get shelfHeightInches() { return this._shelfHeightInches; }
  set shelfHeightInches(heightInches: number) {
    this._shelfHeightInches = heightInches;
    this.shelfHeight = this.shelfHeightInches * this.inchPixelRatio;
    this.recalculateStartingPositions();
  }
  private _shelfHeightInches = 10.5;
  private shelfHeight: number;

  private inchPixelRatio = 60;

  // the number of shelves is dynamic. A new shelf should be added after each row is completed.
  // TODO: Allow for max number of vertical shelves, then go horizontal.
  private shelfBgColor = "#afb2b6";
  private shelfFgColor = "#454856";
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private leftStart = 0;
  private leftCurrent = 0;
  private bottomStart = 0;
  private bottomCurrent = 0;

  constructor(params: BookshelfRendererParams) {
    Object.assign(this, params);
    this.shelfWidth = this.shelfWidthInches * this.inchPixelRatio;
    this.shelfHeight = this.shelfHeightInches * this.inchPixelRatio;
    this.borderWidth = this.borderWidthInches * this.inchPixelRatio;

    // same content as recalculateStartingPositions
    this.recalculateStartingPositions();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.shelfWidth;
    this.canvas.height = 0;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  private recalculateStartingPositions(): void {
    this.leftStart = this.borderWidth;
    this.leftCurrent = this.leftStart;
    this.bottomStart = this.shelfHeight + this.borderWidth;
    this.bottomCurrent = this.bottomStart;
  }

  public async render(): Promise<string> {
    await this.addNewShelfRow();
    await this.loadSpines();
    return this.canvas.toDataURL("image/jpeg"); // to save space
  }

  private convertInchesToPx(inches: number): number {
    return inches * this.inchPixelRatio;
  }

  private convertBookDimensionsToPx(book: foundBook): Dimensions {
    const dimensions = book.dimensions.toLowerCase().split('x');
    const pxValues = dimensions.map(dimension => {
      const floatValue = Number(dimension.trim());
      return this.convertInchesToPx(floatValue);
    }).sort((a: number, b: number) => a - b);
    // smallest value should be spine width, largest should be height
    return {
      width: pxValues[0],
      height: pxValues[2],
    }
  }

  private addNewShelfRow = async (): Promise<void> => {
    const initialHeight = this.canvas.height;
    let image = null;
    let additionalHeight = this.shelfHeight + (this.borderWidth * 2);
    let bottomBorderStart = this.shelfHeight + initialHeight + this.borderWidth;
    let borderTopStart = 0;
    if (initialHeight > 0) {
      // this means something has already been rendered.
      // changing the canvas size erases what was there previously
      // so we'll store what has been genereated so far and replace it after changing the height
      image = new Image();
      image.src = this.canvas.toDataURL("image/png");
      await image.decode();
      // we need to remove borderWidth on every row after the first because
      // the bottom of the previous row and the top of this row are the same line
      additionalHeight -= this.borderWidth;
      bottomBorderStart -= this.borderWidth;
      borderTopStart = initialHeight - this.borderWidth;
    }
    this.canvas.height = initialHeight + additionalHeight;
    if (image !== null) {
      this.ctx.drawImage(image, 0, 0);
    }
  
    // draw background
    this.ctx.fillStyle = this.shelfBgColor;
    this.ctx.fillRect(0, initialHeight, this.shelfWidth, additionalHeight);
    // draw borders
    this.ctx.fillStyle = this.shelfFgColor;
    // left border
    this.ctx.fillRect(0, initialHeight, this.borderWidth, additionalHeight);
    // right border
    this.ctx.fillRect(this.shelfWidth - this.borderWidth, initialHeight, this.borderWidth, additionalHeight);
    // top border
    // (we only need to draw this on the first row)
    if (borderTopStart === 0) {
      this.ctx.fillRect(0, borderTopStart, this.shelfWidth, this.borderWidth);
    }
    // bottom border
    this.ctx.fillRect(0, bottomBorderStart, this.shelfWidth, this.borderWidth);
  
    if (this.inProgressRenderCallback != null) {
      this.inProgressRenderCallback(this.canvas.toDataURL("image/jpeg"));
    }
  }

  private loadSpines = async (): Promise<void> => {
    for (const book of this.books) {
      const spine = new Image();
      spine.crossOrigin = "anonymous";
      let dimensions;
      if ('fileName' in book && book.fileName != null) {
        spine.src = IMG_URL_PREFIX + book.fileName;
        dimensions = this.convertBookDimensionsToPx(book);
      } else { // we're generating a fake spine
        const fakeSpineData = this.generateFakeSpine(book);
        spine.src = fakeSpineData.dataURL;
        dimensions = { height: fakeSpineData.heightInPx, width: fakeSpineData.widthInPx }
      }
      // wait for image to load
      await spine.decode();
      if (this.leftCurrent + dimensions.width > this.shelfWidth - this.borderWidth) {
        this.leftCurrent = this.borderWidth;
        this.bottomCurrent += this.shelfHeight + this.borderWidth;
        await this.addNewShelfRow();
      }
  
      // because canvas places the image from the top-left corner, we need to add the calculated height to the bottom
      this.ctx.drawImage(spine, this.leftCurrent, this.bottomCurrent - dimensions.height, dimensions.width, dimensions.height);
      this.leftCurrent += dimensions.width;

      if (this.inProgressRenderCallback != null) {
        this.inProgressRenderCallback(this.canvas.toDataURL("image/jpeg"));
      }
    }
  }

  private getAuthorLastName(author: string): string {
    const authorNames = author.split(' ');
    return authorNames[authorNames.length - 1]; // this won't work if they're a JR or something
  }

  private getRandomFloatInIntRange(minimum: number, maximum: number): number {
    return (Math.random() * (maximum - minimum)) + minimum;
  }

  private calculateStringFontSizeInRange(stringValue: string,
                                 font: string,
                                 startingFontSize: number,
                                 minWidthInPx: number,
                                 maxWidthInPx: number,
                                 maxHeightInPx: number,
                                 ctx: CanvasRenderingContext2D
  ): TextMetrics {
    let currentFontSize = startingFontSize;
    let validMeasuredText = null;
    // note, this could loop infinitely if the string is too short. It will grow vertically beyond the box, then be shrunk but it isn't big enough yet,
    while (validMeasuredText == null) {
      ctx.font = currentFontSize.toString() + "px " + font;
      let measuredText = ctx.measureText(stringValue);
      if (measuredText.fontBoundingBoxAscent >= maxHeightInPx || measuredText.width > maxWidthInPx) {
        currentFontSize -= 1;
        continue;
      }
      else if (measuredText.width < minWidthInPx) {
        currentFontSize += 1;
        continue;
      }
      validMeasuredText = measuredText;
    }
    return validMeasuredText;
  }

  private generateFakeSpine(incompleteBook: book): FakeSpineData {
    // create a new canvas
    const spineCanvas = document.createElement("canvas");

    // Come up with a random height and width in a certain inch range, then convert to px
    const MINIMUM_HEIGHT_INCHES = 6.5;
    const MAXIMUM_HEIGHT_INCHES = this.shelfHeightInches - 1; // 1 inch shorter than shelf height
    const MINIMUM_WIDTH_INCHES = .75;
    const MAXIMUM_WIDTH_INCHES = 2;
    const widthInPx = Math.floor(this.convertInchesToPx(this.getRandomFloatInIntRange(MINIMUM_WIDTH_INCHES, MAXIMUM_WIDTH_INCHES)));
    const heightInPx = Math.floor(this.convertInchesToPx(this.getRandomFloatInIntRange(MINIMUM_HEIGHT_INCHES, MAXIMUM_HEIGHT_INCHES)));
    
    // inverse height and width so the book is laying on its side (easier for writing text)
    spineCanvas.height = widthInPx;
    spineCanvas.width = heightInPx;
    const spineCtx = spineCanvas.getContext("2d") as CanvasRenderingContext2D;
    
    // select random background color and fill
    // could be completely random, but probably better to select from a list of approved colors for good contrast
    // TODO: allow user to create a personal color pallet for their fake spine generation
    const COLORS = [
        {bg: "#f1faee", fg: "#000000"},
        {bg: "#a8dadc", fg: "#000000"},
        {bg: "#ff758f", fg: "#000000"},
        {bg: "#ffddd2", fg: "#000000"},
        {bg: "#ddb892", fg: "#000000"},
        {bg: "#dde5b6", fg: "#000000"},
    ];
    spineCtx.fillStyle = this.getRandomHexColor(); 
    // this line gets a random color from the provided list
    // const selectedColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    // spineCtx.fillStyle = selectedColor.bg;
    spineCtx.fillRect(0, 0, heightInPx, widthInPx);

    // LAST NAME
    // extract authors last name from the book
    const lastName = this.getAuthorLastName(incompleteBook.author);

    // TODO: select random font from list of available fonts
    // TODO: allow user customization of the list of fonts
    const font = "serif";

    // keep calculating the font until its between 20-25% of the spine
    const MIN_NAME_WIDTH = 0;
    const MAX_NAME_WIDTH = Math.floor(heightInPx * .25);
    let validMeasuredNameText = this.calculateStringFontSizeInRange(lastName, font, 48, MIN_NAME_WIDTH, MAX_NAME_WIDTH, widthInPx - 6, spineCtx);

    // place the last name on the spine
    const NAME_PADDING_RIGHT = 10;
    const nameXPosition = heightInPx - validMeasuredNameText.width - NAME_PADDING_RIGHT;
    const nameYPosition = widthInPx - Math.ceil((widthInPx - validMeasuredNameText.fontBoundingBoxAscent) / 2);
    spineCtx.fillStyle = "#000000"; // TODO?
    // spineCtx.fillStyle = COLORS.fg;
    spineCtx.fillText(lastName, nameXPosition, nameYPosition);

    // TITLE
    let title = incompleteBook.title;
    // goodreads includes series info like so "Title (Series, #2)"
    // so if there's a parenthesis, we'll cut everything out. If the titles has parens those will be removed, but kind of an edge case.
    const indexOfParen = title.indexOf('(');
    if (indexOfParen > 0) { title = title.slice(0, indexOfParen - 1); }

    // get text between 50-70% of spine width
    // TODO: if title is longer than certain number of chars (and has above certain number of white space) divide to two lines
    const MIN_TITLE_WIDTH = 0; // No minimum width (in case title is short)
    const MAX_TITLE_WIDTH = Math.floor(heightInPx * .7) - 10;
    let validMeasuredTitleText = this.calculateStringFontSizeInRange(title, font, 60, MIN_TITLE_WIDTH, MAX_TITLE_WIDTH, widthInPx - 6, spineCtx);

    // place title on spine
    const titleXPosition = Math.floor((MAX_TITLE_WIDTH - validMeasuredTitleText.width) / 2) + 10;
    const titleYPosition = widthInPx - Math.ceil((widthInPx - validMeasuredTitleText.fontBoundingBoxAscent) / 2);
    spineCtx.fillText(title, titleXPosition, titleYPosition);

    // rotate
    this.rotateCanvas90(spineCanvas);

    // convert to dataUrl
    const b64 = spineCanvas.toDataURL("image/png");

    // return object with dataurl string, heightInPx and widthInPx 
    return {
      dataURL: b64,
      heightInPx: heightInPx,
      widthInPx: widthInPx,
    }
  }

  private getRandomHexColor(): string {
    // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
    const randomNumber = Math.floor(Math.random() * 16777216);
  
    // Convert the random number to a hexadecimal string
    const hexString = randomNumber.toString(16);
  
    // Pad the hexadecimal string with leading zeros if necessary
    const paddedHexString = hexString.padStart(6, '0');
  
    // Return the hexadecimal color code with a "#" prefix
    return `#${paddedHexString}`;
  }

  private rotateCanvas90(canvas: HTMLCanvasElement): void {
    const width = canvas.width;
    const height = canvas.height;
  
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
    tempCtx.drawImage(canvas, 0, 0);
  
    canvas.width = height; // Swap width and height
    canvas.height = width;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  
    ctx.translate(canvas.width / 2, canvas.height / 2); // Translate to center
    ctx.rotate(Math.PI / 2); // Rotate 90 degrees
    // draw the rotated image
    ctx.drawImage(tempCanvas, -width / 2, -height / 2, width, height);
    ctx.translate(-canvas.width / 2, -canvas.height / 2); // Translate back
  }

}