import React from 'react';
import {Route, Routes, Navigate  } from 'react-router-dom';
import HomePage from '../containers/homePage/homePage';
import Admin from '../containers/admin/admin';
import ShowProducts from '../containers/showProducts/showProducts';
import Search from '../containers/search/search';

const MainRouter = props => {

    return(

        <Routes >
          <Route exact path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products/:category" element={<ShowProducts />} />
          <Route path="/products/:category/:type" element={<ShowProducts />} />
          <Route path="/products/search/:name" element={<Search />} />
          <Route path="/products/:category/:type/:productId" element={<ShowProducts />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

    );
};

export default MainRouter;