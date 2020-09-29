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
            style={{
                ...style,
                left: style.left + 8,
                top: style.top + 8,
                width: "calc(100% - 1rem)",
            }}
        />
    );
    render() {
        return this.props.coursesLength > 0 ? (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        className="List overflow-y-auto pb-20 z-0"
                        height={height - (56 + 26)}
                        itemCount={this.props.coursesLength}
                        itemSize={106}
                        width={width}
                    >
                        {this.item}
                    </List>
                )}
            </AutoSizer>
        ) : (
            <h2 className="text-center mt-8">No courses found</h2>
        );
    }
}

export default CourseList;
