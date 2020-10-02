import React, { Component, RefObject, ChangeEvent } from "react";
import "./FiltersMenu.scss";
import { Course } from "../types/course";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Slider from "./Slider";
import Input from "./Input";
import Autocomplete from "./Autocomplete";
import AutocompleteVirtual from "./AutocompleteVirtual";
import toCamelcase from "../utilities/toCamelcase";
import { of, Subject } from "rxjs";
import {
    distinctUntilChanged,
    switchMap,
    take,
    tap,
    debounceTime,
} from "rxjs/operators";
import search from "../utilities/search";
import { Filter } from "../types/filter";

type FiltersMenuProps = {
    filtersMenuIsOpen: boolean;
    filtersMenuSetState: ({
        filters,
        courses,
        coursesNum,
        loading,
    }: {
        filters?: Filter[];
        courses?: Course[];
        coursesNum?: number;
        loading?: boolean;
    }) => void;
    searchQuery: string;
    partners: { name: string; courses: number }[];
    skills: { name: string; courses: number }[];
    productDifficultyLevel: { name: string; courses: number }[];
    language: { name: string; courses: number }[];
    careers: { name: string; courses: number }[];
    entityType: { name: string; courses: number }[];
    isPartOfCourseraPlus: { name: string; courses: number }[];
    subtitleLanguage: { name: string; courses: number }[];
    topic: { name: string; courses: number }[];
    numProductRatings: { min: number; max: number };
    enrollments: { min: number; max: number };
    avgLearningHours: { min: number; max: number };
};

type FiltersMenuState = {
    filters: Filter[];
};

const AverageRatingMarks = [
    {
        value: 0,
    },
    {
        value: 1,
    },
    {
        value: 2,
    },
    {
        value: 3,
    },
    {
        value: 4,
    },
    {
        value: 5,
    },
];

class FiltersMenu extends Component<FiltersMenuProps, FiltersMenuState> {
    filtersMenuRef: RefObject<any>;
    averageRatingSubject$: Subject<number[]>;
    numericInputSubject$: Subject<[string, number, string]>;
    autocompleteInputSubject$: Subject<[string, string[]]>;
    booleanInputSubject$: Subject<[string, boolean[]]>;

    constructor(props: FiltersMenuProps) {
        super(props);

        this.filtersMenuRef = React.createRef();
        this.state = {
            filters: [],
        };

        this.averageRatingSubject$ = new Subject<number[]>();
        this.averageRatingSubject$
            .pipe(
                distinctUntilChanged(),
                switchMap(([min, max]) => {
                    this.setState(
                        (state) => {
                            return {
                                filters: state.filters
                                    .filter(
                                        (filter) =>
                                            filter.name !== "avgProductRating"
                                    )
                                    .concat([
                                        {
                                            name: "avgProductRating",
                                            type: "numeric",
                                            value: `avgProductRating < ${max}`,
                                        } as Filter,
                                        {
                                            name: "avgProductRating",
                                            type: "numeric",
                                            value: `avgProductRating > ${min}`,
                                        } as Filter,
                                    ]),
                            };
                        },
                        () => {
                            this.update();
                        }
                    );
                    return of([]);
                })
            )
            .subscribe();

        this.numericInputSubject$ = new Subject<[string, number, string]>();
        this.numericInputSubject$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(([name, value, operator]) => {
                    this.setState(
                        (state) => {
                            return {
                                filters: state.filters
                                    .filter(
                                        (filter) =>
                                            filter.name !== name ||
                                            (filter.name === name &&
                                                !filter.value.includes(
                                                    operator
                                                ))
                                    )
                                    .concat(
                                        isNaN(value)
                                            ? []
                                            : [
                                                  {
                                                      name,
                                                      type: "numeric",
                                                      value: `${name} ${operator} ${value}`,
                                                  } as Filter,
                                              ]
                                    ),
                            };
                        },
                        () => {
                            this.update();
                        }
                    );
                    return of([]);
                })
            )
            .subscribe();

