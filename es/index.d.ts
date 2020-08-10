import * as lib from './djolar';
import DjolarSearcher from './searcher';
export declare const djolar: {
    defaultGoMicroSearchFunc: import("./searcher").SearchFunc<any>;
    GoMicroStyleSearcherAdapter: import("./searcher").SearcherAdapter<import("./adapter_go_micro").SearcherGoMicroStyleResponse<any>>;
    defaultWebSearchFunc: import("./searcher").SearchFunc<any>;
    WebStyleSearcherAdapter: import("./searcher").SearcherAdapter<import("./adapter_web").SearcherWebStyleResponse<any>>;
    DjolarSearcher: typeof DjolarSearcher;
    lib: typeof lib;
};
export default djolar;
