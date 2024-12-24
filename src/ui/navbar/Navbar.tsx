import { Badge, Button } from 'antd';
import { DragOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.scss'; // SCSS file for styling

const Navbar = () => {
    const router = useRouter();
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        const storedCartCount = JSON.parse(localStorage.getItem('cart') || '[]');
        if (storedCartCount) {
            setCartCount(Number(storedCartCount?.length));
        }
    }, []);

    const handleCartClick = () => {
        router.push('/cart');
    };

    const handleDragClick = () => {
        router.push('/dnd');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/" passHref>
                    <span className={styles.logoText}>Ecommerce</span>
                </Link>
            </div>
            <div className={styles.menuItemsBox}>
                <div title='cart' className={styles.menuItems}>
                    <Badge showZero>
                        <Button icon={<ShoppingCartOutlined />} onClick={handleCartClick} />
                    </Badge>
                </div>
                <div title='DND' className={styles.menuItems}>
                    <Badge showZero>
                        <Button icon={<DragOutlined />} onClick={handleDragClick} />
                    </Badge>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
