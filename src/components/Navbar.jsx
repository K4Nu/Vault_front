import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
    const productsApi = import.meta.env.VITE_search_Api_URL;
    const productFullSearchApi=import.meta.env.VITE_full_search_Api_URL;
    const navigate=useNavigate();
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
                <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => navigate(`/search?q=${searchValue}`)}
                />
                {/* Suggestions List */}
                {searchDebounce && (
                    <>{Array.isArray(data) && data.length > 0 && !isLoading && !error && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border rounded shadow">
                            <ul>
                                {data.map((item, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => navigate(`/search?q=${encodeURIComponent(searchValue)}`)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;