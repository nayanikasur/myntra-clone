// One-off: pulls fashion products from DummyJSON and writes server/data/products.json
const fs = require('fs');
const path = require('path');

const MAP = [
  ['mens-shirts', 'men', 'Shirts'],
  ['mens-shoes', 'men', 'Casual Shoes'],
  ['mens-watches', 'men', 'Watches'],
  ['sunglasses', 'men', 'Sunglasses'],
  ['womens-dresses', 'women', 'Dresses'],
  ['tops', 'women', 'Tops'],
  ['womens-shoes', 'women', 'Heels'],
  ['womens-bags', 'women', 'Handbags'],
  ['womens-jewellery', 'women', 'Jewellery'],
  ['womens-watches', 'women', 'Watches'],
  ['beauty', 'beauty', 'Makeup'],
  ['fragrances', 'beauty', 'Fragrances'],
  ['skin-care', 'beauty', 'Skincare'],
  ['home-decoration', 'home', 'Home Decor'],
  ['furniture', 'home', 'Furniture'],
  ['kitchen-accessories', 'home', 'Kitchen'],
];
const FALLBACK_BRANDS = ['Roadster', 'HERE&NOW', 'Mast & Harbour', 'DressBerry', 'Anouk', 'HRX'];
const SIZES = {
  Shirts: ['S', 'M', 'L', 'XL', 'XXL'],
  Tops: ['XS', 'S', 'M', 'L', 'XL'],
  Dresses: ['XS', 'S', 'M', 'L', 'XL'],
  'Casual Shoes': ['6', '7', '8', '9', '10', '11'],
  Heels: ['3', '4', '5', '6', '7', '8'],
};
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Pink', 'Brown', 'Grey', 'Navy', 'Beige'];

(async () => {
  const out = [];
  for (const [slug, gender, category] of MAP) {
    const res = await fetch(`https://dummyjson.com/products/category/${slug}?limit=0`);
    const { products } = await res.json();
    products.forEach((p, i) => {
      const price = Math.round((p.price * 85) / 10) * 10 - 1;
      const discount = Math.max(10, Math.min(70, Math.round(p.discountPercentage * 3)));
      out.push({
        title: p.title,
        description: p.description,
        brand: p.brand || FALLBACK_BRANDS[(out.length + i) % FALLBACK_BRANDS.length],
        gender,
        category,
        price: Math.max(price, 199),
        mrp: Math.round(Math.max(price, 199) / (1 - discount / 100)),
        discount,
        rating: Math.round(p.rating * 10) / 10,
        ratingCount: (p.reviews?.length || 1) * 317 + i * 41,
        sizes: SIZES[category] || ['Onesize'],
        color: COLORS[(out.length * 7) % COLORS.length],
        images: p.images,
        thumbnail: p.thumbnail,
        stock: p.stock,
      });
    });
  }
  const file = path.join(__dirname, '..', 'data', 'products.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} products to ${file}`);
})();
