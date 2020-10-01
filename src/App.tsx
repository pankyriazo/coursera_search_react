import React, { Component } from "react";
import "./App.scss";
import Loader from "./components/Loader";
import { Course } from "./types/course";
import CourseList from "./components/CourseList";
import FiltersButton from "./components/FiltersButton";
import FiltersMenu from "./components/FiltersMenu";
import Search from "./components/Search";
import search from "./utilities/search";
import CoursesNum from "./components/CoursesNum";
import { tap, take } from "rxjs/operators";
import { Filter } from "./types/filter";
import { of } from "rxjs";

type AllData = {
    courses: Course[];
    coursesNum: number;
    partners: { name: string; courses: number }[];
    skills: { name: string; courses: number }[];
    productDifficultyLevel: { name: string; courses: number }[];
    language: { name: string; courses: number }[];
    careers: { name: string; courses: number }[];
    entityType: { name: string; courses: number }[];
    isPartOfCourseraPlus: { name: string; courses: number }[];
    subtitleLanguage: { name: string; courses: number }[];
    topic: { name: string; courses: number }[];
    enrollments: { min: number; max: number };
    avgLearningHours: { min: number; max: number };
    numProductRatings: { min: number; max: number };
};

type AppState = {
    loading: boolean;
    filtersMenuIsOpen: boolean;
    courses: Course[];
    coursesNum: number;
    search: {
        query: string;
        filters: Filter[];
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
            productDifficultyLevel: [],
            language: [],
            careers: [],
            entityType: [],
            isPartOfCourseraPlus: [],
            subtitleLanguage: [],
            topic: [],
            enrollments: { min: 0, max: 0 },
            avgLearningHours: { min: 0, max: 0 },
            numProductRatings: { min: 0, max: 0 },
        };

        this.state = {
            loading: true,
            filtersMenuIsOpen: true,
            courses: [],
            coursesNum: 0,
            search: {
                query: "",
                filters: [],
            },
        };
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = (): void => {
        search("", [], ["*"])
            .pipe(
                take(1),
                tap((results) => {
                    this.allData.courses = results.hits as Course[];
                    this.allData.coursesNum = results.nbHits;
                    [
                        "partners",
                        "skills",
                        "productDifficultyLevel",
                        "language",
                        "careers",
                        "entityType",
                        "isPartOfCourseraPlus",
                        "subtitleLanguage",
                        "topic",
                    ].forEach((facet) => {
                        if (!results.facets || !results.facets![facet]) return;

                        this.allData[facet] = Object.keys(
                            results.facets![facet]
                        ).map((name) => ({
                            name,
                            courses: results.facets![facet][name],
                        }));
                    });

                    if (results.facets && results.facets.enrollments) {
                        of(
                            Object.keys(results.facets.enrollments).map(
                                (enrollment: string) => +enrollment
                            )
                        )
                            .pipe(
                                take(1),
                                tap((enrollments) => {
                                    this.allData.enrollments = {
                                        max: Math.max(...enrollments),
                                        min: Math.min(...enrollments),
                                    };
                                })
                            )
                            .subscribe();
                    }

                    if (results.facets && results.facets.avgLearningHours) {
                        of(
                            Object.keys(results.facets.avgLearningHours).map(
                                (enrollment: string) => +enrollment
                            )
                        )
                            .pipe(
                                take(1),
                                tap((avgLearningHours) => {
                                    this.allData.avgLearningHours = {
                                        max: Math.max(...avgLearningHours),
                                        min: Math.min(...avgLearningHours),
                                    };
                                })
                            )
                            .subscribe();
                    }

                    if (results.facets && results.facets.numProductRatings) {
                        of(
                            Object.keys(results.facets.numProductRatings).map(
                                (enrollment: string) => +enrollment
                            )
                        )
                            .pipe(
                                take(1),
                                tap((numProductRatings) => {
                                    this.allData.numProductRatings = {
                                        max: Math.max(...numProductRatings),
                                        min: Math.min(...numProductRatings),
                                    };
                                })
                            )
                            .subscribe();
                    }

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
        query,
        courses,
        coursesNum,
        loading,
        reset,
    }: {
        query?: string;
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
                          query: "",
                          filters: [],
                      },
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
                      search: {
                          ...state.search,
                          query:
                              query === undefined ? state.search.query : query,
                      },
                  }
        );
    };

    filtersMenuSetState = ({
        filters,
        courses,
        coursesNum,
        loading,
        reset,
    }: {
        filters?: Filter[];
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
                          query: "",
                          filters: [],
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
                          ...state.search,
                          filters:
                              filters === undefined
                                  ? state.search.filters
                                  : filters,
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
                <Search
                    searchSetState={this.searchSetState}
                    filters={this.state.search.filters}
                />
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
                    searchQuery={this.state.search.query}
                    partners={this.allData.partners}
                    skills={this.allData.skills}
                    productDifficultyLevel={this.allData.productDifficultyLevel}
                    language={this.allData.language}
                    careers={this.allData.careers}
                    entityType={this.allData.entityType}
                    isPartOfCourseraPlus={this.allData.isPartOfCourseraPlus}
                    subtitleLanguage={this.allData.subtitleLanguage}
                    topic={this.allData.topic}
                    enrollments={this.allData.enrollments}
                    avgLearningHours={this.allData.avgLearningHours}
                    numProductRatings={this.allData.numProductRatings}
                />
            </div>
        );
    }
}

export default App;
