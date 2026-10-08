import { useState } from "react";

function SearchBar({ onSearch }) {
const [search, setSearch] = useState("");
const [category, setCategory] = useState("");

const handleSubmit = (e) => {
e.preventDefault();


onSearch(search, category);


};

return ( <form className="search-bar" onSubmit={handleSubmit}>
<input
type="text"
placeholder="Search products..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>


  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">All Categories</option>
    <option value="Books">Books</option>
    <option value="Electronics">Electronics</option>
    <option value="Clothing">Clothing</option>
    <option value="Home">Home</option>
  </select>

  <button type="submit">Search</button>
</form>


);
}

export default SearchBar;
