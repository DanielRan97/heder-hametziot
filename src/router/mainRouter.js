import React from 'react';
import {Route, Routes  } from 'react-router-dom';
import HomePage from '../containers/homePage/homePage';
import Admin from '../containers/admin/admin';

const MainRouter = props => {

    return(

        <Routes >
          <Route exact path="/"  element={<HomePage />} />
          <Route path="/admin" element={<Admin user={props.user} setUser={() => props.setUser()}/>} />
        </Routes>

    );
};

export default MainRouter;