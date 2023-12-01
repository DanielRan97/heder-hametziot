import Aux from '../../hoc/Auxiliary/Auxiliary';
import classes from './admin.module.css';
import MainAdmin from '../../components/admin/mainAdmin';
import withClass from '../../hoc/withClass/withClass';
import { logInWithGoogle, logout } from '../../fireBase/fireBaseFunc';
import { auth } from '../../fireBase/firebase';
import { useEffect, useState } from 'react';
import Loading from '../../components/UI/loading/loading';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserState(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { user, token } = await logInWithGoogle();
      localStorage.setItem('hhloginToken', token);
    } catch (error) {
      logout();
      navigate('/');
    }
  };

  const logAsAdminComponent = () => {
    return (
      <div>
        <h1>התחבר כאדמין</h1>
        <button onClick={handleLogin} className={classes.loginDAdminButton}>
          התחבר
        </button>
      </div>
    );
  };

  return (
    <Aux>
      {loading ? <Loading /> : userState === null ? logAsAdminComponent() : <MainAdmin />}
    </Aux>
  );
};

export default withClass(Admin, classes.Admin);
