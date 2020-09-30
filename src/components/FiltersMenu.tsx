import React, { Component, RefObject } from "react";
import "./FiltersMenu.scss";
import { Course } from "../types/course";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

type FiltersMenuProps = {
    filtersMenuIsOpen: boolean;
    filtersMenuSetState: ({
        courses,
        coursesNum,
        loading,
        reset,
    }: {
        courses?: Course[];
        coursesNum?: number;
        loading?: boolean;
        reset?: boolean;
    }) => void;
};

class FiltersMenu extends Component<FiltersMenuProps> {
    filtersMenuRef: RefObject<any>;

    constructor(props: FiltersMenuProps) {
        super(props);

        this.filtersMenuRef = React.createRef();
    }

    async componentDidUpdate() {
        if (this.props.filtersMenuIsOpen)
            disableBodyScroll(this.filtersMenuRef.current);
        else enableBodyScroll(this.filtersMenuRef.current);
    }

    render() {
        return (
            <div
                ref={this.filtersMenuRef}
                className={
                    (this.props.filtersMenuIsOpen ? "open " : "") +
                    "filters_menu fixed bottom-0 left-0 w-full z-10 bg-white"
                }
            ></div>
        );
    }
}

export default FiltersMenu;
