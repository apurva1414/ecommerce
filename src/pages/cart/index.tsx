import React, { useEffect, useState } from 'react';
import { Table, InputNumber, Button, Space, Spin } from 'antd';
import useProducts, { IProduct } from '@/hooks/useProducts';
import Image from 'next/image';
import styles from './Cart.module.scss';
import Loader from '@/ui/loader';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<{ id: number; quantity: number }[]>([]);
    const [products, setProducts] = useState<{ id: number; quantity: number; product: IProduct }[]>([]);
    const [total, setTotal] = useState(0);

    const { data, isLoading, isError } = useProducts(100, "all", 0);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartWithQuantities = savedCart.map((id: number) => ({ id, quantity: 1 }));
        setCartItems(cartWithQuantities);
    }, []);

    useEffect(() => {
        if (data) {
            const cartProducts = cartItems.map((item) => {
                const product = data?.products?.find((p) => p.id === item.id);
                return product
                    ? { ...item, product }
                    : { ...item, product: { title: 'Unknown Product', price: 0, image: '' } };
            });

            setProducts(cartProducts as any);
        } else if (cartItems.length === 0) {
            setProducts([]);
        }
    }, [data, cartItems]);

    useEffect(() => {
        const calculatedTotal = products.reduce((acc, item) => {
            const { product, quantity } = item;
            return acc + (product?.price || 0) * quantity;
        }, 0);
        setTotal(calculatedTotal);
    }, [products]);

    const handleQuantityChange = (id: number, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const handleRemoveItem = (id: number) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart.map((item) => item.id)));
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_: any, record: any) => (
                <Space>
                    <Image
                        src={record?.product?.images[0]}
                        alt={record?.product?.title}
                        width={50}
                        height={50}
                    />
                    <span className={styles.productTitle}>{record?.product?.title}</span>
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_: any, record: any) => `$${record?.product?.price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_: any, record: any) => (
                <InputNumber
                    min={1}
                    value={record?.quantity}
                    onChange={(value) => handleQuantityChange(record?.id, value || 1)}
                />
            ),
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (_: any, record: any) =>
                `$${(record?.product?.price * record?.quantity).toFixed(2)}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveItem(record?.id)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    if (isLoading) return <Loader size="large" />;
    if (isError) return <div>Error loading cart items</div>;

    return (
        <div style={{ width: '80vw', margin: '0 auto', padding: '20px' }}>
            <h2>Shopping Cart</h2>
            <Table
                columns={columns}
                dataSource={products.map((item) => ({
                    ...item,
                    key: item.id,
                }))}
                pagination={false}
            />
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <h3 style={{ textAlign: 'right', marginBottom: '20px' }}>Total: ${total.toFixed(2)}</h3>
                <Button type="primary" size="large">
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default CartPage;
