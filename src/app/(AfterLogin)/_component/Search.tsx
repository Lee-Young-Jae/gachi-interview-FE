import { CiSearch } from "react-icons/ci";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import debounce from "../_lib/debounce";
interface SearchProps {
  setKeyword: (keyword: string) => void;
  keyword: string;
}

const Search = memo(({ setKeyword, keyword }: SearchProps) => {
  const [inputValue, setInputValue] = useState<string>(keyword);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  return (
    <div className="relative flex items-center w-full">
      <CiSearch className="absolute left-3 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder="검색어를 입력하세요"
        className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
});

export default Search;
