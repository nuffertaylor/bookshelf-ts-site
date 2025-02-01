import { ColorInput } from "@mantine/core";
import { useState } from "react";
import { sortManualProps } from "./SortManual";

export function CustomizeShelf({widgetCallback, booklist, genShelf}: sortManualProps) {

  // TODO: iterate through the booklist to find the tallest book. This plus .5 will be the default shelf height

  // TODO: If the user inputs a shelfHeight smaller than the tallest book, print a warning

  const [shelfBgColor, setShelfBgColor] = useState("#afb2b6");
  const [shelfFgColor, setShelfFgColor] = useState("#454856");

  const submitCustomization = () => {
    genShelf({
      books: booklist,
      shelfBgColor: shelfBgColor,
      shelfFgColor: shelfFgColor,

    });
  };


  return(
  <div>
      <div className="bs_head">Customize Shelf</div>
      <div className="text-left">
        <ColorInput
          radius="md"
          label="Background Color"
          description="The background color of the bookshelf"
          value={shelfBgColor}
          onChange={setShelfBgColor}
        />
      </div>
      <div className="text-left">
        <ColorInput
          radius="md"
          label="Foreground Color"
          description="The color of the shelves "
          value={shelfFgColor}
          onChange={setShelfFgColor}
        />
      </div>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submitCustomization}>Generate Shelf</button>
      </div>
  </div>
  );
}
