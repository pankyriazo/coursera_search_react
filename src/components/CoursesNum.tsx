import React from "react";
import "./CoursesNum.scss";

type CoursesNumProps = {
    coursesNum: number;
};

const CoursesNum = (props: CoursesNumProps) => {
    return (
        <h4 className="absolute w-full p-1 text-xs text-center bg-gray-100 z-20 shadow lg:relative lg:shadow-none lg:bg-transparent lg:text-lg lg:text-left lg:text-gray-600">
            {props.coursesNum} Courses
        </h4>
    );
};

export default CoursesNum;
