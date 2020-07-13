import {DjolarField} from "./djolar";
import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {defaultWebSearchFunc} from "./adapter_web";

export interface SearcherSortBy {
    name: string
    descend?: boolean
}

export interface SearcherResponse<T> {
    result: T[]
    count: number
    msg?: string
}

export interface SearcherPagination {
    sortBy: SearcherSortBy[]
    page: number
    rowsPerPage: number
    rowsNumber: number
}

export function createSearcherPagination(initialRowsPerPage = 10) {
    return {
        sortBy: [],
        descending: false,
        page: 1,
        rowsPerPage: initialRowsPerPage,
        rowsNumber: 0,
    };
}

export declare type SearcherPaginationOptions = Partial<SearcherPagination>;

export interface SearcherResolves<T> {
    response: SearcherResponse<T>
    axiosResponse?: AxiosResponse
}

export interface SearchOption {
    listUrl: string
    filter: Record<string, DjolarField>
    config: AxiosRequestConfig
    extraQuery: Record<string, any>
    pagination: SearcherPaginationOptions
}

export declare type SearchOptions = Partial<SearchOption>

export interface SearcherContextOptions<T> {
    pagination?: SearcherPaginationOptions
    globalSearchOption?: SearchOptions
    searchFunc?: SearchFunc<T>
}

export declare type FailHook<T> = (err: AxiosError | any, searcher: DjolarSearcher<T>) => void

export declare type SuccessHook<T> = (resolves: SearcherResolves<T>, searcher: DjolarSearcher<T>) => void;

interface SearchFuncOption {
    listUrl: string
    filter: Record<string, DjolarField>
    config: AxiosRequestConfig
    extraQuery: Record<string, any>
    pagination: SearcherPagination
}

export declare type SearchFunc<T> = (searcher: DjolarSearcher<T>, axios: AxiosInstance, option: SearchFuncOption) => Promise<SearcherResolves<T>>;

export declare type SearcherAdapter<T> = (searcher: DjolarSearcher<T>) => void;

class DjolarSearcher<O = any> {
    pagination: SearcherPagination = createSearcherPagination();
    globalOption: SearchOptions = {};
    searchFunc: SearchFunc<O> = defaultWebSearchFunc as unknown as SearchFunc<O>;
    hooks = {
        onFail: [] as FailHook<SearcherResolves<O>>[],
        onSuccess: [] as SuccessHook<SearcherResolves<O>>[]
    };

    addHook(type: 'onFail' | 'onSuccess', hook: FailHook<SearcherResolves<O>> | SuccessHook<SearcherResolves<O>>) {
        // @ts-ignore
        this.hooks[type].push(hook);
        return this;
    }

    setAdapter(a: SearcherAdapter<O>) {
        a(this);
        return this;
    }

    setOption(opt: SearcherContextOptions<O>) {
        if (opt.pagination) this.pagination = Object.assign(this.pagination, opt.pagination);
        if (opt.globalSearchOption) this.globalOption = Object.assign(this.globalOption, opt.globalSearchOption);
        if (opt.searchFunc) this.searchFunc = opt.searchFunc;
        return this;
    }

    resetPagination(pagination ?: SearcherPaginationOptions) {
        this.setOption({
            pagination: Object.assign({
                page: 1,
                rowsNumber: 0,
            }, pagination)
        })
    }

    constructor(opt ?: SearcherContextOptions<O>) {
        if (opt) this.setOption(opt);
    }

    searchWithPagination(axios: AxiosInstance, option: SearchOptions) {
        return new Promise<SearcherResolves<O>>((resolve, reject) => {
            this.searchOnly(axios, option).then(resolves => {
                const resolvedPagination = (resolves.response.count || 0) > 0 ? {
                    rowsNumber: resolves.response.count
                } : {};
                this.pagination = Object.assign(
                    this.pagination,
                    option.pagination,
                    resolvedPagination
                );
                console.log(resolves)
                resolve(resolves);
            }).catch(reject)
        })
    }

    searchOnly(axios: AxiosInstance, option: SearchOptions): Promise<SearcherResolves<O>> {
        return this.searchFunc(this, axios, Object.assign(option, {
            pagination: Object.assign(this.pagination, option.pagination),
            filter: Object.assign({}, this.globalOption.filter, option.filter),
            listUrl: option.listUrl || this.globalOption.listUrl || '',
            extraQuery: Object.assign({}, this.globalOption.extraQuery, option.extraQuery),
            config: Object.assign({}, this.globalOption.config, option.config),
        }))
    };
}

export default DjolarSearcher;
