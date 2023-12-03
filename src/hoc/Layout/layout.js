import Aux from '../Auxiliary/Auxiliary';
import withClass from '../withClass/withClass';
import classes from './layout.module.css';
import Nav from './nav/nav';
import Menu from './menu/menu';
import { useState } from 'react';
import Fade from '../fade/fade';
import MainRouter from '../../router/mainRouter';
import Path from './nav/path/path';


const Layout = () => {

    const [menu, setMenu] = useState(false);

    const handelMenu = () => {
        setMenu(menu === false ? true : false)
    }

    return(
        <Aux>

            <header>
                <Nav handelMenu={handelMenu}/>
                <Path />
            </header>

           {menu? <aside className={classes.layoutAside}>
                        <Menu setMenu={() => setMenu()}/>
                        <Fade show={menu} clicked={handelMenu}/>
                  </aside>
                : null
            }

            <main>
                <MainRouter />
            </main>

        </Aux>
    );

}

export default withClass(Layout, classes.Layout);