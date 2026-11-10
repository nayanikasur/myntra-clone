import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { CloseIcon, FilterIcon } from '../components/Icons';
import { COLOR_HEX, DISCOUNTS, NAV, PRICE_RANGES, SORT_OPTIONS } from '../config';

const MULTI = ['category', 'brand', 'price', 'color'];

export default function ProductList() {
  const { gender } = useParams();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const q = params.get('q') || '';
  const section = NAV.find((n) => n.key === gender);

  const query = new URLSearchParams(params);
  if (gender) query.set('gender', gender);
  const queryString = query.toString();

  useEffect(() => {
    setError('');
    api(`/products?${queryString}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [queryString]);

  const selected = (key) => (params.get(key) ? params.get(key).split(',') : []);

  const update = (mutate) => {
    const next = new URLSearchParams(params);
    mutate(next);
    next.delete('page');
    setParams(next);
  };

  const toggle = (key, value) =>
    update((next) => {
      const cur = selected(key);
      const vals = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      vals.length ? next.set(key, vals.join(',')) : next.delete(key);
    });

  const clearAll = () => update((next) => [...MULTI, 'discount'].forEach((k) => next.delete(k)));

  const chips = [
    ...MULTI.flatMap((key) =>
      selected(key).map((v) => ({ key, value: v, label: key === 'price' ? PRICE_RANGES.find(([r]) => r === v)?.[1] || v : v }))
    ),
    ...(params.get('discount') ? [{ key: 'discount', value: params.get('discount'), label: `${params.get('discount')}% and above` }] : []),
  ];

  const title = section ? `${section.label} Clothing & Accessories` : q ? `Search results for “${q}”` : 'All Products';
  const facets = data?.facets;
  const brands = (facets?.brands || []).filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()));

  return (
    <div className="plp">
      <div className="plp-top">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <span>{section ? section.label : 'Search'}</span>
        </div>
        <h1 className="plp-title">
          {title} <span>- {data ? data.total : '…'} items</span>
        </h1>
      </div>

      <div className="plp-bar">
        <div className="plp-bar-left">
          <span className="filters-heading">FILTERS</span>
          {chips.length > 0 && (
            <button type="button" className="link-btn" onClick={clearAll}>
              CLEAR ALL
            </button>
          )}
        </div>
        <div className="chips">
          {chips.map((c) => (
            <button
              type="button"
              key={`${c.key}-${c.value}`}
              className="chip"
              onClick={() => (c.key === 'discount' ? update((n) => n.delete('discount')) : toggle(c.key, c.value))}
            >
              {c.label} <CloseIcon width="10" height="10" />
            </button>
          ))}
        </div>
        <button type="button" className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
          <FilterIcon /> Filter
        </button>
        <label className="sort-select">
          Sort by :
          <select value={params.get('sort') || 'recommended'} onChange={(e) => update((n) => n.set('sort', e.target.value))}>
            {SORT_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="plp-body">
        <aside className={`filters ${showFilters ? 'open' : ''}`}>
          <div className="filters-mobile-head">
            <strong>FILTERS</strong>
            <button type="button" onClick={() => setShowFilters(false)} aria-label="Close filters">
              <CloseIcon />
            </button>
          </div>

          <FilterSection title="CATEGORIES">
            {facets?.categories.map((c) => (
              <Check key={c.name} label={c.name} count={c.count} checked={selected('category').includes(c.name)} onChange={() => toggle('category', c.name)} />
            ))}
          </FilterSection>

          <FilterSection title="BRAND">
            <input className="brand-search" placeholder="Search for Brand" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} />
            <div className="scroll-list">
              {brands.map((b) => (
                <Check key={b.name} label={b.name} count={b.count} checked={selected('brand').includes(b.name)} onChange={() => toggle('brand', b.name)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="PRICE">
            {PRICE_RANGES.map(([v, l]) => (
              <Check key={v} label={l} checked={selected('price').includes(v)} onChange={() => toggle('price', v)} />
            ))}
          </FilterSection>

          <FilterSection title="COLOR">
            {facets?.colors.map((c) => (
              <Check
                key={c.name}
                label={
                  <>
                    <i className="swatch" style={{ background: COLOR_HEX[c.name] || '#ccc' }} /> {c.name}
                  </>
                }
                count={c.count}
                checked={selected('color').includes(c.name)}
                onChange={() => toggle('color', c.name)}
              />
            ))}
          </FilterSection>

          <FilterSection title="DISCOUNT RANGE">
            {DISCOUNTS.map((d) => (
              <label key={d} className="filter-option">
                <input
                  type="radio"
                  name="discount"
                  checked={params.get('discount') === String(d)}
                  onChange={() => update((n) => n.set('discount', String(d)))}
                />
                {d}% and above
              </label>
            ))}
          </FilterSection>

          <button type="button" className="btn btn-primary filters-apply" onClick={() => setShowFilters(false)}>
            APPLY
          </button>
        </aside>

        <section className="plp-results">
          {error && <p className="error-text">{error}</p>}
          {!data && !error && <div className="page-loader" />}
          {data && data.products.length === 0 && (
            <div className="empty-state">
              <h3>We couldn't find any matches!</h3>
              <p>Please check the spelling or try searching something else</p>
            </div>
          )}
          <ul className="product-grid">
            {data?.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </ul>
          {data && data.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === data.page ? 'active' : ''}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.set('page', String(n));
                    setParams(next);
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="filter-section">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Check({ label, count, checked, onChange }) {
  return (
    <label className="filter-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
      {count != null && <span className="count">({count})</span>}
    </label>
  );
}
