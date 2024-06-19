import { CiSearch } from "react-icons/ci";
import { memo, useCallback, useEffect, useState } from "react";
import debounce from "../_lib/debounce";
interface SearchProps {
  setKeyword: (keyword: string) => void;
  keyword: string;
}

const Search = memo(({ setKeyword, keyword }: SearchProps) => {
  const [inputValue, setInputValue] = useState<string>(keyword);

  const debouncedSetKeyword = useCallback(
    debounce((value: string) => {
      setKeyword(value);
    }, 500),
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetKeyword(value);
  };

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  return (
    <div className="relative flex items-center w-full">
      <CiSearch className="absolute left-3 text-muted-foreground" />
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
});

Search.displayName = "SearchComponent";

export default Search;
