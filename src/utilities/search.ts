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
                    .reduce((categorizedFilters, currentFilter) => {
                        const currentFilterCategory = categorizedFilters.find(
                            (filter) => filter.name === currentFilter.name
                        );
                        if (!currentFilterCategory)
                            categorizedFilters.push({
                                name: currentFilter.name,
                                type: currentFilter.type,
                                values: [currentFilter.value],
                            });
                        else
                            currentFilterCategory.values.push(
                                currentFilter.value
                            );

                        return categorizedFilters;
                    }, [] as { name: string; type: "categorical" | "numeric"; values: string[] }[])
                    .map(
                        (filterCategory) =>
                            `(${filterCategory.values.join(" OR ")})`
                    )
                    .join(" AND "),
                numericFilters: filters
                    .filter((filter) => filter.type === "numeric")
                    .map((filter) => filter.value),
                maxValuesPerFacet: 1000,
                hitsPerPage: 1000,
            })
    );
};

export default search;
