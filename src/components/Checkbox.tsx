import {
    Checkbox,
    CheckboxProps,
    withStyles,
    FormControlLabel,
} from "@material-ui/core";
import React from "react";

type EnhancedFormControlLabelProps = {
    label: string;
    labelPlacement: "bottom" | "top" | "end" | "start" | undefined;
};

const EnhancedFormControlLabel = withStyles({
    root: {
        margin: "0",
    },
    label: {
        color: "#718096",
        fontFamily: "inherit",
        fontSize: "0.8rem",
    },
})(FormControlLabel);

const EnhancedCheckbox = withStyles({
    root: {
        "&$checked": {
            color: "#3182ce",
        },
    },
    checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

const PKCheckbox = (props: EnhancedFormControlLabelProps) => (
    <EnhancedFormControlLabel
        control={<EnhancedCheckbox />}
        label={props.label}
        labelPlacement={props.labelPlacement}
    />
);

export default PKCheckbox;
