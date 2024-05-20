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
        const response = await axios.get(`${API_BASE_URL}?limit=${limit}&skip=${skip}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
