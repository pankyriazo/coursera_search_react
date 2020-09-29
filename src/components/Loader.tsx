import React, { Component } from "react";
import "./Loader.scss";

type LoaderProps = {
    loading: boolean;
};

class Loader extends Component<LoaderProps> {
    static defaultProps = {
        loading: false,
    };

    render() {
        return (
            <div
                className={
                    (this.props.loading ? "open " : "") +
                    "loader fixed z-30 top-0 left-0 w-full h-full"
                }
            >
                <div className="background absolute top-0 left-0 w-full h-full bg-gray-200"></div>
                <div className="spinner_wrapper flex w-full h-full items-center justify-center">
                    <div className="spinner w-12 h-12 p-1 border-4 border-solid border-blue-600 rounded-full animate-spin">
                        <div className="inner w-full h-full border-4 border-solid border-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loader;
