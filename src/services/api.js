import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com/products';

// useless api untill brand fetching is available from backend
// export const fetchProductsByBrandCategory = async ({category,brand}) => {
//     try {
//         if (category){
//             const response = await axios.get(`${API_BASE_URL}/category/${category}`); 
//         }
//         else{
//             const response = await axios.get(`${API_BASE_URL}`);
//         }
//         let filteredProducts = [];
//         if (response.data && response.data.products ){
//             if (brand){
//                 filteredProducts = response.data.products.filter(product => product.brand === brand);
//             }
//             else{
//                 filteredProducts=response.data.products
//             }
//         }
//         return { products: filteredProducts, total: filteredProducts.length };
//     } catch (error) {
//         console.error("Error fetching products by category:", error);
//         throw error;
//     }
// };
    export const fetchProductsByBrandCategory = async ({category,brand,  sortField, sortOrder}) => {
            try {
                const response = await axios.get(`${API_BASE_URL}`);

                let filteredProducts = [];
                if (response.data && response.data.products) {
                    // If category is provided, filter products based on category
                    if (category) {
                        filteredProducts = response.data.products.filter(product => product.category === category);
                    } else {
                        // If category is not provided, use all products
                        filteredProducts = response.data.products;
                    }
                    if (brand) {
                        filteredProducts = filteredProducts.filter(product => product.brand === brand);
                    } 
                }
                const sortedProducts = sortProducts(filteredProducts, sortOrder, sortField);
                // Calculate total number of products
                const total = sortedProducts.length;

                return { products: sortedProducts, total: total };
            } catch (error) {
                console.error("Error searching products:", error);
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

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}?limit=100&skip=0&select=brand,category`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const searchProducts = async ({ query, category, sortField, sortOrder, brand }) => {

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
            if (brand) {
                filteredProducts = filteredProducts.filter(product => product.brand === brand);
            } 
        }
        const sortedProducts = sortProducts(filteredProducts, sortOrder, sortField);
        // Calculate total number of products
        const total = sortedProducts.length;

        return { products: sortedProducts, total: total };
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
};

const sortProducts = (products, sortOrder, sortField) => {
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortField] < b[sortField] ? -1 : 1;
        } else {
            return a[sortField] > b[sortField] ? -1 : 1;
        }
    });
    return sortedProducts;
};
