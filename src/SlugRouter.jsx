import { useParams } from 'react-router-dom';
import Product from './components/Product.jsx';
import Category from './components/Category.jsx';

export default function SlugRouter() {
    const { slug } = useParams();

    const isProductSlug = /^[a-z0-9\-]+-[0-9a-f]{8}$/.test(slug);

    return isProductSlug ? <Product /> : <Category />;
}