import { book, foundBook } from '../types/interfaces';
import {
  validUrl, validEmail, onlyDigits, onlyNumbers, capitalizeFirstLetter,
  remove_query_string, remove_text_title, remove_non_numeric_char_from_str, get_last_sub_dir_from_url,
  split_dimensions_str_into_h_w_l, convert_cm_to_in, convert_in_to_cm,
  get_tallest_book_inches, get_default_shelf_height_inches, get_year_from_date_str,
  getCookie, setCookie, deleteCookie
} from '../utils/utilities';

const withDims = (dimensions : string) : foundBook =>
  ({ title: "t", author: "a", book_id: "1", upload_id: "u", dimensions, fileName: "f.jpg", submitter: "s" });
const noDims = () : book => ({ title: "t", author: "a", book_id: "1" });

describe("validation", () => {
  it("validEmail accepts normal addresses and rejects text with no @", () => {
    expect(validEmail("person@example.com")).toBe(true);
    expect(validEmail("first.last+tag@sub.example.co")).toBe(true);
    expect(validEmail("not an email")).toBe(false);
    expect(validEmail("")).toBe(false);
  });
  it("validUrl accepts urls with a scheme or www and rejects plain words", () => {
    expect(validUrl("https://example.com/path?x=1")).toBe(true);
    expect(validUrl("http://example.com")).toBe(true);
    expect(validUrl("www.example.com")).toBe(true);
    expect(validUrl("")).toBe(false);
    expect(validUrl("hello")).toBe(false);
  });
  it("onlyDigits and onlyNumbers accept digit strings only", () => {
    [onlyDigits, onlyNumbers].forEach(fn => {
      expect(fn("12345")).toBe(true);
      expect(fn("0")).toBe(true);
      expect(fn("")).toBe(false);
      expect(fn("12a")).toBe(false);
      expect(fn("1.5")).toBe(false);
      expect(fn("-1")).toBe(false);
      expect(fn(" 1")).toBe(false);
    });
  });
});

describe("string helpers", () => {
  it("capitalizeFirstLetter", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("Hello")).toBe("Hello");
    expect(capitalizeFirstLetter("")).toBe("");
    expect(capitalizeFirstLetter("a")).toBe("A");
    expect(capitalizeFirstLetter("1abc")).toBe("1abc");
  });
  it("remove_query_string drops everything from the first ?", () => {
    expect(remove_query_string("https://x.com/book/123?ref=abc&b=2")).toBe("https://x.com/book/123");
    expect(remove_query_string("https://x.com/book/123")).toBe("https://x.com/book/123");
    expect(remove_query_string("")).toBe("");
  });
  it("remove_text_title keeps what comes before the first dash", () => {
    expect(remove_text_title("12345-the-hobbit")).toBe("12345");
    expect(remove_text_title("12345")).toBe("12345");
  });
  it("remove_non_numeric_char_from_str keeps digits only", () => {
    expect(remove_non_numeric_char_from_str("a1b2-c3")).toBe("123");
    expect(remove_non_numeric_char_from_str("abc")).toBe("");
    expect(remove_non_numeric_char_from_str("")).toBe("");
  });
  it("get_last_sub_dir_from_url returns the last path segment, ignoring a trailing slash", () => {
    expect(get_last_sub_dir_from_url("https://x.com/book/show/123")).toBe("123");
    expect(get_last_sub_dir_from_url("https://x.com/book/show/123/")).toBe("123");
    expect(get_last_sub_dir_from_url("")).toBe("");
  });
});

describe("split_dimensions_str_into_h_w_l", () => {
  it("returns the largest as height and the smallest as width, with the remaining one as length", () => {
    expect(split_dimensions_str_into_h_w_l("9 x 6 x 1")).toEqual({ h: 9, w: 1, l: 6 });
  });
  it("doesn't care about the order of the numbers", () => {
    expect(split_dimensions_str_into_h_w_l("1 x 9 x 6")).toEqual({ h: 9, w: 1, l: 6 });
  });
  it("handles decimals, uppercase X and missing spaces", () => {
    expect(split_dimensions_str_into_h_w_l("8.5X5.25x1.1")).toEqual({ h: 8.5, w: 1.1, l: 5.25 });
  });
  it("uses the height as the length when two dimensions tie for largest", () => {
    expect(split_dimensions_str_into_h_w_l("9 x 9 x 6")).toEqual({ h: 9, w: 6, l: 9 });
  });
  it("uses the same value for all three when they're all equal", () => {
    expect(split_dimensions_str_into_h_w_l("8 x 8 x 8")).toEqual({ h: 8, w: 8, l: 8 });
  });
  it("uses the tied value as the length when two dimensions tie for smallest", () => {
    expect(split_dimensions_str_into_h_w_l("9 x 6 x 6")).toEqual({ h: 9, w: 6, l: 6 });
    expect(split_dimensions_str_into_h_w_l("6 x 9 x 6")).toEqual({ h: 9, w: 6, l: 6 });
  });
  it("uses the height as the length when there aren't three dimensions", () => {
    expect(split_dimensions_str_into_h_w_l("9 x 6")).toEqual({ h: 9, w: 6, l: 9 });
  });
  it("gives NaN for unparseable input rather than throwing", () => {
    expect(split_dimensions_str_into_h_w_l("unknown").h).toBeNaN();
  });
});

