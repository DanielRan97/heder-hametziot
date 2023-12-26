import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from "./block.module.css";

const Block = () => {
  return <Aux> <h1>חדר המציאות</h1> </Aux>;
};

export default withClass(Block, classes.Block);
