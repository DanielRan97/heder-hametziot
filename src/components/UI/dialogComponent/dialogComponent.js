import withClass from "../../../hoc/withClass/withClass";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./dialogComponent.module.css";

const DialogComponent = ({ children , ...props }) => {
  const onOverlayClick = (event) => {
    if (event.target.classList.contains(classes.dialogOverlay)) {
      props.closeDialog();
    }
  };

  return (
    <Aux>
      <div className={classes.dialogOverlay} onClick={onOverlayClick}>
        <div className={classes.dialogContent}>
          <span> {children}</span>
          <button
            className={classes.closeButton}
            type="button"
            onClick={props.closeDialog}
          >
            סגור
          </button>
        </div>
      </div>
    </Aux>
  );
};

export default withClass(DialogComponent, classes.DialogComponent);
