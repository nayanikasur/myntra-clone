# Myntra Clone (MERN)

A fashion e-commerce site modelled on Myntra, built with MongoDB, Express, React and Node.

## Features
- Header with category mega-menus, search, profile dropdown, wishlist and bag counts
- Home page with hero carousel, deals, brands and shop-by-category tiles
- Product listing with filters (category, brand, price, colour, discount), sorting and pagination, all kept in the URL
- Product page with image gallery, size selection, add to bag / wishlist, pincode check and similar products
- Bag (change size/qty, move to wishlist), address + Cash on Delivery checkout, order confirmation
- Signup / login with JWT; orders history on the profile page

## Setup
Requires Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
npm run install-all           # install root, server and client deps
cp server/.env.example server/.env   # then edit MONGO_URI / JWT_SECRET if needed
npm run seed                  # load ~100 products into MongoDB
npm run dev                   # API on :5000, React on http://localhost:5173
```

Production: `npm run build && npm start` serves the built React app from Express on port 5000.

## Structure
```
server/   Express API (routes/, models/, middleware/), seed.js, data/products.json
client/   React + Vite app (pages/, components/, context/)
```

Product data and images come from [DummyJSON](https://dummyjson.com). `server/scripts/fetch-products.js` regenerates `server/data/products.json`.

The store name and logo are set in `client/src/config.js` and `client/src/components/Icons.jsx`.