describe("unit conversion", () => {
  it("converts between cm and inches", () => {
    expect(convert_cm_to_in(2.54)).toBeCloseTo(1);
    expect(convert_cm_to_in(0)).toBe(0);
    expect(convert_in_to_cm(1)).toBeCloseTo(2.54);
    expect(convert_in_to_cm(10)).toBeCloseTo(25.4);
  });
  it("round-trips", () => {
    expect(convert_in_to_cm(convert_cm_to_in(23.5))).toBeCloseTo(23.5);
  });
});

describe("shelf height", () => {
  it("get_tallest_book_inches returns the tallest dimension across books", () => {
    expect(get_tallest_book_inches([withDims("9 x 6 x 1"), withDims("10.25 x 7 x 2"), withDims("5 x 3 x 1")])).toBe(10.25);
  });
  it("ignores books without dimensions, and returns 0 when none are known", () => {
    expect(get_tallest_book_inches([noDims(), withDims("8 x 5 x 1"), withDims("")])).toBe(8);
    expect(get_tallest_book_inches([noDims(), withDims("")])).toBe(0);
    expect(get_tallest_book_inches([])).toBe(0);
  });
  it("ignores dimension strings that can't be parsed", () => {
    expect(get_tallest_book_inches([withDims("unknown"), withDims("7 x 5 x 1")])).toBe(7);
  });
  it("get_default_shelf_height_inches is .1 taller than the tallest book", () => {
    expect(get_default_shelf_height_inches([withDims("9 x 6 x 1")])).toBe(9.1);
    expect(get_default_shelf_height_inches([withDims("10.25 x 7 x 2")])).toBe(10.35);
  });
  it("falls back to 10.5 when no book has known dimensions", () => {
    expect(get_default_shelf_height_inches([])).toBe(10.5);
    expect(get_default_shelf_height_inches([noDims()])).toBe(10.5);
  });
});

describe("get_year_from_date_str", () => {
  it("reads the year from several date formats", () => {
    expect(get_year_from_date_str("2020")).toBe(2020);
    expect(get_year_from_date_str("1999-05-01")).toBe(1999);
    expect(get_year_from_date_str("Sat, 01 Jun 2024 12:00:00 +0000")).toBe(2024);
  });
  it("uses UTC, so a New Year's Day date isn't shifted into the previous year", () => {
    expect(get_year_from_date_str("2020-01-01")).toBe(2020);
    expect(get_year_from_date_str("2020-01-01T00:00:00Z")).toBe(2020);
  });
  it("gives NaN for an invalid date", () => {
    expect(get_year_from_date_str("not a date")).toBeNaN();
  });
});

describe("cookies", () => {
  // jsdom keeps cookies between tests, so clear what these tests use
  const clear = () => ["a_cookie", "other"].forEach(n => { document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"; });
  beforeEach(clear);
  afterAll(clear);

  it("getCookie returns an empty string for a cookie that isn't set", () => {
    expect(getCookie("a_cookie")).toBe("");
  });
  it("setCookie then getCookie round-trips a value", () => {
    setCookie("a_cookie", "hello");
    expect(getCookie("a_cookie")).toBe("hello");
  });
  it("getCookie picks the right cookie when several are set", () => {
    setCookie("a_cookie", "one");
    setCookie("other", "two");
    expect(getCookie("a_cookie")).toBe("one");
    expect(getCookie("other")).toBe("two");
  });
  it("setCookie overwrites an existing value", () => {
    setCookie("a_cookie", "old");
    setCookie("a_cookie", "new");
    expect(getCookie("a_cookie")).toBe("new");
  });
  it("deleteCookie removes a cookie, and is harmless when it isn't set", () => {
    setCookie("a_cookie", "hello");
    deleteCookie("a_cookie");
    expect(getCookie("a_cookie")).toBe("");
    expect(() => deleteCookie("never_set")).not.toThrow();
    expect(getCookie("never_set")).toBe("");
  });
});
