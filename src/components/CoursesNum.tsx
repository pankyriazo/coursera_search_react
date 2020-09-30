import React from "react";

type CoursesNumProps = {
    coursesNum: number;
};

const CoursesNum = (props: CoursesNumProps) => {
    return (
        <h4 className="p-1 text-xs text-center bg-gray-100 z-20 shadow">
            {props.coursesNum} Courses
        </h4>
    );
};

export default CoursesNum;
