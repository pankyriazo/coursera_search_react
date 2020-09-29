import React, { Component, RefObject } from "react";
import "./App.scss";
import Loader from "./components/Loader";
import algoliasearch from "algoliasearch";
import { Course } from "./interfaces/course";
import CourseList from "./components/CourseList";
import FiltersButton from "./components/FiltersButton";
import FiltersMenu from "./components/FiltersMenu";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Search from "./components/Search";
import { of, Subscription } from "rxjs";
import { tap, switchMap } from "rxjs/operators";
import CoursesLength from "./components/CoursesLength";

interface SearchResults {
    hits: Course[];
    nbHits: number;
    facets: {
        language: {};
        partners: {};
        productDifficultyLevel: {};
        skills: {};
    };
}

interface Data {
    courses: Course[];
    coursesLength: number;
    partners: { name: string; courses: number }[];
    skills: { name: string; courses: number }[];
    productDifficultyLevel: { name: string; courses: number }[];
    language: { name: string; courses: number }[];
}

interface AppState {
    loading: boolean;
    filtersOpen: boolean;
    data: Data;
    searchData: {
        searchActive: boolean;
        courses: Course[];
        coursesLength: number;
    };
}

class App extends Component<{}, AppState> {
    filtersRef: RefObject<any>;
    search: Function;
    searchChangeSubscription: Subscription | undefined;

    constructor(props: {}) {
        super(props);

        this.search = algoliasearch(
            "LUA9B20G37",
            "dcc55281ffd7ba6f24c3a9b18288499b"
        ).initIndex("prod_all_products").search;

        this.filtersRef = React.createRef();

        this.state = {
            loading: true,
            filtersOpen: false,
            data: {
                courses: [],
                coursesLength: 0,
                partners: [],
                skills: [],
                productDifficultyLevel: [],
                language: [],
            },
            searchData: {
                searchActive: false,
                courses: [],
                coursesLength: 0,
            },
        };
    }

    componentDidMount() {
        this.search("", {
            facets: [
                "partners",
                "skills",
                "language",
                "productDifficultyLevel",
            ],
            maxValuesPerFacet: 1000,
            hitsPerPage: 1000,
        })
            .then((results: SearchResults) => {
                this.setState({
                    data: {
                        courses: results.hits,
                        coursesLength: results.nbHits,
                        partners: Object.keys(results.facets!.partners).map(
                            (name) => ({
                                name,
                                courses: results.facets!.partners[name],
                            })
                        ),
                        skills: Object.keys(results.facets!.skills).map(
                            (name) => ({
                                name,
                                courses: results.facets!.skills[name],
                            })
                        ),
                        productDifficultyLevel: Object.keys(
                            results.facets!.productDifficultyLevel
                        ).map((name) => ({
                            name,
                            courses: results.facets!.productDifficultyLevel[
                                name
                            ],
                        })),
                        language: Object.keys(results.facets!.language).map(
                            (name) => ({
                                name,
                                courses: results.facets!.language[name],
                            })
                        ),
                    },
                    loading: false,
                });
            })
            .catch((err: Error) => console.log(err));
    }

    componentWillUnmount() {
        this.searchChangeSubscription!.unsubscribe();
    }

    toggleFiltersStatus = () => {
        this.setState((state) => {
            (async () => {
                if (state.filtersOpen)
                    enableBodyScroll(this.filtersRef.current);
                else disableBodyScroll(this.filtersRef.current);
            })();

            return {
                filtersOpen: !state.filtersOpen,
            };
        });
    };

    updateSearch = (value: string) => {
        this.searchChangeSubscription = of(value)
            .pipe(
                switchMap((value) => {
                    if (value === "") return of(null);

                    this.setState({
                        loading: true,
                    });

                    return this.search(value, {
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
                    });
                }),
                tap((results: any) => {
                    if (!results) {
                        this.setState({
                            searchData: {
                                searchActive: false,
                                courses: [],
                                coursesLength: 0,
                            },
                        });
                    } else {
                        this.setState({
                            searchData: {
                                searchActive: true,
                                courses: results.hits,
                                coursesLength: results.nbHits,
                            },
                            loading: false,
                        });
                    }
                })
            )
            .subscribe();
    };

    render() {
        return (
            <div className="App flex flex-col overflow-hidden h-screen bg-gray-200">
                <Loader loading={this.state.loading} />
                <Search updateSearch={this.updateSearch} />
                <CoursesLength
                    length={
                        this.state.searchData.searchActive
                            ? this.state.searchData.coursesLength
                            : this.state.data.coursesLength
                    }
                />
                <CourseList
                    courses={
                        this.state.searchData.searchActive
                            ? this.state.searchData.courses
                            : this.state.data.courses
                    }
                    coursesLength={
                        this.state.searchData.searchActive
                            ? this.state.searchData.coursesLength
                            : this.state.data.coursesLength
                    }
                />
                <FiltersMenu
                    ref={this.filtersRef}
                    filtersOpen={this.state.filtersOpen}
                    updateFilters={this.toggleFiltersStatus}
                />
                <FiltersButton
                    filtersOpen={this.state.filtersOpen}
                    toggleFiltersStatus={this.toggleFiltersStatus}
                />
            </div>
        );
    }
}

export default App;
