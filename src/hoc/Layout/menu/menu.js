import { logout } from '../../../fireBase/fireBaseFunc';
import { auth } from '../../../fireBase/firebase';
import Aux from '../../Auxiliary/Auxiliary';
import withClass from '../../withClass/withClass';
import classes from './menu.module.css';
import { useNavigate } from 'react-router-dom';

const Menu = props => {
    const navigate = useNavigate();

    const logOutHandler = async () => {
        await logout();
        props.setMenu(false);
        navigate('/');
    }

    return (
        <Aux>
            <h1>תפריט</h1>
            {auth.currentUser?.uid ? (
                <button onClick={logOutHandler} className={classes.logOutButton}>
                    התנתק
                </button>
            ) : null}
        </Aux>
    );
};

export default withClass(Menu, classes.Menu);