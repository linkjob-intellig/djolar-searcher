import { SearcherAdapter, SearchFunc } from "./searcher";
export interface SearcherWebStyleResponse<T> {
    count: number;
    result: T[];
}
export declare const defaultWebListResponse: <ResultObject>() => SearcherWebStyleResponse<ResultObject>;
export declare const defaultWebSearchFunc: SearchFunc<any>;
export declare const WebStyleSearcherAdapter: SearcherAdapter<SearcherWebStyleResponse<any>>;
export default WebStyleSearcherAdapter;
