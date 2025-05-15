import { useCategory } from "./Api.jsx";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Category = () => {
    const { slug } = useParams();
    const { data: category, isLoading, isError } = useCategory(slug);

    // ─── Hooks (always at the top) ─────────────────────
    const [hoveredSlug, setHoveredSlug] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);

    // We can safely dereference category?.items here
    const items = category?.items ?? [];

    useEffect(() => {
        if (items.length > 0) {
            setCurrentItem(items[0]);
        }
    }, [items]);

    // ─── Early returns (after all hooks) ────────────────
    if (isLoading)  return <p>Loading…</p>;
    if (isError)    return <p>Failed to load category.</p>;
    if (!category)  return <p>No category data.</p>;

    // ─── Main render ────────────────────────────────────
    return (
        <>
            <h2>Category: {category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => {
                    const isHovered = hoveredSlug === item.slug;
                    const imgs      = item.images ?? [];
                    const src       = imgs.length > 1
                        ? (isHovered ? imgs[1].url : imgs[0].url)
                        : (imgs[0]?.url ?? "");

                    return (
                        <div
                            key={item.slug}
                            className="bg-white rounded shadow text-center"
                            onMouseEnter={() => setHoveredSlug(item.slug)}
                            onMouseLeave={() => setHoveredSlug(null)}
                        >
                            <img
                                src={src}
                                alt={item.product_name}
                                className="w-full h-auto object-cover"
                            />
                            <h3 className="mt-2 text-lg font-semibold">
                                {item.product_name}
                            </h3>
                            {item.price && <p className="text-gray-600">${item.price}</p>}
                            <ul className="flex justify-center space-x-2 mt-2">
                                {item.colors.map((color, idx) => (
                                    <li
                                        key={`${item.slug}-${idx}`}
                                        className="w-6 h-6 inline-block rounded-full border border-gray-200"
                                        style={{ backgroundColor: `#${color.hex_code}` }}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Category;
