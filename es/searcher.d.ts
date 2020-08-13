import { DjolarField } from "./djolar";
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export interface SearcherSortBy {
    name: string;
    descend?: boolean;
}
export interface SearcherResponse<T = any> {
    result: T[];
    count: number;
    msg?: string;
}
export interface SearcherPagination {
    sortBy: SearcherSortBy[];
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
}
export declare function createSearcherPagination(initialRowsPerPage?: number): {
    sortBy: any[];
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
};
export declare type SearcherPaginationOptions = Partial<SearcherPagination>;
export interface SearcherResolves<T = any> {
    response: SearcherResponse<T> | any;
    axiosResponse?: AxiosResponse | any;
}
export interface SearchOption {
    listUrl: string;
    filter: Record<string, DjolarField>;
    config: AxiosRequestConfig;
    extraQuery: Record<string, any>;
    extraData: Record<string, any>;
    pagination: SearcherPaginationOptions;
}
export declare type SearchOptions = Partial<SearchOption>;
export interface SearcherContextOptions<T = any> {
    pagination?: SearcherPaginationOptions;
    globalSearchOption?: SearchOptions;
    searchFunc?: SearchFunc<T>;
}
export declare type FailHook<T = any> = (err: AxiosError | any, searcher: DjolarSearcher<T>) => void;
export declare type SuccessHook<T = any> = (resolves: SearcherResolves<T>, searcher: DjolarSearcher<T>) => void;
export declare type SearchFunc<T = any> = (searcher: DjolarSearcher<T>, axios: AxiosInstance, option: SearchOption) => Promise<SearcherResolves<T>>;
export declare type SearcherAdapter<T = any> = (searcher: DjolarSearcher<T>) => void;
export declare const SearcherDefaults: {
    searchFunc: SearchFunc<any>;
};
declare class DjolarSearcher<O = any> {
    pagination: SearcherPagination;
    globalOption: SearchOptions;
    searchFunc: SearchFunc<O>;
    hooks: {
        onFail: FailHook<SearcherResolves<O>>[];
        onSuccess: SuccessHook<SearcherResolves<O>>[];
    };
    addHook(type: "onFail" | "onSuccess", hook: FailHook<SearcherResolves<O>> | SuccessHook<SearcherResolves<O>>): this;
    setAdapter(a: SearcherAdapter<O>): this;
    setOption(opt: SearcherContextOptions<O>): this;
    resetPagination(pagination?: SearcherPaginationOptions): void;
    constructor(opt?: SearcherContextOptions<O>);
    searchWithPagination(axios: AxiosInstance, option: SearchOptions): Promise<SearcherResolves<O>>;
    searchOnly(axios: AxiosInstance, option: SearchOptions): Promise<SearcherResolves<O>>;
}
export default DjolarSearcher;
