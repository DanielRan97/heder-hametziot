import ShowSearch from "../../components/showSearch/showSearch";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from './search.module.css';


const Search = () => {

    return(
        <Aux>
            <ShowSearch />
        </Aux>
    )
}

export default withClass(Search, classes.Search);