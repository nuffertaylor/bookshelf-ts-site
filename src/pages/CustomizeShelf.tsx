import { ColorInput, NumberInput, Select } from "@mantine/core";
import { useState } from "react";
import { sortManualProps } from "./SortManual";
import { convert_cm_to_in, convert_in_to_cm, get_default_shelf_height_inches, get_tallest_book_inches } from "../utils/utilities";

type ShelfUnits = "IN" | "CM";

export function CustomizeShelf({widgetCallback, booklist, genShelf}: sortManualProps) {

  const [shelfBgColor, setShelfBgColor] = useState("#afb2b6");
  const [shelfFgColor, setShelfFgColor] = useState("#454856");
  const [shelfHeight, setShelfHeight] = useState<number | undefined>(() => get_default_shelf_height_inches(booklist));
  const [shelfWidth, setShelfWidth] = useState<number | undefined>(24);
  const [shelfUnits, setShelfUnits] = useState<ShelfUnits>("IN");

  const tallestBookInches = get_tallest_book_inches(booklist);
  const shelfHeightInches = shelfUnits === "CM" ? convert_cm_to_in(shelfHeight ?? 0) : (shelfHeight ?? 0);
  const shelfTooShort = shelfHeight !== undefined && shelfHeightInches < tallestBookInches;
  const tallestBookDisplay = shelfUnits === "CM" ? convert_in_to_cm(tallestBookInches) : tallestBookInches;

  const submitCustomization = () => {
    if (shelfUnits === "CM") {
      setShelfHeight(convert_cm_to_in(shelfHeight as number));
      setShelfWidth(convert_cm_to_in(shelfWidth as number));
    }

    genShelf({
      books: booklist,
      shelfBgColor: shelfBgColor,
      shelfFgColor: shelfFgColor,
      shelfHeightInches: shelfHeight,
      shelfWidthInches: shelfWidth,

    });
  };

  const changeShelfUnits = (units: ShelfUnits) => {
    if (units === "CM" && shelfUnits === "IN") {
      setShelfHeight(convert_in_to_cm(shelfHeight as number));
      setShelfWidth(convert_in_to_cm(shelfWidth as number));
    } else if (units === "IN" && shelfUnits === "CM") {
      setShelfHeight(convert_cm_to_in(shelfHeight as number));
      setShelfWidth(convert_cm_to_in(shelfWidth as number));
    }
    setShelfUnits(units);
  }


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
      <div className ="text-left">
        <Select
          label="Units to Use"
          data={[{value: 'IN', label: 'Inches'}, {value: 'CM', label: 'Centimeters'}]}
          value={shelfUnits}
          onChange={changeShelfUnits}
        />
      </div>
      <div className="text-left">
        <NumberInput
            label="Shelf Width"
            placeholder=""
            precision={2}
            value={shelfWidth}
            onChange={setShelfWidth}
          />
      </div>
      <div className="text-left">
        <NumberInput
            label="Shelf Height"
            placeholder=""
            precision={2}
            value={shelfHeight}
            onChange={setShelfHeight}
            error={shelfTooShort
              ? `Warning: your tallest book is ${tallestBookDisplay.toFixed(2)} ${shelfUnits === "CM" ? "cm" : "in"}, which won't fit on a shelf this short`
              : undefined}
          />
      </div>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submitCustomization}>Generate Shelf</button>
      </div>
  </div>
  );
}
