import React, { Component, RefObject } from "react";
import "./App.scss";
import Loader from "./components/Loader";
import algoliasearch from "algoliasearch";
import { Course } from "./interfaces/course";
import { Data } from "./interfaces/data";
import CourseList from "./components/CourseList";
import FiltersButton from "./components/FiltersButton";
import FiltersMenu from "./components/FiltersMenu";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Search from "./components/Search";

type SearchResults = {
    hits: Course[];
    nbHits: number;
    facets: {
        language: {};
        partners: {};
        productDifficultyLevel: {};
        skills: {};
    };
};

type AppState = {
    loading: boolean;
    filtersOpen: boolean;
    data: Data;
    searchData: {
        searchActive: boolean;
        courses: Course[];
    };
};

class App extends Component<{}, AppState> {
    filtersRef: RefObject<any>;
    search: Function;

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
        if (value === "") {
            this.setState({
                searchData: {
                    searchActive: false,
                    courses: [],
                },
            });
        } else {
            this.setState({
                loading: true,
            });
            this.search(value, {
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
                .then((results: SearchResults) => {
                    this.setState({
                        loading: false,
                    });
                    this.setState({
                        searchData: {
                            searchActive: true,
                            courses: results.hits,
                        },
                        loading: false,
                    });
                })
                .catch((err: Error) => console.log(err));
        }
    };

    render() {
        return (
            <div className="App flex flex-col overflow-hidden h-screen bg-gray-200">
                <Loader loading={this.state.loading} />
                <Search updateSearch={this.updateSearch} />
                <CourseList
                    courses={
                        this.state.searchData.searchActive
                            ? this.state.searchData.courses
                            : this.state.data.courses
                    }
                    coursesLength={
                        this.state.searchData.searchActive
                            ? this.state.searchData.courses.length
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
