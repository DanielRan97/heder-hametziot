import React from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import withClass from '../../hoc/withClass/withClass';
import classes from './homepageCategories.module.css';
import { useNavigate } from "react-router-dom";

const HomePageCategories = (props) => {
  const { categoriesState } = props;
    const navigate = useNavigate()

  const fetchPropsCategories = () => {
    return categoriesState.length > 0 ? (
      categoriesState.map((ele, index) => (
        <div key={index} className={classes.imgSpan} onClick={() => navigate(`/products/${ele}`)}>
          <img
            src={getImageSource(ele)}
            alt={ele}
          />
          <p className={classes.imgTitle}>{ele}</p>
        </div>
      ))
    ) : (
      <p>לא נמצאו קטגוריות</p>
    );
  };

  const getImageSource = (imageName) => {
    try {
      return require(`../../assets/categoriesPhotos/${imageName}.png`);
    } catch (error) {
      return require('../../assets/hederHametziotTitle/hederHametziotTitle.png');
    }
  };

  return <Aux>{fetchPropsCategories()}</Aux>;
};

export default withClass(HomePageCategories, classes.HomePageCategories);
