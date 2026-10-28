- automatically edit uploaded spine images - user draws a simple rectangle around the spine image and the site properly crops, rotates, and adjusts the perspective so the uploaded image perfectly fits in an upright rectangle.
- only require the height of the image on upload - everything else can be calculated using an inch to pixel ratio on the image. That way the HxW ratio will exactly match the picture
- persist the chosen edition per user/shelf (selection is session-only right now and resets when the shelf is re-fetched, except right after uploading an alternative edition)
- allow user to reset password

- IF all goodreads shelves are always lowercase, just make all shelf name inputs all lowercase to prevent them from submitting the wrong shelf name
- fetch a list of all user's created shelves and provide them as options, rather than a text input field (not sure if possible)