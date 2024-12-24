import { Spin } from 'antd';
import styles from './Loader.module.scss';

interface LoaderProps {
    size?: 'small' | 'default' | 'large';
}

const Loader = ({ size = 'large' }: LoaderProps) => {
    return (
        <div className={styles.loaderContainer}>
            <Spin size={size} />
        </div>
    );
};

export default Loader;
