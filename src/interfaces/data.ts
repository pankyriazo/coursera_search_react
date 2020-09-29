import { Course } from "./course";

export interface Data {
    courses: Course[];
    coursesLength: number;
    partners: { name: string; courses: number }[];
    skills: { name: string; courses: number }[];
    productDifficultyLevel: { name: string; courses: number }[];
    language: { name: string; courses: number }[];
}
