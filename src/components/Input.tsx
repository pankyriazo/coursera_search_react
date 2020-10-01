import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const PKInput = withStyles({
    root: {
        "& .MuiInput-root, & .MuiFormLabel-root": {
            fontFamily: "inherit",
            fontSize: "0.8rem",
        },
        "& label.Mui-focused": {
            color: "#3182ce",
        },
        "& .MuiInput-underline:before": {
            borderBottom: "1px solid rgb(0 0 0 / 15%)",
        },
        "& .MuiInput-underline:after": {
            borderBottom: "1px solid #3182ce",
        },
        "& .MuiOutlinedInput-root": {
            borderColor: "#3182ce",
        },
        "& .MuiIconButton-root": {
            color: "rgba(0, 0, 0, 0.20)",
        },
        "& .MuiAutocomplete-option": {
            fontSize: "0.5rem",
        },
    },
})(TextField);

export default PKInput;
