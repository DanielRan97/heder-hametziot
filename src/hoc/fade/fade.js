import classes from './fade.module.css';

const Fade = (props) => (
    props.show ?<div onClick={props.clicked}
    className={classes.Fade}></div>:null
);

export default Fade ;