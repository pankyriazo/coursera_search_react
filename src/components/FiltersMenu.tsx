import React, { Component } from "react";
import "./FiltersMenu.scss";

type FiltersMenuProps = {
    filtersOpen: boolean;
    updateFilters: Function;
};

class FiltersMenu extends Component<FiltersMenuProps> {
    render() {
        return (
            <div
                className={
                    (this.props.filtersOpen ? "open " : "") +
                    "filters_menu fixed top-0 left-0 w-full h-full z-10 bg-white"
                }
            ></div>
        );
    }
}

export default FiltersMenu;
