import { ColorInput, NumberInput, Select } from "@mantine/core";
import { useState } from "react";
import { sortManualProps } from "./SortManual";
import { convert_cm_to_in, convert_in_to_cm } from "../utils/utilities";

type ShelfUnits = "IN" | "CM";

export function CustomizeShelf({widgetCallback, booklist, genShelf}: sortManualProps) {

  // TODO: iterate through the booklist to find the tallest book. This plus .5 will be the default shelf height

  // TODO: If the user inputs a shelfHeight smaller than the tallest book, print a warning

  const [shelfBgColor, setShelfBgColor] = useState("#afb2b6");
  const [shelfFgColor, setShelfFgColor] = useState("#454856");
  const [shelfHeight, setShelfHeight] = useState<number | undefined>(10.5);
  const [shelfWidth, setShelfWidth] = useState<number | undefined>(24);
  const [shelfUnits, setShelfUnits] = useState<ShelfUnits>("IN");

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
          />
      </div>
      <div className="bs_button_wrapper">
        <button className="bs_button" id="submit_manual_sort" onClick={submitCustomization}>Generate Shelf</button>
      </div>
  </div>
  );
}
