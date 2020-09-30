import React, { Component, RefObject } from "react";
import { fromEvent, Subscription, from, of } from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    map,
    tap,
    switchMap,
} from "rxjs/operators";
import algoliasearch from "algoliasearch";
import { Course } from "../types/course";
import { SearchResponse } from "@algolia/client-search";

type SearchProps = {
    searchSetState: ({
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

class Search extends Component<SearchProps> {
    inputRef: RefObject<HTMLInputElement>;
    inputSubscription: Subscription | undefined;
    searchSubscription: Subscription | undefined;

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
                switchMap((value: string) => {
                    if (value === "") return of(null);

                    this.props.searchSetState({ loading: true });

                    return from(
                        algoliasearch(
                            process.env.REACT_APP_ALGOLIA_APP_ID!,
                            process.env.REACT_APP_ALGOLIA_API_KEY!
                        )
                            .initIndex("prod_all_products")
                            .search(value, {
                                restrictSearchableAttributes: [
                                    "name",
                                    "tagline",
                                    "partners",
                                    "skills",
                                ],
                                facets: [
                                    "partners",
                                    "skills",
                                    "language",
                                    "productDifficultyLevel",
                                ],
                                maxValuesPerFacet: 1000,
                                hitsPerPage: 1000,
                            })
                    );
                }),
                tap((results: SearchResponse<unknown> | null) => {
                    if (!results) {
                        this.props.searchSetState({
                            reset: true,
                        });
                    } else {
                        this.props.searchSetState({
                            courses: results.hits as Course[],
                            coursesNum: results.nbHits,
                            loading: false,
                        });
                    }
                })
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
