import React, { Component } from "react";
import "./App.css";
import Loader from "./components/common/Loader/Loader";

type AppState = {
    loading: boolean;
};

class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    render() {
        return (
            <div className="App">
                <Loader loading={this.state.loading}></Loader>
                <button
                    className="relative z-30"
                    onClick={() => {
                        this.setState({
                            ...this.state,
                            loading: !this.state.loading,
                        });

                        console.log(this.state.loading);
                    }}
                >
                    Toggle loading
                </button>
            </div>
        );
    }
}

export default App;
