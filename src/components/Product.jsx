import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "./Api.jsx";
import { useEffect, useState } from "react";

const ProductCarousel = () => {
    const { slug } = useParams();
    const { data: product, isLoading, isError } = useProduct(slug);
    const [currIndex, setCurrIndex] = useState(0);
    const [currentImage, setCurrentImage] = useState('');
    const navigate = useNavigate();
    const [currentColor, setcurrentColor] = useState("");

    useEffect(() => {
        if (product?.images?.length) {
            setCurrentImage(product.images[0].url);
        }
        if (product?.colors?.length) {
            setcurrentColor(product.colors[0].name);
        }
    }, [product]);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !product?.images?.length) return <div>Error loading product images.</div>;

    const currProduct = {
        name: product.colors[0].name,
        image: product.images[0]?.url || null,
    };

    const relatedProducts = product.related_items.map(item => ({
        name: item.color.name,
        image: item.img.url,
        slug: item.slug,
        color: item.color.name,
    }));

    const showImgs = [currProduct, ...relatedProducts];

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-6xl mx-auto">
            {/* Image + Thumbnails */}
            <div className="flex flex-col items-center justify-center">
                <img
                    src={
                        currentImage === product.images[0].url
                            ? product.images[currIndex].url
                            : currentImage
                    }
                    alt={`Product image ${currIndex}`}
                    className="aspect-[2/3] w-full max-w-[500px] object-cover"
                />
                <ul className="flex gap-2 mt-4 overflow-x-auto">
                    {product.images.map((image, index) => (
                        <li
                            key={index}
                            onMouseEnter={() => setCurrIndex(index)}
                            className={`cursor-pointer border-2 rounded transition ${
                                currIndex === index ? "border-blue-500" : "border-transparent"
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={`Thumbnail ${index}`}
                                className="w-16 h-16 object-cover rounded"
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4">{product.product_name}</h2>
                <h2 className='text-2xl font-bold mb-4'>{product.price}$</h2>
                <h2>Color: {currentColor}</h2>
                <div className="flex gap-2 mt-4">
                    {showImgs.map((p, index) => {
                        return (
                            <img
                                key={index}
                                src={p.image}
                                alt={`Variant ${p.name}`}
                                title={p.name}
                                onMouseEnter={() => {
                                    setCurrentImage(p.image);
                                    setcurrentColor(p.color);
                                }}
                                onMouseLeave={() => {
                                    setCurrentImage(product.images[0].url);
                                    setcurrentColor(product.colors[0].name);
                                }}
                                onClick={() => navigate(`/${p.slug}`)}
                                style={{ cursor: 'pointer' }}
                                className={`w-24 h-24 object-cover border rounded cursor-pointer transition ${
                                    currentImage === p.image ? "border-blue-500" : "border-gray-300"
                                }`}
                            />
                        );
                    })}
                </div>

                {/* Size + Info Grid */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                    {product.variants.map((variant, index) => (
                        <div key={index} className="relative">
                            <div
                                className={`border rounded px-4 py-2 text-center ${
                                    variant.quantity === 0
                                        ? "text-gray-400 border-gray-300"
                                        : "hover:border-blue-500 cursor-pointer"
                                }`}
                            >
                                {variant.size.name}
                            </div>
                            {variant.quantity === 0 && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="w-full h-full relative">
                                        <div className="absolute w-[2px] h-full bg-gray-400 rotate-45 left-1/2 top-0 -translate-x-1/2"></div>
                                        <div className="absolute w-[2px] h-full bg-gray-400 -rotate-45 left-1/2 top-0 -translate-x-1/2"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Description fills row */}
                    <div className="col-span-3 text-sm text-gray-700 mt-2">
                        <p><strong>Description:</strong> {product.description}</p>
                    </div>

                    {/* Care Instructions fills row */}
                    <div className="col-span-3 text-sm text-gray-700">
                        <p><strong>Care Instructions:</strong> {product.care_instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;
