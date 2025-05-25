import {useQuery} from "@tanstack/react-query";
const productsApi = import.meta.env.VITE_productsApi_URL;
const categoriesApi=import.meta.env.VITE_categoriesApi_URL;
const fetchProducts = async() => {
    const res = await fetch(`${productsApi}/`);
    if(!res.ok) {
        throw new Error(`Failed to fetch product ${res.status}`);
    }
    const data=await res.json();
    return data
}

const fetchProduct = async(slug) => {
    const res = await fetch(`${productsApi}/${slug}`);
    if(!res.ok) {
        throw new Error(`Failed to fetch product ${res.status}`);
    }
    const data=await res.json();
    return data
}

export const useProduct = (slug) => {
    return useQuery({
        queryKey: ["product", slug],
        queryFn: () => fetchProduct(slug),
        staleTime: 1000 * 60 * 5,
        // Don't attempt to fetch if slug is not provided
        enabled: !!slug,
    });

};

export const useProducts = () => {
    return useQuery({
        queryKey: ['product'],
        queryFn: () => fetchProducts(),
        staleTime: 1000 * 60 * 5
    })
}

const fetchCategories = async() => {
    const res = await fetch(`${categoriesApi}/`);
    if(!res.ok) {
        throw new Error(`Failed to fetch categories ${res.status}`);
    }
    const data=await res.json();
    return data;
}

const fetchCategory=async(slug) => {
    const res = await fetch(`${categoriesApi}/${slug}`);
    if(!res.ok) {
        throw new Error(`Failed to fetch categorie ${res.status}`);
    }
    const data=await res.json();
    return data;
}

export const useCategories = () => {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategories(),
        staleTime: 1000 * 60 * 5
    })
}

export const useCategory=(slug)=>{
    return useQuery({
        queryKey: ["category",slug],
        queryFn: () => fetchCategory(slug),
        staleTime: 1000 * 60 * 5,
        enabled:!!slug,
    })
}