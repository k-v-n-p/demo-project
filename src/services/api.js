import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com/products';

export const fetchProductsByCategory = async (category) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/category/${category}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const fetchProducts = async ({ limit = 10, skip = 0 }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}?limit=${limit}&skip=${skip}&select=title,price,brand,category,rating,thumbnail`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const searchProducts = async ({ query, category }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
            params: { q: query }
        });

        let filteredProducts = [];
        if (response.data && response.data.products) {
            // If category is provided, filter products based on category
            if (category) {
                filteredProducts = response.data.products.filter(product => product.category === category);
            } else {
                // If category is not provided, use all products
                filteredProducts = response.data.products;
            }
        }

        // Calculate total number of products
        const total = filteredProducts.length;

        return { products: filteredProducts, total: total };
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
};


