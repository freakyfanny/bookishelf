interface SearchFilterProps {
    searchFilterValue: string;
    handleFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchFilterValue, handleFilterChange }) => {
    return (
      <div className="flex flex-col gap-2">
      <label htmlFor="search-filter" className="text-black font-semibold">
        Choose a search category
      </label>
      <select
        id="search-filter"
        value={searchFilterValue}
        onChange={handleFilterChange}
        className="bg-white text-sm text-black px-4 py-2 rounded-md border border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-900"
      >
        <option value="books">Search for Books</option>
        <option value="authors">Search for Authors</option>
      </select>
    </div>
    );
};

export default SearchFilter;