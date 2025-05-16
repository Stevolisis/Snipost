// src/components/appComponents/Search.jsx
"use client"
import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSearchQuery, searchStart, searchSuccess, searchFailure } from '@/lib/redux/slices/search';
import api from '@/utils/axiosConfig';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

const SearchComponent = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query, results, isLoading } = useAppSelector((state) => state.search);
  const searchRef = useRef(null);
  const timeoutRef = useRef();

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      dispatch(searchSuccess([]));
      return;
    }

    try {
      dispatch(searchStart());
      const response = await api.get(`/search-snippets?q=${encodeURIComponent(searchTerm)}`);
      dispatch(searchSuccess(response.data.snippets || []));
    } catch (error) {
      console.error('Search failed:', error);
      dispatch(searchFailure(error.message));
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCommandInputChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      dispatch(setSearchQuery(''));
    }
  };

  const handleResultClick = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="flex-1 max-w-md mx-6 relative">
      <form onSubmit={handleSearchSubmit}>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={searchRef}
                placeholder="Search snippets..."
                className="pl-10"
                value={query}
                onChange={handleSearchChange}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
            sideOffset={8}
          >
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Search snippets..." 
                value={query} 
                onValueChange={handleCommandInputChange} 
              />
              <CommandList>
                {isLoading ? (
                  <CommandEmpty>Searching...</CommandEmpty>
                ) : results.length > 0 ? (
                  <CommandGroup className="w-full">
                    {results.map((snippet) => (
                      <CommandItem 
                        key={snippet._id}
                        value={snippet._id}
                        className="cursor-pointer"
                      >
                        <Link 
                          href={`/snippet/${snippet._id}`}
                          onClick={handleResultClick}
                        >
                          <div className="w-full">
                            <div className="font-medium line-clamp-1">{snippet.title}</div>
                            <div className="text-sm text-muted-foreground truncate line-clamp-1">
                              {snippet.description || 'No description'}
                            </div>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {snippet.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>
                    {query.trim() ? 'No results found' : 'Start typing to search'}
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};

export default SearchComponent;