import React, { useEffect, useRef } from 'react';
import { book, foundBook } from '../types/interfaces';
import { BookshelfRenderer, SpinePlacement } from '../utils/BookshelfRenderer';

interface ReorderableShelfProps {
  renderer: BookshelfRenderer,
  onDone: (b64ShelfImage: string) => void,
  onCancel: () => void,
}

interface DragState {
  book: foundBook | book,
  remaining: (foundBook | book)[], // the order without the dragged book
  placements: SpinePlacement[], // layout of `remaining`
  grabOffsetX: number,
  grabOffsetY: number,
}

export function ReorderableShelf({ renderer, onDone, onCancel }: ReorderableShelfProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const originalOrder = useRef([...renderer.books]);
  const drag = useRef<DragState | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const canvas = renderer.getCanvas();
    canvas.className = "display_shelf reorder_shelf";
    renderer.draw();
    hostRef.current?.appendChild(canvas);
    return () => {
      if (frame.current !== null) { cancelAnimationFrame(frame.current); }
      canvas.remove();
    };
  }, [renderer]);

  // converts a pointer event to canvas pixels (the canvas is scaled down by css)
  const toCanvasPoint = (e: React.PointerEvent) => {
    const canvas = renderer.getCanvas();
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // finds the index in `remaining` where the dragged book would be inserted for a pointer position
  const getInsertion = (state: DragState, x: number, y: number) => {
    const { placements, remaining } = state;
    if (placements.length === 0) { return { index: 0, markerX: 0, row: 0 }; }
    const rowCount = placements[placements.length - 1].row + 1;
    const row = renderer.getRowAtY(y, rowCount);
    const inRow = placements.filter(p => p.row === row);
    const next = inRow.find(p => x < p.x + p.width / 2);
    if (next !== undefined) {
      return { index: placements.indexOf(next), markerX: next.x, row };
    }
    const last = inRow[inRow.length - 1];
    return { index: Math.min(placements.indexOf(last) + 1, remaining.length), markerX: last.x + last.width, row };
  };

  const paintDrag = (x: number, y: number) => {
    const state = drag.current;
    if (state === null) { return; }
    const canvas = renderer.getCanvas();
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    renderer.draw(state.remaining);
    const { markerX, row } = getInsertion(state, x, y);
    const bounds = renderer.getRowBounds(row);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(markerX - 6, bounds.top, 12, bounds.bottom - bounds.top);
    const spine = renderer.getSpine(state.book);
    if (spine) {
      ctx.globalAlpha = 0.85;
      ctx.drawImage(spine.image, x - state.grabOffsetX, y - state.grabOffsetY, spine.width, spine.height);
      ctx.globalAlpha = 1;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { x, y } = toCanvasPoint(e);
    const placements = renderer.layout();
    const picked = placements.find(p => x >= p.x && x < p.x + p.width && y >= p.y && y < p.y + p.height);
    if (picked === undefined) { return; }
    e.currentTarget.setPointerCapture(e.pointerId);
    const remaining = renderer.books.filter(b => b !== picked.book);
    drag.current = {
      book: picked.book,
      remaining,
      placements: renderer.layout(remaining),
      grabOffsetX: x - picked.x,
      grabOffsetY: y - picked.y,
    };
    paintDrag(x, y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current === null) { return; }
    const { x, y } = toCanvasPoint(e);
    if (frame.current !== null) { cancelAnimationFrame(frame.current); }
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      paintDrag(x, y);
    });
  };

  const endDrag = (e: React.PointerEvent, commit: boolean) => {
    const state = drag.current;
    if (state === null) { return; }
    drag.current = null;
    if (frame.current !== null) { cancelAnimationFrame(frame.current); frame.current = null; }
    if (commit) {
      const { x, y } = toCanvasPoint(e);
      const { index } = getInsertion(state, x, y);
      const newOrder = [...state.remaining];
      newOrder.splice(index, 0, state.book);
      renderer.books = newOrder;
    }
    renderer.draw();
  };

  const cancel = () => {
    renderer.books = originalOrder.current;
    renderer.draw();
    onCancel();
  };

  return (
    <div>
      <div
        ref={hostRef}
        className="reorder_shelf_host"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, true)}
        onPointerCancel={(e) => endDrag(e, false)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="multiple_button_wrapper">
        <button className="bs_shelf_buttons" onClick={cancel}>Cancel</button>
        <button className="bs_shelf_buttons" onClick={() => onDone(renderer.toDataURL())}>Done</button>
      </div>
    </div>
  );
}
