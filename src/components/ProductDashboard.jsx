import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from './ProductCard';
import ProductTable from './ProductTable';

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data.products);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <div>
            <button onClick={() => setViewMode('card')}>Card View</button>
            <button onClick={() => setViewMode('table')}>Table View</button>
            {viewMode === 'card' ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
                :
                <ProductTable products={products} />
            }
        </div>
    );
};

export default ProductDashboard;
