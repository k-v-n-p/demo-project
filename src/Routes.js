import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDashboard from './components/ProductDashboard';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<ProductDashboard />} />
        </Routes>
    </Router>
)

export default AppRoutes;