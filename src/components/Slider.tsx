import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";

const PKSlider = withStyles({
    root: {
        color: "#3182ce",
        padding: "2rem 0 0",
        width: "calc(100% - 2rem)",
        left: "1rem",
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        boxShadow:
            "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
        marginTop: -12,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow:
                "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
                boxShadow:
                    "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
            },
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 0.5rem)",
        top: -22,
        "& *": {
            background: "transparent",
            color: "#000",
        },
    },
    track: {
        height: 2,
    },
    rail: {
        height: 2,
        opacity: 0.2,
        backgroundColor: "#3182ce",
    },
    mark: {
        backgroundColor: "#3182ce",
        height: 8,
        width: 1,
        opacity: 0.2,
        marginTop: -3,
    },
    markActive: {
        opacity: 1,
        backgroundColor: "currentColor",
    },
})(Slider);

export default PKSlider;
