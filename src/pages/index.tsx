import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Row, Col, Space, Spin, Empty } from 'antd';
import useProducts, { IProduct } from '@/hooks/useProducts';
import ProductCard from '@/ui/product-card';
import Loader from '@/ui/loader';
import useProductCategories, { ICategory } from '@/hooks/useProductCategories';

const { Option } = Select;

const ProductList: React.FC = () => {
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [cart, setCart] = useState<number[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const { data, isLoading, isError, isFetching } = useProducts(limit, selectedCategory, skip);
  const { data: categories, isLoading: isLoadingCategories } = useProductCategories();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    if (data?.products) {
      setProducts((prevProducts) => {
        const productIds = prevProducts.map((product) => product.id);
        const newProducts = data.products.filter(
          (product) => !productIds.includes(product.id)
        );
        return [...prevProducts, ...newProducts];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    if (data && products.length < data.total) {
      setSkip((prevSkip) => prevSkip + limit);
    }
  };

  const handleAddToCart = (productId: number) => {
    if (!cart.includes(productId)) {
      const newCart = [...cart, productId];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    const newCart = cart.filter((id) => id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const filteredBySearch = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByCategory =
    selectedCategory === 'all'
      ? filteredBySearch
      : filteredBySearch.filter(
        (product) => product.category === selectedCategory
      );

  const filteredByRating =
    filteredByCategory.filter(
      (product) => product.rating >= minRating
    ) || [];

  const sortedProducts = [...filteredByRating].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    return b.price - a.price;
  });

  if (isLoading && !products.length) {
    return <Loader size="large" />;
  }

  if (isError) return <div>Error loading products</div>;

  return (
    <div style={{ width: '80vw', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Space size="middle" wrap>
            <Input
              placeholder="Search products"
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />

            <Select
              defaultValue="all"
              onChange={(value) => {
                setSelectedCategory(value);
                setSkip(0)
              }}
              loading={isLoadingCategories}
            >
              <Option value="all">All Categories</Option>
              {isLoadingCategories ? (
                <Option value="loading">Loading Categories...</Option>
              ) : (
                categories?.map((category: ICategory, id: number) => (
                  <Option key={id} value={category}>
                    {category as unknown as string}
                  </Option>
                ))
              )}
            </Select>

            <Select defaultValue={0} onChange={(value) => setMinRating(value)}>
              <Option value={0}>All Ratings</Option>
              <Option value={4}>4 Stars & Up</Option>
              <Option value={3}>3 Stars & Up</Option>
              <Option value={2}>2 Stars & Up</Option>
              <Option value={1}>1 Star & Up</Option>
            </Select>

            <Select defaultValue="asc" onChange={(value) => setSortOrder(value)}>
              <Option value="asc">Price: Low to High</Option>
              <Option value="desc">Price: High to Low</Option>
            </Select>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  title={product.title}
                  price={product.price}
                  imageUrl={product.images[0]}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onRemoveFromCart={() => handleRemoveFromCart(product.id)}
                  isInCart={cart.includes(product.id)}
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Empty
                  description={<span>No products found</span>}
                />
              </div>
            </Col>
          )}
        </Row>

        {data && products.length < data.total && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Button
              htmlType="button"
              onClick={handleLoadMore}
              type="primary"
              disabled={isFetching}
            >
              {isFetching ? 'Loading More...' : 'Load More'}
            </Button>
          </div>
        )}
      </Space>
    </div>
  );
};

export default ProductList;
