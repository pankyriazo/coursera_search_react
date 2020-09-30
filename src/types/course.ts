export type Course = {
    allLanguageCodes: string[];
    avgLearningHours: number;
    avgProductRating: number;
    enrollments: number;
    entityType:
        | "PROFESSIONAL CERTIFICATE"
        | "DEGREE"
        | "MASTERTRACK"
        | "RHYME PROJECT"
        | "SPECIALIZATION"
        | "COURSE";
    imageUrl: string;
    isCourseFree: boolean;
    isPartOfCourseraPlus: boolean;
    language: string;
    name: string;
    numProductRatings: number;
    objectID: string;
    objectUrl: string;
    partnerLogos: string[];
    partners: string[];
    productDifficultyLevel: string;
    skills: string[];
    subtitleLanguage: string[];
    tagline: string;
};
