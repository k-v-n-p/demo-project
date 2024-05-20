import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Switch, FormGroup, Typography, FormControl, InputLabel, Select, MenuItem, Button,Pagination, TextField, Autocomplete } from '@mui/material';
import { fetchProducts, fetchProductsByBrandCategory, fetchCategories, searchProducts, fetchAllProducts  } from '../services/api';
import ProductCard from './ProductCard';
import ProductTable from './ProductTable';

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('card');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortField, setSortField] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');


    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData || []); 
            const productData = await fetchAllProducts();
            setBrands([...new Set(productData.products.map(product => product.brand))] || []); // Extract unique brands from products as it is not provided by backend
        };
        loadCategories();
    }, []);
    

    useEffect(() => {
        const getBrandsByCategory = async () => { 
            const productData = await fetchAllProducts();
            if (selectedCategory) {
                // Changing brand options based on category selection
                const filteredProducts = productData.products.filter(product => product.category === selectedCategory);
                console.log(filteredProducts)
                setBrands([...new Set(filteredProducts.map(product => product.brand))] || []);
            } else {
                // If no selected category, set brands from all products
                setBrands([...new Set(productData.products.map(product => product.brand))] || []);
            }
        };
        getBrandsByCategory();
    }, [selectedCategory]);
    console.log(brands);

    useEffect(() => {
        const loadProducts = async () => {
            let data;
            if (searchQuery) {
                setCurrentPage(1) //Feature to retain browing history page when searched is not implemented
                data = await searchProducts({ query: searchQuery, category: selectedCategory, sortField: sortField, sortOrder: sortOrder, brand: selectedBrand});
            }
            else if (selectedCategory || selectedBrand){ 
                data =await fetchProductsByBrandCategory({category:selectedCategory, brand: selectedBrand, sortField: sortField, sortOrder: sortOrder});
            }
            else{
                data=await fetchProducts({ skip: (currentPage - 1) * 10, limit: 10 });
            }

            setProducts(data.products || []); 
            setTotalPages(Math.ceil(data.total / 10)); 
            sortProducts(data.products || []);
        };
        loadProducts();
    }, [selectedCategory, currentPage, sortField, sortOrder, searchQuery, selectedBrand]);


    const sortProducts = (products) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (sortOrder === 'asc') {
                return  a[sortField] < b[sortField] ? -1 : 1;
            } else {
                return a[sortField] > b[sortField] ? -1 : 1;
            }
        });
        setProducts(sortedProducts);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
      };
    
    return (
        <div>
            {/* Card and table views 1. */}
            <FormGroup row style={{ justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                <Typography>{'Card'}</Typography>
                <Switch checked={viewMode === 'table'} onChange={(e) => setViewMode(e.target.checked ? 'table' : 'card')} />
                <Typography>{'Table'}</Typography>
            </FormGroup>

            {/* <Autocomplete
            id="grouped-demo"
            options={products.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="With categories" />}
            /> */}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                {/* Search Functionality 2.*/}
                <TextField
                    label="Search Products"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Filtering Feature 3. */}
                <FormControl variant="outlined" sx={{ m: 2, minWidth: 200 }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
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

                <FormControl variant="outlined" sx={{ m: 2, minWidth: 200 }}>
                    <InputLabel id="brand-select-label">Brand</InputLabel>
                    <Select
                        labelId="brand-select-label"
                        id="brand-select"
                        value={selectedBrand}
                        label="Brand"
                        onChange={e => setSelectedBrand(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {brands.map((brand, index) => (
                            <MenuItem key={index} value={brand}>{brand}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {/* Sorting Feature 4. this is not provided by backend, hence implemented and reset upon search*/}
                <div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="sort-field-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-field-label"
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                        >
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    </Button>
                </div>

                {/* Pagination Feature 5. */}
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
                <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</Button>
                </div>
            </div>
            {viewMode === 'card' ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div> :
                <ProductTable products={products} />
            }
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} size="large"/>
            </div>
        </div>
    );
};

export default ProductDashboard;
