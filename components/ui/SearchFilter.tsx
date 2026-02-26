'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FilterOption = {
    label: string;
    value: string;
};

type SearchFilterProps = {
    placeholder?: string;
    filters?: {
        name: string;
        options: FilterOption[];
    }[];
};

export function SearchFilter({ placeholder = "Search...", filters = [] }: SearchFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([name, value]) => {
                if (value === null || value === '') {
                    newParams.delete(name);
                } else {
                    newParams.set(name, value);
                }
            });

            return newParams.toString();
        },
        [searchParams]
    );

    const handleSearch = (term: string) => {
        startTransition(() => {
            const query = createQueryString({ q: term });
            router.push(`${pathname}?${query}`);
        });
    };

    const handleFilterChange = (name: string, value: string) => {
        startTransition(() => {
            const query = createQueryString({ [name]: value });
            router.push(`${pathname}?${query}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            router.push(pathname);
        });
    };

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={placeholder}
                    className="pl-10"
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={(e) => {
                        // Debounce would be better, but for simplicity we'll use transition
                        handleSearch(e.target.value);
                    }}
                />
                {isPending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground animate-pulse">
                        Searching...
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                    <select
                        key={filter.name}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                        value={searchParams.get(filter.name) || ''}
                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    >
                        <option value="">{filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}</option>
                        {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ))}

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-10 px-2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
