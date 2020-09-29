import React, { Component, RefObject } from "react";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs/operators";

type SearchProps = {
    updateSearch: Function;
};

class Search extends Component<SearchProps> {
    inputRef: RefObject<HTMLInputElement>;
    inputSubscription: Subscription | undefined;

    constructor(props: SearchProps) {
        super(props);

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.inputSubscription = fromEvent(this.inputRef.current!, "input")
            .pipe(
                map((event: Event) => (event.target as HTMLInputElement).value),
                debounceTime(500),
                distinctUntilChanged(),
                tap((value) => this.props.updateSearch(value))
            )
            .subscribe();
    }

    componentWillUnmount() {
        this.inputSubscription!.unsubscribe();
    }

    render() {
        return (
            <div className="search w-full p-2 bg-blue-500 z-30">
                <input
                    ref={this.inputRef}
                    type="text"
                    className="w-full rounded py-2 px-3 font-normal"
                    placeholder="Search..."
                />
            </div>
        );
    }
}

export default Search;
