import { sort_by_color } from '../utils/colorSort';

describe("sort_by_color", () => {
  it("returns every color it was given", () => {
    const input = ["#0000ff", "#ff0000", "#00ff00", "#ffffff", "#000000"];
    expect([...sort_by_color(input)].sort()).toEqual([...input].sort());
  });
  it("orders by hue: red, green, blue", () => {
    expect(sort_by_color(["#0000ff", "#ff0000", "#00ff00"])).toEqual(["#ff0000", "#00ff00", "#0000ff"]);
  });
  it("keeps duplicate colors", () => {
    expect(sort_by_color(["#ff0000", "#ff0000"])).toEqual(["#ff0000", "#ff0000"]);
  });
  it("gives the same result every time, with no colors carried over from earlier calls", () => {
    const input = ["#0000ff", "#ff0000", "#00ff00"];
    const first = sort_by_color(input);
    expect(sort_by_color(input)).toEqual(first);
    expect(sort_by_color(["#ff0000"])).toEqual(["#ff0000"]);
  });
  it("returns an empty list for no colors", () => {
    expect(sort_by_color([])).toEqual([]);
  });
});
