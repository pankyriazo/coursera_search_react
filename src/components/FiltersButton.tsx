import React, { Component } from "react";
import FiltersButtonOpen from "./FiltersButtonOpen";
import FiltersButtonClose from "./FiltersButtonClose";

type FiltersButtonProps = {
    filtersMenuIsOpen: boolean;
    toggleFiltersMenuStatus: () => void;
};

class FiltersButton extends Component<FiltersButtonProps> {
    handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        this.props.toggleFiltersMenuStatus();
    };

    render() {
        return (
            <button
                onClickCapture={this.handleClick}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center justify-center w-24 h-12 bg-blue-600 rounded shadow text-white"
            >
                {this.props.filtersMenuIsOpen ? (
                    <FiltersButtonClose />
                ) : (
                    <FiltersButtonOpen />
                )}
            </button>
        );
    }
}

export default FiltersButton;
