import React, { useEffect, useState } from 'react';
import Layout from '../../hoc/Layout/layout';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import withClass from '../../hoc/withClass/withClass';
import classes from './App.module.css';
import { initializeAuth } from '../../fireBase/fireBaseFunc';
import { addVisit } from '../../fireBase/fireBaseFuncDb';
import Loading from '../../components/UI/loading/loading';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startApp = async () => {
      try {
        await initializeAuth();
        await addVisit();
        setLoading(false);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setLoading(false);
      }
    };

    startApp();
  }, []);

  return (
    <Aux>
      {loading ? <Loading /> : <Layout />}
    </Aux>
  );
}

export default withClass(App, classes.withClass);
