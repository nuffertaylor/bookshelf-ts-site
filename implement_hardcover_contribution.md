# Plan: Contribute spines through Hardcover search (frontend)

**Status:** Draft for review (2026-11-18). Companion plan: `../bookshelf/implement_hardcover_contribution.md` (backend). Read its sections 2, 3 and 11 first; this plan assumes the `POST /hardcover/search` contract defined there.
**Scope:** React/TypeScript changes in this repo. Replaces the Goodreads URL/ID modal (`FetchGoodreads`) on the Contribute page with a Hardcover search.

## 1. Goal

On Contribute, a signed-in user with a linked Hardcover account types into one search box. After they pause typing, matching books appear. They click one, and the existing `Upload` form opens prefilled with that book's data and its Hardcover id. If the results aren't specific enough, they type more into the same box.

## 2. Decisions

| Decision | Choice |
|---|---|
| Search box | One box. Debounced search ("lazy search"), 500 ms after the last keystroke. |
| Who can contribute | Signed in **and** Hardcover linked. Otherwise a prompt to link (no manual entry fallback). |
| Reconnect prompt | Only shown on Contribute, when the backend answers `hardcover_reauth_required`. |
| Results | Title, author, year. No covers. |
| `FetchGoodreads` | Mark deprecated, stop rendering it, keep the file. |
| After reconnecting | Land back on Contribute (new return target), not on Create or Profile. |

## 3. Backend contract (see the backend plan)

`POST hardcover/search` with `{username, authtoken, query}` returns, on 200:

```
{ results: [{ hardcover_book_id: number, title, subtitle, author, pubDate, isbn, isbn13, already_uploaded: boolean }] }
```

Errors: `400` bad query, `403` session expired, `401 {error: "hardcover_reauth_required"}` reconnect Hardcover, `429` rate limited, `502` Hardcover unreachable. The response goes through `sendPostRequestToServer`, which wraps it as `{statusCode, body}`, like the shelf calls.

## 4. Phase 1: API helper (`src/utils/hardcover.ts`)

- Add `hardcoverSearchResult` and `hardcoverSearchOutcome` types: `{kind: "ok", results} | {kind: "needs_connect"} | {kind: "session_expired"} | {kind: "error", message}`.
- Add `searchHardcoverBooks(query, callback)`, a POST to `hardcover/search` with `username` and `authtoken` from cookies. Reuse `parseApiResponse` and `libraryFailure`, which already map `401 hardcover_reauth_required` to `needs_connect`, 403 to `session_expired`, and 429 to the rate-limit message. Treat a malformed 200 body as an error and not a crash.
- Extend `HardcoverReturn` with `"contribute"`.

## 5. Phase 2: Search component (`src/pages/HardcoverBookSearch.tsx`)

State: `signin`, `connect`, `idle`, `searching`, `results`, `empty`, `error`.

- On mount: if there's no `authtoken` cookie, show the existing sign-in prompt. Contribute is already gated by `NeedAuthentication` in `App.tsx`, so this is a safeguard. If there's no `hardcover_username` cookie, show **"Link Hardcover to contribute"** with a Connect button that calls `startHardcoverAuth("link", "contribute")`, reusing the style of `HardcoverShelfPicker`'s `connect` state.
- Input behavior:
  - Search 500 ms after the last keystroke (`useEffect` with a timeout cleared on each change and on unmount).
  - Minimum 3 characters after trimming. Below that, show the idle hint and cancel any pending search.
  - Enter and a visible Search button run the search immediately.
  - Don't re-run a query identical to the last one. Keep a small in-memory cache (about 20 queries) so backspacing doesn't spend more requests.
  - **Ignore stale responses.** Tag every request with an incrementing id and drop any response that isn't the latest. The helper can't cancel requests, so this prevents out-of-order results.
- Results list: a row per result showing title (subtitle muted), author, and year. A row with `already_uploaded` shows a "You've uploaded this" tag and still opens Upload, which handles replacing an existing spine. Keyboard: arrow keys and Enter on a row, `button` elements so they're focusable.
- Messages:
  - `empty`: "No matches. Try adding the author or more of the title."
  - `needs_connect`: "Your Hardcover connection needs to be refreshed to search." with a Connect Hardcover button (`startHardcoverAuth("link", "contribute")`).
  - `session_expired`: the existing "Your session expired. Please log in again." text.
  - Rate limited (429): show the message, stop auto-searching for 15 seconds, and leave Enter available.
  - Other errors: the message plus a Try Again button.
- Picking a result opens `Upload` with `prefill = {book_id: "", hardcover_book_id, title, author, pubDate, isbn, isbn13}` and an `originCallback` that returns to the search with the **same query and results** (pass an `initialQuery` prop and re-search, using the cache).
  - `Upload` already treats `!book_id && hardcover_book_id` as Hardcover-only (`hardcoverOnly`), so it posts `hardcover_book_id` and skips the Goodreads id validation. Verify the prefilled title, author, year and ISBN fields show correctly.
  - Prefilled fields are disabled in `Upload` (existing behavior for prefill). Users can't edit Hardcover's title or author. That's intended for v1.

## 6. Phase 3: Wire up Contribute and return flow

