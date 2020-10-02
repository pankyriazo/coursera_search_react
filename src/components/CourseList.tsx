import React, { Component } from "react";
import { Course } from "../types/course";
import CourseItem from "./CourseItem";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type CourseListsProps = {
    courses: Course[];
    coursesNum: number;
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
        return this.props.coursesNum > 0 ? (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        className="List pb-20 lg:pb-0"
                        height={height - (window.innerWidth < 1024 ? 82 : 180)}
                        itemCount={this.props.coursesNum}
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
