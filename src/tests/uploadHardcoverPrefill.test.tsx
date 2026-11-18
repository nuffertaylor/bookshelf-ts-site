import React from 'react';
import { render, screen } from '@testing-library/react';
import { Upload } from '../pages/Upload';

// colorthief is only used once an image is chosen, so a stub is enough to import the real Upload.
jest.mock('colorthief', () => function ColorThief(){ return { getColor : () => [0, 0, 0] }; });
jest.mock('../utils/utilities', () => ({ ...jest.requireActual('../utils/utilities'), sendPostRequestToServer : jest.fn() }));

describe("the real Upload with a Hardcover prefill", () => {
  it("renders the prefilled book without a Goodreads id", () => {
    render(<Upload widgetCallback={jest.fn()} originCallback={jest.fn()}
      prefill={{ book_id : "", hardcover_book_id : 77, title : "Project Hail Mary", author : "Andy Weir", pubDate : "2021", isbn : "", isbn13 : "" } as any}/>);
    expect(screen.getByDisplayValue("Project Hail Mary")).toBeDisabled();
    expect(screen.getByDisplayValue("Andy Weir")).toBeDisabled();
    expect(screen.getByDisplayValue("2021")).toBeDisabled();
  });
});
