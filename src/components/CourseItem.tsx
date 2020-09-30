import React from "react";
import { Course } from "../types/course";
import "./CourseItem.scss";

type CourseItemProps = {
    course: Course;
    style: any;
};

const CourseItem = (props: CourseItemProps) => (
    <div style={props.style}>
        <a
            href={"https://www.coursera.org" + props.course.objectUrl}
            title={props.course.name}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white shadow rounded"
        >
            <div className="text-lg font-semibold text-black truncate">
                {props.course.name}
            </div>
            <div className="text-sm my-1 text-red-500 font-semibold truncate">
                {props.course.partners.join(" | ")}
            </div>
            <div
                className={
                    "course_type text-blue-500 text-xs font-normal " +
                    props.course.entityType.toLowerCase().replace(" ", "_")
                }
            >
                {props.course.entityType
                    .split(" ")
                    .map((word) =>
                        word
                            .split("")
                            .map((letter, index) =>
                                index === 0
                                    ? letter.toUpperCase()
                                    : letter.toLowerCase()
                            )
                            .join("")
                    )
                    .join(" ")}
            </div>
        </a>
    </div>
);

export default CourseItem;