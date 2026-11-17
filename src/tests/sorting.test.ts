import { foundBook } from '../types/interfaces';
import {
  alphabetize_by_title_algo, alphabetize_list_by_title, alphabetize_list_by_author,
  sort_books_by_color, sort_books_by_date, sort_books_by_height, sort_books_by_rating, sort_books_by_year
} from '../utils/sorting';

// Books can come from a Goodreads export or from Hardcover. Goodreads books have a Goodreads book_id and
// string dates/ratings; Hardcover books have a hardcover_book_id and (often) fewer fields filled in.
const base = { upload_id: "u", dimensions: "9 x 6 x 1", fileName: "f.jpg", submitter: "s" };
const goodreads = (o : Partial<foundBook> & { title : string }) : foundBook =>
  ({ ...base, author: "Some Author", book_id: o.title, ...o });
const hardcover = (o : Partial<foundBook> & { title : string }) : foundBook =>
  ({ ...base, author: "Some Author", book_id: "", hardcover_book_id: 1, ...o });

const titles = (books : foundBook[]) => books.map(b => b.title);

describe.each([["goodreads", goodreads], ["hardcover", hardcover]])("sorting (%s books)", (_name, make) => {
  describe("title", () => {
    it("sorts alphabetically, ignoring a leading The/A/An", () => {
      const list = [make({title: "The Zebra"}), make({title: "Apple"}), make({title: "A Mango"}), make({title: "An Banana"})];
      expect(titles(alphabetize_list_by_title(list))).toEqual(["Apple", "An Banana", "A Mango", "The Zebra"]);
    });
    it("compares equal titles as 0", () => {
      expect(alphabetize_by_title_algo(make({title: "The Hobbit"}), make({title: "Hobbit"}))).toBe(0);
    });
  });

  describe("author", () => {
    it("sorts by last name, then first name", () => {
      const list = [
        make({title: "1", author: "Zed Adams"}),
        make({title: "2", author: "Amy Brown"}),
        make({title: "3", author: "Bob Adams"}),
      ];
      expect(titles(alphabetize_list_by_author(list))).toEqual(["3", "1", "2"]);
    });
    it("orders books by the same author by series number, then title", () => {
      const list = [
        make({title: "Book Two (Saga #2)", author: "A Writer"}),
        make({title: "Standalone", author: "A Writer"}),
        make({title: "Book One (Saga #1)", author: "A Writer"}),
      ];
      const sorted = titles(alphabetize_list_by_author(list));
      expect(sorted.indexOf("Book One (Saga #1)")).toBeLessThan(sorted.indexOf("Book Two (Saga #2)"));
    });
  });

  describe("publication year", () => {
    it("sorts oldest first, with books missing a date first", () => {
      const list = [make({title: "new", pubDate: "2020"}), make({title: "none"}), make({title: "old", pubDate: "1999-05-01"})];
      expect(titles(sort_books_by_year(list))).toEqual(["none", "old", "new"]);
    });
  });

  describe("rating", () => {
    it("sorts by user rating ascending, ties by title, unrated first", () => {
      const list = [
        make({title: "b", user_rating: "5"}), make({title: "a", user_rating: "5"}),
        make({title: "unrated"}), make({title: "low", user_rating: "2"}),
      ];
      expect(titles(sort_books_by_rating(list, "user_rating"))).toEqual(["unrated", "low", "a", "b"]);
    });
    it("sorts by average rating, independent of user rating", () => {
      const list = [
        make({title: "hi", average_rating: "4.5", user_rating: "1"}),
        make({title: "lo", average_rating: "3.1", user_rating: "5"}),
      ];
      expect(titles(sort_books_by_rating(list, "average_rating"))).toEqual(["lo", "hi"]);
    });
  });

  describe("height", () => {
    it("sorts shortest first using the tallest dimension", () => {
      const list = [make({title: "tall", dimensions: "10 x 6 x 1"}), make({title: "short", dimensions: "1 x 7 x 5"}), make({title: "mid", dimensions: "8 x 5 x 1"})];
      expect(titles(sort_books_by_height(list))).toEqual(["short", "mid", "tall"]);
    });
  });

  describe("date read by user", () => {
    it("sorts oldest first", () => {
      const list = [
        make({title: "c", user_read_at: "Sat, 01 Jun 2024 00:00:00 -0700"}),
        make({title: "a", user_read_at: "2019-02-03"}),
        make({title: "b", user_read_at: "2021-12-25T10:00:00Z"}),
      ];
      expect(titles(sort_books_by_date(list, "user_read_at"))).toEqual(["a", "b", "c"]);
    });
    it("puts books with a missing, empty or invalid date last, ordered by title", () => {
      const list = [
        make({title: "z-missing"}),
        make({title: "dated", user_read_at: "2020-01-01"}),
        make({title: "a-empty", user_read_at: ""}),
        make({title: "m-bad", user_read_at: "not a date"}),
      ];
      expect(titles(sort_books_by_date(list, "user_read_at"))).toEqual(["dated", "a-empty", "m-bad", "z-missing"]);
    });
  });

  describe("color", () => {
    it("returns every book exactly once", () => {
      const list = [
        make({title: "red", domColor: "#ff0000"}), make({title: "blue", domColor: "#0000ff"}),
        make({title: "green", domColor: "#00ff00"}), make({title: "red2", domColor: "#ff0000"}),
      ];
      expect(titles(sort_books_by_color(list)).sort()).toEqual(["blue", "green", "red", "red2"]);
    });
    it("groups by hue (red, then green, then blue)", () => {
      const list = [make({title: "blue", domColor: "#0000ff"}), make({title: "red", domColor: "#ff0000"}), make({title: "green", domColor: "#00ff00"})];
      expect(titles(sort_books_by_color(list))).toEqual(["red", "green", "blue"]);
    });
    it("gives the same result when run twice", () => {
      const mk = () => [make({title: "blue", domColor: "#0000ff"}), make({title: "red", domColor: "#ff0000"})];
      expect(titles(sort_books_by_color(mk()))).toEqual(titles(sort_books_by_color(mk())));
    });
  });
});
