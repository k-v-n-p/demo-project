import React, { useState, useEffect } from 'react';
import { Switch, FormGroup, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { fetchProducts, fetchProductsByCategory, fetchCategories } from '../services/api';
import ProductCard from './ProductCard';
import ProductTable from './ProductTable';

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('card');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data || []); 
        };
        loadCategories();
    }, []);
    
    useEffect(() => {
        const loadProducts = async () => {
            const data = selectedCategory!=="" ? 
                await fetchProductsByCategory(selectedCategory) : 
                await fetchProducts({ skip: (currentPage - 1) * 10, limit: 10 });
            setProducts(data.products || []); 
            setTotalPages(Math.ceil(data.total / 10)); 
        };
        loadProducts();
    }, [selectedCategory, currentPage]);
    
    return (
        <div>
            <FormGroup row style={{ justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                <Typography>{'Card'}</Typography>
                <Switch checked={viewMode === 'table'} onChange={(e) => setViewMode(e.target.checked ? 'table' : 'card')} />
                <Typography>{'Table'}</Typography>
            </FormGroup>
            <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    value={selectedCategory}
                    label="Category"
                    onChange={e => setSelectedCategory(e.target.value)}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>{category}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</Button>
            {viewMode === 'card' ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div> :
                <ProductTable products={products} />
            }
        </div>
    );
};

export default ProductDashboard;
