import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const Navbar = () => {
    const productsApi = import.meta.env.VITE_search_Api_URL;

    const [searchValue, setSearchValue] = useState("");
    const [searchDebounce, setSearchDebounce] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchDebounce(searchValue);
        }, 400);
        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["searchResults", searchDebounce],
        queryFn: async () => {
            const res = await fetch(`${productsApi}?q=${searchDebounce}`);
            if (!res.ok) {
                throw new Error("Failed to fetch products.");
            }
            return await res.json();
        },
        enabled: !!searchDebounce,
    });

    console.log(data);

    return (
        <nav className="navbar navbar-expand-lg bg-dark text-black relative px-4 py-3 bg-gray-600">
            {/* Logo */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <h1 className="text-xl font-bold">Vault77</h1>
            </div>

            {/* Search */}
            <div className="mx-auto w-full max-w-md relative">
                <input
                    type="search"
                    placeholder="Search by Vault77"
                    className="w-full px-4 py-2 rounded-md text-black"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                {/* Suggestions List */}
                {searchDebounce && (
                    <>
                        {isLoading && (
                            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow p-4">
                                <p className="text-gray-600">Loading...</p>
                            </div>
                        )}

                        {error && (
                            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow p-4">
                                <p className="text-red-500">Error loading suggestions</p>
                            </div>
                        )}

                        {data?.results && data.results.length > 0 && !isLoading && !error && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                                {data.results.map((item, index) => (
                                    <li
                                        key={item.slug || index}  // Better to use slug as key since it's unique
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {item.product_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;