import { useCategory, fetchSearchProducts } from "./Api.jsx";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";

const Category = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate();
    const [hoveredSlug, setHoveredSlug] = useState(null);

    // Always call both hooks, but conditionally enable them
    const categoryQuery = useCategory(slug, { enabled: !query });
    const searchQuery = useSearchProducts(query || "", { enabled: !!query });

    // Determine which query result to use
    const activeQuery = query ? searchQuery : categoryQuery;
    const { data, isLoading, isError } = activeQuery;

    // Extract items and title based on data structure
    let items = [];
    let title = "";

    if (query) {
        // Search mode - assuming searchProducts returns { products: [...] } or just [...]
        items = Array.isArray(data) ? data : (data?.products ?? []);
        title = `Search results for "${query}"`;
    } else {
        // Category mode - assuming useCategory returns { name: "...", items: [...] }
        items = data?.items ?? [];
        title = `Category: ${data?.name ?? 'Unknown'}`;
    }

    if (isLoading) return <p>Loading…</p>;
    if (isError) return <p>Failed to load {query ? 'search results' : 'category'}.</p>;
    if (!data || items.length === 0) {
        return <p>No {query ? 'search results found' : 'items in this category'}.</p>;
    }

    // Group all items by product name
    const groupedProducts = items.reduce((acc, item) => {
        if (!acc[item.product_name]) acc[item.product_name] = [];
        acc[item.product_name].push(item);
        return acc;
    }, {});

    return (
        <>
            <Navbar/>
            <h2>{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => {
                    const isHovered = hoveredSlug === item.slug;
                    const imgs = item.images ?? [];
                    const src = imgs.length > 1
                        ? (isHovered ? imgs[0].url : imgs[1].url)
                        : (imgs[0]?.url ?? "");

                    // Find all variants of this product
                    const variants = groupedProducts[item.product_name] ?? [];

                    return (
                        <div
                            key={item.slug}
                            className="bg-white rounded shadow text-center"
                        >
                            <img
                                src={src}
                                onMouseEnter={() => setHoveredSlug(item.slug)}
                                onMouseLeave={() => setHoveredSlug(null)}
                                onClick={() => navigate(`/${item.slug}`)}
                                style={{ cursor: 'pointer' }}
                                alt={item.product_name}
                                className="w-full h-auto object-cover"
                            />
                            <h3 className="mt-2 text-lg font-semibold">
                                {item.product_name}
                            </h3>
                            {item.price && <p className="text-gray-600">${item.price}</p>}
                            {item.colors && item.colors.length > 0 && (
                                <ul className="flex justify-center space-x-2 mt-2">
                                    {item.colors.map((color) => {
                                        // Find variant where this color is the FIRST (main) color
                                        const targetVariant = variants.find(
                                            v =>
                                                v.slug !== item.slug &&
                                                v.colors?.length > 0 &&
                                                v.colors[0].id === color.id
                                        );

                                        return (
                                            <li
                                                key={`${item.slug}-${color.id}`}
                                                onClick={() => {
                                                    if (targetVariant) {
                                                        navigate(`/${targetVariant.slug}`);
                                                    }
                                                }}
                                                className="w-6 h-6 inline-block rounded-full border border-gray-200 cursor-pointer"
                                                style={{ backgroundColor: `#${color.hex_code}` }}
                                            />
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Category;