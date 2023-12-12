import Layout from '../../hoc/Layout/layout';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import withClass from '../../hoc/withClass/withClass';
import classes from './App.module.css';
import { initializeAuth } from '../../fireBase/fireBaseFunc';
import { useEffect } from 'react';
import { addVisit } from '../../fireBase/fireBaseFuncDb';

function App() {

useEffect(() => {
  initializeAuth();
  addVisit();
}, [])

return (
    <Aux>
      <Layout/>
    </Aux>
  );
}

export default withClass(App, classes.withClass);
