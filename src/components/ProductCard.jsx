import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ProductCard = ({ product }) => {
    return (
        <Card style={{ width: 300, margin: 10 }}>
            <CardMedia
                component="img"
                height="140"
                image={product.thumbnail}
                alt={product.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price:  <strong>${product.price}</strong>
                    <br />
                    Category: {product.category}
                    <br />
                    Brand: {product.brand}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
