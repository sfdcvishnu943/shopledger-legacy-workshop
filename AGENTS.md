# Repository Guidelines

## Stack

ShopLedger runs on Node.js with CommonJS, Express 4, and body-parser. The browser UI uses plain HTML, CSS, and JavaScript. The application persists records in a JSON file.

## Module Map

- `server.js` starts Express, serves the UI, mounts API routes, and exposes the printable invoice.
- `routes/` handles product, order, customer, and report requests.
- `lib/` contains business logic for pricing, GST, coupons, inventory, orders, invoices, reports, and the khata ledger. `lib/store.js` handles persistence in `data/db.json`.
- `public/` contains the UI. `config.js` holds shop settings and the default port.

## Commands

- `npm install` installs the existing dependencies.
- `npm start` runs the app at `http://localhost:3000` by default. Set `PORT` to override the port.
- `node --check lib/orders.js` checks JavaScript syntax. Substitute the file you changed.
- `npm test` is a placeholder that exits with an error.

## Rules

- Write characterization tests before changing behaviour. Capture the current behaviour of the affected module first.
- Change only the module the ticket is about.
- Tests must never read or write the repository's `data/db.json`. Use in-memory fixtures or isolated temporary files.
- Add no dependencies.
