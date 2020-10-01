import { Filter } from "../types/filter";
import { Observable, from } from "rxjs";
import algoliasearch from "algoliasearch";
import { SearchResponse } from "@algolia/client-search";

const search = (
    query: string,
    filters: Filter[],
    facets?: string[]
): Observable<SearchResponse<unknown>> => {
    return from(
        algoliasearch(
            process.env.REACT_APP_ALGOLIA_APP_ID!,
            process.env.REACT_APP_ALGOLIA_API_KEY!
        )
            .initIndex("prod_all_products")
            .search(query, {
                facets: facets || [],
                filters: filters
                    .filter((filter) => filter.type === "categorical")
                    .map(
                        (filter, index) =>
                            `${filter.name}:${filter.value}${
                                index > 0 ? " OR" : ""
                            }`
                    )
                    .join(" "),
                numericFilters: filters
                    .filter((filter) => filter.type === "numeric")
                    .map((filter) => filter.value),
                tagFilters: filters
                    .filter((filter) => filter.type === "tag")
                    .map((filter) => filter.value),
                maxValuesPerFacet: 1000,
                hitsPerPage: 1000,
            })
    );
};

export default search;
