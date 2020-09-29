import React from "react";

type CoursesLengthProps = {
    length: number;
};

const CoursesLength = (props: CoursesLengthProps) => {
    return (
        <h4 className="p-1 text-xs text-center bg-gray-100 z-20 shadow">
            Courses: {props.length}
        </h4>
    );
};

export default CoursesLength;
