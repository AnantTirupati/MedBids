import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({ onSearch, onChange, className, placeholder = "Search...", ...props }: SearchInputProps) {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (onChange) onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        icon={<Search className="w-4 h-4 text-on-surface-variant" />}
        className="h-10 pl-10"
        {...props}
      />
    </div>
  );
}

export default SearchInput;
