import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../containers/homePage/homePage';
import Admin from '../containers/admin/admin';
import ShowProducts from '../containers/showProducts/showProducts';
import Search from '../containers/search/search';
import Terms from '../containers/terms/terms';
import Block from '../components/block/block';
import { auth } from '../fireBase/firebase';
import Loading from '../components/UI/loading/loading';

const MainRouter = () => {
  const [admin, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      auth.currentUser !== null ? setAuth(auth.currentUser) : setAuth(null)
      setLoading(false);
  }, []);

  const renderRoutes = () => {
    return loading ? <Loading /> : (
      <Routes>
        <Route
          exact
          path="/"
          element={admin !== null ? <HomePage /> : <Block />}
        />
        <Route
          path="/products/:category"
          element={admin !== null ? <ShowProducts /> : <Block />}
        />
        <Route
          path="/products/:category/:type"
          element={admin !== null ? <ShowProducts /> : <Block />}
        />
        <Route
          path="/products/search/:name"
          element={admin !== null ? <Search /> : <Block />}
        />
        <Route
          path="/products/:category/:type/:productId"
          element={admin !== null ? <ShowProducts /> : <Block />}
        />
        <Route
          path="/terms"
          element={admin !== null ? <Terms /> : <Block />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  };

  return renderRoutes();
};

export default MainRouter;
