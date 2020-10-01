import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/styles";

const ITEM_SIZE = 32;
const LISTBOX_PADDING = 8;

const PKAutocomplete = withStyles({
    paper: {
        "& .MuiAutocomplete-listbox": {
            padding: `${LISTBOX_PADDING}px 0`,
        },
    },
    listbox: {
        "& .MuiAutocomplete-option": {
            display: "block",
            lineHeight: "1.5",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "inherit",
            fontSize: "0.8rem",
            minHeight: `${ITEM_SIZE}px`,
        },
    },
    tag: {},
})(Autocomplete);

export default PKAutocomplete;
