import withClass from '../../../hoc/withClass/withClass';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import classes from './dialogComponent.module.css';

const DialogComponent = ({ children,  ...props }) => {

  return (
    <Aux>


        <div className={classes.dialogOverlay} onClick={props.closeDialog}>
          <div className={classes.dialogContent}>
            <span className={classes.closeButton} onClick={props.closeDialog}>
              &times;
            </span>
            {children}
          </div>
        </div>
  
    </Aux>
  );
};

export default withClass(DialogComponent,classes.DialogComponent);