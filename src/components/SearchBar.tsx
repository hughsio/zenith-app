import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}
export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          id="search-bar-input"
          type="search"
          placeholder="Search for an item across all bins..."
          className="w-full pl-10 pr-24 h-12 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
        </Button>
      </div>
    </form>
  );
}