import classes from "./modal.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import withClass from "../../../hoc/withClass/withClass";

const Modal = props => {

  return (
    <Aux>
      <h2>{props.title}</h2>
      <p>{props.text}</p>
      <button onClick={() => props.onModalClose()}>אישור</button>
    </Aux>
  );
};

export default withClass(Modal, classes.Modal);
