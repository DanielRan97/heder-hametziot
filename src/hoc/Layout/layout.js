import Aux from '../Auxiliary/Auxiliary';
import withClass from '../withClass/withClass';
import classes from './layout.module.css';
import Menu from './menu/menu';
import { useState, useEffect } from 'react';
import Fade from '../fade/fade';
import MainRouter from '../../router/mainRouter';
import Path from './nav/path/path';
import SearchBar from './nav/searchBar/searchBar';
import { getProducts } from '../../fireBase/fireBaseFuncDb';

const Layout = () => {

    const [menu, setMenu] = useState(false);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        try {
          let categories = [];
          let types = [];
          getProducts().then((res) => {
            if(res !== undefined && res !== null){
              Object.values(res).forEach((element) => {
                categories.push(element.categories);
                types.push({category: element.categories , type: element.types});
              });
              setCategories(categories);
              let jsonObject = types.map(JSON.stringify);
              let uniqueSet = new Set(jsonObject);
              let uniqueTypesArray = Array.from(uniqueSet).map(JSON.parse);
              setTypes(uniqueTypesArray);
            }
          });
        } catch (error) {
          setCategories([]);
        }
      }, []);

    const handelMenu = () => {
        setMenu(menu === false ? true : false)
    }

    useEffect(() => {
      if(menu){
        const menu = document.getElementById('menu');
        menu.classList.add('animate__animated', 'animate__fadeInRight');
      }
  
    }, [menu]);

    return(
        <Aux>

            <header>
                <SearchBar handelMenu={handelMenu}/>
                <Path />
            </header>

           {menu? <aside  className={classes.layoutAside}>
                        <div className={classes.divMenu} id="menu"><Menu menu setMenu={() => setMenu()} types={types} categories={categories}/></div>
                        <Fade show={menu} clicked={handelMenu}/>
                  </aside>
                : null
            }

            <main className={classes.main}>
                <MainRouter />
            </main>

        </Aux>
    );

}

export default withClass(Layout, classes.Layout);