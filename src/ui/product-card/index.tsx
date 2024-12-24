import React from 'react';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';

import styles from './ProductCard.module.scss';

interface ProductCardProps {
  title: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  imageUrl,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
}) => {
  return (
    <Card
      className={styles.productCard}
      cover={
        <div className={styles.imageContainer}>
          <Image
            alt={title}
            src={imageUrl}
            width={300}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </div>
      }
    >
      <div className={styles.details}>
        <Button
          type={!isInCart ? "primary" : "text"}
          className={styles.addToCart}
          icon={<ShoppingCartOutlined />}
          onClick={!isInCart ? onAddToCart : onRemoveFromCart}
        >
          {!isInCart ? 'Add To Cart' : 'Remove From Cart'}
        </Button>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>${price}</p>
      </div>
    </Card>
  );
};

export default ProductCard;
