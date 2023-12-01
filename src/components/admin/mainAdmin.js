import Products from './products/products';
import Loading  from '../UI/loading/loading';
const MainAdmin = () => {

    const productPage = <Products />

    return(
        productPage ? productPage : <Loading />
    );
};

export default MainAdmin