- `App.tsx` (the `/contribute` branch around line 74): render `HardcoverBookSearch` in place of `FetchGoodreads`. Remove the `FetchGoodreads` import.
- `HardcoverCallback.tsx` (return handling around line 80): when `pending.returnTo === "contribute"`, render `HardcoverBookSearch` after a successful link or login.
- `NeedAuthentication.tsx`: its "sign in with hardcover" currently returns to `create`. If it was opened from Contribute, return to `contribute` instead. Pass a prop or return target. This also means a brand-new user ends up on the search with Hardcover already linked.
- Profile's "Link Hardcover" button keeps returning to `profile`.

## 7. Phase 4: Deprecate the Goodreads modal

- In `FetchGoodreads.tsx`, replace the TODO with a `@deprecated` note: replaced by `HardcoverBookSearch`, and the `getgrbookdetails` backend route is removed. Keep the code, with no imports or renders.
- Search the pages for Goodreads wording that describes contributing a spine (`HowTo.tsx`, `Faq.tsx`, `About.tsx`, `Landing.tsx`) and update it to describe the Hardcover search. Leave wording about the CSV import and shelf generation alone.
- Leave the Profile Goodreads id field and CSV import as they are.

## 8. Testing

The repo has Jest with React Testing Library and `user-event` already set up (`react-scripts test`) and tests under `src/tests/`.

**Rule:** every phase ships with its own tests, and a phase isn't done until its tests and the full existing suite pass. At the end of each phase run `CI=true npm test` and `npm run build` (type checking). Don't start the next phase on a red suite or a failing build.

### 8.1 Tests written inside each phase

| Phase | Tests |
|---|---|
| 1 (helper) | `src/tests/hardcoverSearch.test.ts`: `searchHardcoverBooks` maps 200, `401 hardcover_reauth_required`, 403, 429, 502 and malformed bodies (non-JSON, missing `results`) to the right outcomes. |
| 2 (component) | `src/tests/HardcoverBookSearch.test.tsx` with fake timers and a mocked helper: no search below 3 characters; one search 500 ms after the last keystroke, and rapid typing fires once; Enter and the Search button search immediately; a stale response arriving after a newer one is ignored; the cache serves a repeat query without a request; the signin, link-prompt, needs-connect, empty, error and rate-limit states render; the 15-second pause after a 429; picking a result opens `Upload` with the right prefill (`hardcover_book_id`, empty `book_id`); `originCallback` returns to the search with the same query. |
| 3 (wiring) | Tests that `returnTo: "contribute"` round-trips through `startHardcoverAuth`, `takePendingHardcoverAuth` and `HardcoverCallback`, and that `/contribute` renders `HardcoverBookSearch` for a signed-in user and `NeedAuthentication` otherwise. |
| 4 (deprecation) | A test or grep check that nothing imports `FetchGoodreads` anymore. |

### 8.2 Phase 5: Integration and regression testing

Run after Phases 1 to 4 are done, before merging. Use the backend running locally (see backend plan section 10.2) and the real Hardcover API.

1. **End to end.** Sign in, open Contribute, type a title, wait for results, pick one, fill in the dimensions, upload a spine, then confirm the spine appears on a generated shelf.
2. **Contract check.** Compare a real search response with section 3 of this plan.
3. **Regression checklist** (everything we touched):
   - [ ] Create page: Hardcover shelf picker and the CSV import still work.
   - [ ] Profile: Link and Reconnect Hardcover still return to Profile.
   - [ ] Login with Hardcover from the NeedAuthentication screen still works from Create, and returns to Contribute when started from Contribute.
   - [ ] Uploading a spine for an unfound book from a Found screen still works (it shares `Upload`).
   - [ ] Existing Goodreads-based spines still display and can be replaced.
4. **Browser checks:** dark and light schemes, a narrow (mobile) width, keyboard-only use (tab to results, arrow keys, Enter), and the network tab (no request per keystroke, no out-of-order results).

### 8.3 Pre-merge gate (merging to master deploys the site)

- [ ] `CI=true npm test` passes with no skipped or newly failing tests, and `npm run build` is clean.
- [ ] Sections 8.2 and 9 are checked off.
- [ ] The backend is already deployed with `/hardcover/search` live (section 10 of this plan), and the contract check is done.

## 9. Manual verification

- [ ] Real flow with a linked account: search "project hail mary", pick the real book, upload a spine, and check it appears on the shelf.
- [ ] A book on none of the user's shelves works.
- [ ] A user without Hardcover linked sees the link prompt; after linking they land back on Contribute.
- [ ] A user whose connection predates the scope change sees the reconnect prompt, and search works afterwards.
- [ ] A book the user already uploaded shows the tag, and re-uploading replaces rather than duplicates.
- [ ] Typing fast doesn't fire a request per keystroke (check the network tab) and doesn't show results out of order.
- [ ] Dark and light color schemes look right.

## 10. Rollout

Ship after the backend (backend plan section 11). The frontend must not go live before `/hardcover/search` is deployed. Once it's live, the backend can remove `/getgrbookdetails`.

## 11. Open items

- The "single box" ranking issue (author text in the query can bury the real book) is being tuned on the backend. If the backend can't fix it, consider a hint under the box ("Tip: the title alone usually works best") or an optional author field.
- Prefilled Upload fields are read-only. If users find wrong Hardcover metadata (typos, a different edition's year), we may want to allow editing. Not in v1.
