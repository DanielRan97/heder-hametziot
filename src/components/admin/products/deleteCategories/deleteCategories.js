import Aux from '../../../../hoc/Auxiliary/Auxiliary';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import classes from './deleteCategories.module.css';
import withClass from '../../../../hoc/withClass/withClass';

const DeleteCategories = props => {



  return (
    <Aux>
        {props.categoryListState && props.categoryListState.map((category, index) => (
            <div className={classes.category} key={index}>
            <p>{category} <FontAwesomeIcon onClick={() => props.deleteCategoryHandler(category)} className={classes.trashIcon} icon={faTrashCan} /></p>
            <hr />
            </div>
        ))}
    </Aux>
  );
};

export default withClass(DeleteCategories, classes.DeleteCategories);