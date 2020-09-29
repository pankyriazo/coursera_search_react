import React, { Component } from "react";
import { Course } from "../interfaces/course";
import CourseItem from "./CourseItem";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type CourseListsProps = {
    courses: Course[];
    coursesLength: number;
};

class CourseList extends Component<CourseListsProps> {
    item = ({ index, style }: { index: number; style: any }) => (
        <CourseItem
            course={this.props.courses[index]}
            key={this.props.courses[index].objectID}
            style={style}
        />
    );
    render() {
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        className="List pt-2 pb-20 overflow-y-auto"
                        height={height}
                        itemCount={this.props.coursesLength}
                        itemSize={98}
                        width={width}
                    >
                        {this.item}
                    </List>
                )}
            </AutoSizer>
            /* <ul className="flex flex-col pt-2 pb-20 overflow-y-auto">
                    {this.props.coursesLength > 0 ? (
                        this.props.courses
                            .slice(0, 10)
                            .map((course) => (
                                <CourseItem
                                    course={course}
                                    key={course.objectID}
                                />
                            ))
                    ) : (
                        <h2 className="text-center mt-8">No courses found</h2>
                    )}
                </ul> */
        );
    }
}

export default CourseList;
