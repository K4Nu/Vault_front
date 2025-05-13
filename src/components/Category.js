import {useCategory,useCategories} from "./Api.jsx";
import {useParams} from "react-router";
import {useState,useEffect} from "react";

const Category= () =>
{
    const slug=useParams();
    const {data:categories,isLoading,isError} = useCategory(slug);
    const [color,setColor]=useState("");
    const [images,setImages]=useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        if(categories)
        {
            const catImages=categories.items.images?.map(img=>img.filename)||[];
            setImages(catImages);


        }
    })
    console.log(images);
    return (
        <>
            <p>Test</p>
        </>
    )
}
export default Category;