import React, { Component, RefObject } from "react";
import "./FiltersMenu.scss";
import { Course } from "../types/course";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Slider from "./Slider";
import Input from "./Input";
import Autocomplete from "./Autocomplete";
import AutocompleteVirtual from "./AutocompleteVirtual";
import Checkbox from "./Checkbox";
import toCamelcase from "../utilities/toCamelcase";
import { of, Subject } from "rxjs";
import { distinctUntilChanged, switchMap, take, tap } from "rxjs/operators";
import search from "../utilities/search";
import { Filter } from "../types/filter";

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
                    this.setState((state) => {
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
                    });
                    this.update();
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
    }

    updateAverageRating = (
        event: React.ChangeEvent<{}>,
        value: number | number[]
    ): void => {
        this.averageRatingSubject$.next(value as number[]);
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
                            placeholder={`Min (${this.props.numProductRatings.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
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
                            placeholder={`Min (${this.props.enrollments.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
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
                            placeholder={`Min (${this.props.avgLearningHours.min})`}
                            type="tel"
                        />
                        <span className="inline-block text-gray-300 mx-4 mt-1">
                            /
                        </span>
                        <Input
                            placeholder={`Max (${this.props.avgLearningHours.max})`}
                            type="tel"
                        />
                    </div>
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Language</div>
                    <Autocomplete
                        multiple
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
                        data={this.props.partners
                            .map((partner) => partner.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Skills</div>
                    <AutocompleteVirtual
                        data={this.props.skills
                            .map((skill) => skill.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <div className="label text-xs text-gray-600">Careers</div>
                    <AutocompleteVirtual
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
                        data={this.props.subtitleLanguage
                            .map((subtitleLanguage) => subtitleLanguage.name)
                            .sort()}
                    />
                </div>
                <div className="input_group mt-8">
                    <Checkbox
                        label="Is part of Coursera Plus"
                        labelPlacement="start"
                    />
                </div>
            </div>
        );
    }
}

export default FiltersMenu;
