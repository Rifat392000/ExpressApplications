import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

import Cart from '../Cart/Cart';
import Product from '../Product/Product';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const numberOfPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    // Fetch total number of products
    useEffect(() => {
        fetch('http://localhost:5000/productsCount')
            .then(res => res.json())
            .then(data => setCount(data.count));
    }, []);

    // Fetch paginated products
    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [currentPage, itemsPerPage]);

    // Pagination handlers
    const handleItemsPerPage = (e) => {
        const val = parseInt(e.target.value);
        setItemsPerPage(val);
        setCurrentPage(0);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
    };

    return (
        <div className='shop-container'>
            {/* Product List */}
            <div className="products-container">
                {
                    products.map(product => (
                        <Product
                            key={product._id}
                            product={product}
                        />
                    ))
                }
            </div>

            {/* Cart Section (UI only, no logic) */}
            <div className="cart-container">
                <Cart cart={[]} handleClearCart={() => {}}>
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>

            {/* Pagination */}
            <div className='pagination'>
                <p>Current page: {currentPage + 1}</p>
                <button onClick={handlePrevPage} disabled={currentPage === 0}>Prev</button>
                {
                    pages.map(page => (
                        <button
                            key={page}
                            className={currentPage === page ? 'selected' : ''}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page+1}
                        </button>
                    ))
                }
                <button onClick={handleNextPage} disabled={currentPage === pages.length - 1}>Next</button>

                <select value={itemsPerPage} onChange={handleItemsPerPage} className="items-select">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;
