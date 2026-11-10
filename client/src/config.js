// Change the store name here; it is used across the whole site.
export const BRAND_NAME = 'Myntra Clone';

export const NAV = [
  {
    key: 'men',
    label: 'Men',
    color: '#ee5f73',
    groups: [
      { title: 'Topwear', items: ['Shirts'] },
      { title: 'Footwear', items: ['Casual Shoes'] },
      { title: 'Accessories', items: ['Watches', 'Sunglasses'] },
    ],
  },
  {
    key: 'women',
    label: 'Women',
    color: '#fb56c1',
    groups: [
      { title: 'Western Wear', items: ['Dresses', 'Tops'] },
      { title: 'Footwear', items: ['Heels'] },
      { title: 'Jewellery & Accessories', items: ['Jewellery', 'Handbags', 'Watches'] },
    ],
  },
  {
    key: 'home',
    label: 'Home & Living',
    color: '#f2c210',
    groups: [
      { title: 'Decor', items: ['Home Decor'] },
      { title: 'Furniture', items: ['Furniture'] },
      { title: 'Kitchen & Table', items: ['Kitchen'] },
    ],
  },
  {
    key: 'beauty',
    label: 'Beauty',
    color: '#0db7af',
    groups: [
      { title: 'Makeup', items: ['Makeup'] },
      { title: 'Skincare', items: ['Skincare'] },
      { title: 'Fragrances', items: ['Fragrances'] },
    ],
  },
];

export const PRICE_RANGES = [
  ['0-999', 'Rs. 0 to Rs. 999'],
  ['1000-2999', 'Rs. 1000 to Rs. 2999'],
  ['3000-9999', 'Rs. 3000 to Rs. 9999'],
  ['10000-49999', 'Rs. 10000 to Rs. 49999'],
  ['50000-', 'Rs. 50000 and above'],
];

export const DISCOUNTS = [10, 20, 30, 40, 50, 60, 70];

export const SORT_OPTIONS = [
  ['recommended', 'Recommended'],
  ['new', "What's New"],
  ['popularity', 'Popularity'],
  ['discount', 'Better Discount'],
  ['price_desc', 'Price: High to Low'],
  ['price_asc', 'Price: Low to High'],
  ['rating', 'Customer Rating'],
];

export const COLOR_HEX = {
  Black: '#36454f',
  White: '#f0f0f0',
  Blue: '#0074d9',
  Red: '#d34b56',
  Green: '#5eb160',
  Pink: '#f1a9c4',
  Brown: '#915039',
  Grey: '#9fa8ab',
  Navy: '#3c4477',
  Beige: '#e8e6cf',
};
