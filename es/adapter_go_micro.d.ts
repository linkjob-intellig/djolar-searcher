import { SearcherAdapter, SearchFunc } from "./searcher";
export interface SearcherGoMicroStyleResponse<T> {
    Count: number;
    Result: T[];
}
export declare const defaultGoMicroListResponse: <T>() => SearcherGoMicroStyleResponse<T>;
export declare const defaultGoMicroSearchFunc: SearchFunc<any>;
export declare const GoMicroStyleSearcherAdapter: SearcherAdapter<SearcherGoMicroStyleResponse<any>>;
