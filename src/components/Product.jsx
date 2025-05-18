import {useParams,Navigate} from "react-router-dom";
import {useEffect,useState} from "react";
import {useProduct} from "./Api.jsx";

const Product = () => {
    const {slug}=useParams();
    const { data: product, isLoading, isError } = useProduct(slug);
    


    if (isLoading)  return <p>Loading…</p>;
    if (isError)    return <p>Failed to load category.</p>;
    if (!product)  return <p>No product data.</p>;
    console.log(product);
    return(
        <>
            <p>
                {slug}
            </p>
        </>
    )
}
export default Product;