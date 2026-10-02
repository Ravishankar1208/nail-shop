import './component.css';

function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <label className="search-bar" aria-label="Search products">
      <span className="search-icon">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export default SearchBar;
