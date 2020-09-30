import React, { Component } from "react";
import "./App.scss";
import Loader from "./components/Loader";
import algoliasearch from "algoliasearch";
import { Course } from "./types/course";
import CourseList from "./components/CourseList";
import FiltersButton from "./components/FiltersButton";
import FiltersMenu from "./components/FiltersMenu";
import Search from "./components/Search";
import { from } from "rxjs";
import { tap, take } from "rxjs/operators";
import CoursesNum from "./components/CoursesNum";
import { SearchResponse } from "@algolia/client-search";

type AllData = {
    courses: Course[];
    coursesNum: number;
    partners: { name: string; courses: number }[];
    skills: { name: string; courses: number }[];
    productDifficultyLevels: { name: string; courses: number }[];
    language: { name: string; courses: number }[];
};

type SearchOptions = {
    query: string;
};

type AppState = {
    loading: boolean;
    filtersMenuIsOpen: boolean;
    courses: Course[];
    coursesNum: number;

    // In the case the user searches for a value and then applies additional filters.
    // If then the filters are removed, the courses must return to the ones limited to the search value and not to the allData ones.
    search: {
        courses: Course[];
        coursesNum: number;
    };
};

class App extends Component<{}, AppState> {
    allData: AllData;

    constructor(props: {}) {
        super(props);

        this.allData = {
            courses: [],
            coursesNum: 0,
            partners: [],
            skills: [],
            productDifficultyLevels: [],
            language: [],
        };

        this.state = {
            loading: true,
            filtersMenuIsOpen: false,
            courses: [],
            coursesNum: 0,
            search: {
                courses: [],
                coursesNum: 0,
            },
        };
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = (): void => {
        from(
            algoliasearch(
                process.env.REACT_APP_ALGOLIA_APP_ID!,
                process.env.REACT_APP_ALGOLIA_API_KEY!
            )
                .initIndex("prod_all_products")
                .search("", {
                    facets: ["*"],
                    // facets: [
                    //     "partners",
                    //     "skills",
                    //     "language",
                    //     "productDifficultyLevel",
                    //     "isCourseFree",
                    // ],
                    // filters: `isCourseFree:true`,
                    // numericFilters: [
                    //     "avgProductRating > 4.95",
                    //     "numProductRatings > 100",
                    // ],
                    maxValuesPerFacet: 1000,
                    hitsPerPage: 1000,
                })
        )
            .pipe(
                take(1),
                tap((results: SearchResponse<unknown>) => {
                    console.log(results);
                    this.allData = {
                        courses: results.hits as Course[],
                        coursesNum: results.nbHits,
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
                        productDifficultyLevels: Object.keys(
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
                    };
                    this.setState({
                        loading: false,
                        courses: this.allData.courses,
                        coursesNum: this.allData.coursesNum,
                    });
                })
            )
            .subscribe();
    };

    searchSetState = ({
        courses,
        coursesNum,
        loading,
        reset,
    }: {
        courses?: Course[];
        coursesNum?: number;
        loading?: boolean;
        reset?: boolean;
    }): void => {
        this.setState((state) =>
            reset
                ? {
                      courses: this.allData.courses,
                      coursesNum: this.allData.coursesNum,
                      loading: false,
                  }
                : {
                      courses:
                          courses === undefined
                              ? this.allData.courses
                              : courses,
                      coursesNum:
                          coursesNum === undefined
                              ? state.coursesNum
                              : coursesNum,
                      loading: loading === undefined ? state.loading : loading,
                  }
        );
    };

    filtersMenuSetState = ({
        courses,
        coursesNum,
        loading,
        reset,
    }: {
        courses?: Course[];
        coursesNum?: number;
        loading?: boolean;
        reset?: boolean;
    }): void => {
        this.setState((state) =>
            reset
                ? {
                      courses: this.allData.courses,
                      coursesNum: this.allData.coursesNum,
                      loading: false,
                      search: {
                          courses: [],
                          coursesNum: 0,
                      },
                  }
                : {
                      courses: courses === undefined ? state.courses : courses,
                      coursesNum:
                          coursesNum === undefined
                              ? state.coursesNum
                              : coursesNum,
                      loading: loading === undefined ? state.loading : loading,
                      search: {
                          courses:
                              courses === undefined ? state.courses : courses,
                          coursesNum:
                              coursesNum === undefined
                                  ? state.coursesNum
                                  : coursesNum,
                      },
                  }
        );
    };

    toggleFiltersMenuStatus = (): void => {
        this.setState((state) => {
            return {
                filtersMenuIsOpen: !state.filtersMenuIsOpen,
            };
        });
    };

    render() {
        return (
            <div className="App flex flex-col overflow-hidden h-screen bg-gray-200">
                <Loader loading={this.state.loading} />
                <Search searchSetState={this.searchSetState} />
                <CoursesNum coursesNum={this.state.coursesNum} />
                <CourseList
                    courses={this.state.courses}
                    coursesNum={this.state.coursesNum}
                />
                <FiltersButton
                    filtersMenuIsOpen={this.state.filtersMenuIsOpen}
                    toggleFiltersMenuStatus={this.toggleFiltersMenuStatus}
                />
                <FiltersMenu
                    filtersMenuIsOpen={this.state.filtersMenuIsOpen}
                    filtersMenuSetState={this.filtersMenuSetState}
                />
            </div>
        );
    }
}

export default App;