        this.autocompleteInputSubject$ = new Subject<[string, string[]]>();
        this.autocompleteInputSubject$
            .pipe(
                distinctUntilChanged(),
                switchMap(([name, value]) => {
                    const selectedInputsAsArray: Filter[] = value.map(
                        (selectedInput) =>
                            ({
                                name,
                                type: "categorical",
                                value: `${name}:'${selectedInput}'`,
                            } as Filter)
                    );
                    this.setState(
                        (state) => {
                            return {
                                filters: state.filters
                                    .filter((filter) => filter.name !== name)
                                    .concat(selectedInputsAsArray),
                            };
                        },
                        () => {
                            this.update();
                        }
                    );
                    return of([]);
                })
            )
            .subscribe();

        this.booleanInputSubject$ = new Subject<[string, boolean[]]>();
        this.booleanInputSubject$
            .pipe(
                distinctUntilChanged(),
                switchMap(([name, value]) => {
                    const selectedInputsAsArray: Filter[] = value.map(
                        (selectedInput) =>
                            ({
                                name,
                                type: "categorical",
                                value: `${name}:${selectedInput}`,
                            } as Filter)
                    );
                    this.setState(
                        (state) => {
                            return {
                                filters: state.filters
                                    .filter((filter) => filter.name !== name)
                                    .concat(selectedInputsAsArray),
                            };
                        },
                        () => {
                            this.update();
                        }
                    );
                    return of([]);
                })
            )
            .subscribe();
    }

    async componentDidUpdate() {
        if (this.props.filtersMenuIsOpen)
            disableBodyScroll(this.filtersMenuRef.current);
        else enableBodyScroll(this.filtersMenuRef.current);
    }

    componentWillUnmount() {
        this.averageRatingSubject$.unsubscribe();
        this.numericInputSubject$.unsubscribe();
        this.booleanInputSubject$.unsubscribe();
    }

    updateAverageRating = (
        event: React.ChangeEvent<{}>,
        value: number | number[]
    ): void => {
        this.averageRatingSubject$.next(value as number[]);
    };

    updateNumericInput = (
        name: string,
        value: string,
        operator: string
    ): void => {
        try {
            this.numericInputSubject$.next([
                name,
                parseInt(value),
                operator === "min" ? ">=" : "<=",
            ]);
        } catch (error) {}
    };

    updateAutocompleteInput = (name: string, value: string[]): void => {
        this.autocompleteInputSubject$.next([name, value]);
    };

    updateBooleanInput = (name: string, value: boolean[]): void => {
        this.booleanInputSubject$.next([name, value]);
    };

    update = (): void => {
        this.props.filtersMenuSetState({ loading: true });
        search(this.props.searchQuery, this.state.filters)
            .pipe(
                take(1),
                tap((results) => {
                    this.props.filtersMenuSetState({
                        courses: results.hits as Course[],
                        coursesNum: results.nbHits,
                        loading: false,
                        filters: this.state.filters,
                    });
                })
            )
            .subscribe();
    };

    render() {
        return (
            <div
                ref={this.filtersMenuRef}
                className={
                    (this.props.filtersMenuIsOpen ? "open " : "") +
                    "filters_menu fixed bottom-0 left-0 w-full z-10 bg-white p-4 overflow-y-auto pb-32 flex flex-col shadow-lg"
                }
            >
                <div className="input_group">
                    <div className="label text-xs text-gray-600">
                        Average rating [
                        {this.state.filters.filter(
                            (filter) => filter.name === "avgProductRating"
                        ).length < 2
                            ? "0, 5"
                            : this.state.filters
                                  .filter(
                                      (filter) =>
                                          filter.name === "avgProductRating"
                                  )
                                  .map((filter) => +filter.value.split(" ")[2])

                                  .sort()
                                  .join(", ")}
                        ]
                    </div>
                    <div className="slider mt-2">
                        <Slider
                            min={0}
                            max={5}
                            step={0.01}
                            defaultValue={[0, 5]}
                            marks={AverageRatingMarks}
                            onChangeCommitted={this.updateAverageRating}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Number of ratings
                    </div>
                    <div className="inputs flex align-center justify-center">
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "numProductRatings",
                                    e.target.value,
                                    "min"
                                )
                            }
                            placeholder={`Min (${this.props.numProductRatings.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "numProductRatings",
                                    e.target.value,
                                    "max"
                                )
                            }
                            placeholder={`Max (${this.props.numProductRatings.max})`}
                            type="tel"
                        />
                    </div>
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Enrollments
                    </div>
                    <div className="inputs flex align-center justify-center">
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "enrollments",
                                    e.target.value,
                                    "min"
                                )
                            }
                            placeholder={`Min (${this.props.enrollments.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "enrollments",
                                    e.target.value,
                                    "max"
                                )
                            }
                            placeholder={`Max (${this.props.enrollments.max})`}
                            type="tel"
                        />
                    </div>
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Average learning hours
                    </div>
                    <div className="inputs flex align-center justify-center">
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "avgLearningHours",
                                    e.target.value,
                                    "min"
                                )
                            }
                            placeholder={`Min (${this.props.avgLearningHours.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
                            onChange={(e) =>
                                this.updateNumericInput(
                                    "avgLearningHours",
                                    e.target.value,
                                    "max"
                                )
                            }
                            placeholder={`Max (${this.props.avgLearningHours.max})`}
                            type="tel"
                        />
                    </div>
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Language</div>
                    <Autocomplete
                        multiple
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "language",
                                value as string[]
                            );
                        }}
                        options={this.props.language
                            .map((language) => language.name)
                            .sort()}
                        renderInput={(params) => (
                            <div className="input w-full">
                                <Input {...params} type="text" />
                            </div>
                        )}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Difficulty level
                    </div>
                    <Autocomplete
                        multiple
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "productDifficultyLevel",
                                value as string[]
                            );
                        }}
                        options={this.props.productDifficultyLevel
                            .map(
                                (productDifficultyLevel) =>
                                    productDifficultyLevel.name
                            )
                            .sort()}
                        renderInput={(params) => (
                            <div className="input w-full">
                                <Input {...params} type="text" />
                            </div>
                        )}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Type</div>
                    <Autocomplete
                        multiple
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "entityType",
                                value as string[]
                            );
                        }}
                        options={this.props.entityType
                            .map((type) => toCamelcase(type.name))
                            .sort()}
                        renderInput={(params) => (
                            <div className="input w-full">
                                <Input {...params} type="text" />
                            </div>
                        )}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Partners</div>
                    <AutocompleteVirtual
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "partners",
                                value as string[]
                            );
                        }}
                        data={this.props.partners
                            .map((partner) => partner.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Skills</div>
                    <AutocompleteVirtual
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "skills",
                                value as string[]
                            );
                        }}
                        data={this.props.skills
                            .map((skill) => skill.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Careers</div>
                    <AutocompleteVirtual
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "careers",
                                value as string[]
                            );
                        }}
                        data={this.props.careers
                            .map((career) => career.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Subtitle Language
                    </div>
                    <AutocompleteVirtual
                        onChange={(event, value, reason) => {
                            this.updateAutocompleteInput(
                                "subtitleLanguage",
                                value as string[]
                            );
                        }}
                        data={this.props.subtitleLanguage
                            .map((subtitleLanguage) => subtitleLanguage.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">
                        Is part of Coursera Plus
                    </div>
                    <Autocomplete
                        multiple
                        onChange={(event, value, reason) => {
                            this.updateBooleanInput(
                                "isPartOfCourseraPlus",
                                (value as string[]).map(
                                    (value) => value === "Yes"
                                )
                            );
                        }}
                        options={["Yes", "No"]}
                        renderInput={(params) => (
                            <div className="input w-full">
                                <Input {...params} type="text" />
                            </div>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default FiltersMenu;
