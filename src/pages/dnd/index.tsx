import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useProducts, { IProduct } from '@/hooks/useProducts';
import { Card, Spin } from 'antd';
import Image from 'next/image';

const DraggableProduct: React.FC<{ product: IProduct; index: number; moveProduct: (fromIndex: number, toIndex: number) => void }> = ({ product, index, moveProduct }) => {
    const [, drag] = useDrag(() => ({
        type: 'PRODUCT',
        item: { index },
    }));

    const [, drop] = useDrop(() => ({
        accept: 'PRODUCT',
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveProduct(item.index, index);
                item.index = index;
            }
        },
    }));

    return (
        <div ref={(node) => { if (node) drag(drop(node)); }} style={{ width: '200px' }}>
            <Card
                hoverable
                cover={
                    <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={200}
                        height={200}
                    />
                }
            >
                <Card.Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </div>
    );
};

const DraggableCards: React.FC = () => {
    const { data, isLoading, isError } = useProducts(10, 'all', 0);
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        if (data) {
            setProducts(data.products || []);
        }
    }, [data]);

    const moveProduct = (fromIndex: number, toIndex: number) => {
        const updatedProducts = [...products];
        const [movedProduct] = updatedProducts.splice(fromIndex, 1);
        updatedProducts.splice(toIndex, 0, movedProduct);
        setProducts(updatedProducts);

        localStorage.setItem('reorderedProducts', JSON.stringify(updatedProducts));
    };

    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error loading products</div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ maxWidth: '800px', margin: '20px auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Drag and Drop Products</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {products.map((product, index) => (
                        <DraggableProduct
                            key={product.id}
                            product={product}
                            index={index}
                            moveProduct={moveProduct}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
};

export default DraggableCards;
