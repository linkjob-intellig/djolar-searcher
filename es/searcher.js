"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearcherDefaults = exports.createSearcherPagination = void 0;
var adapter_web_1 = require("./adapter_web");
function createSearcherPagination(initialRowsPerPage) {
    if (initialRowsPerPage === void 0) { initialRowsPerPage = 10; }
    return {
        sortBy: [],
        descending: false,
        page: 1,
        rowsPerPage: initialRowsPerPage,
        rowsNumber: 0,
    };
}
exports.createSearcherPagination = createSearcherPagination;
exports.SearcherDefaults = {
    searchFunc: adapter_web_1.defaultWebSearchFunc,
};
var DjolarSearcher = /** @class */ (function () {
    function DjolarSearcher(opt) {
        this.pagination = createSearcherPagination();
        this.globalOption = {};
        this.searchFunc = exports.SearcherDefaults.searchFunc;
        this.hooks = {
            onFail: [],
            onSuccess: [],
        };
        if (opt)
            this.setOption(opt);
    }
    DjolarSearcher.prototype.addHook = function (type, hook) {
        // @ts-ignore
        this.hooks[type].push(hook);
        return this;
    };
    DjolarSearcher.prototype.setAdapter = function (a) {
        a(this);
        return this;
    };
    DjolarSearcher.prototype.setOption = function (opt) {
        if (opt.pagination)
            this.pagination = Object.assign(this.pagination, opt.pagination);
        if (opt.globalSearchOption)
            this.globalOption = Object.assign(this.globalOption, opt.globalSearchOption);
        if (opt.searchFunc)
            this.searchFunc = opt.searchFunc;
        return this;
    };
    DjolarSearcher.prototype.resetPagination = function (pagination) {
        this.setOption({
            pagination: Object.assign({
                page: 1,
                rowsNumber: 0,
            }, pagination),
        });
    };
    DjolarSearcher.prototype.searchWithPagination = function (axios, option) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.searchOnly(axios, option)
                .then(function (resolves) {
                var resolvedPagination = (resolves.response.count || 0) > 0
                    ? {
                        rowsNumber: resolves.response.count,
                    }
                    : {};
                _this.pagination = Object.assign(_this.pagination, option.pagination, resolvedPagination);
                resolve(resolves);
            })
                .catch(reject);
        });
    };
    DjolarSearcher.prototype.searchOnly = function (axios, option) {
        return this.searchFunc(this, axios, Object.assign(option, {
            pagination: Object.assign(this.pagination, option.pagination),
            filter: Object.assign({}, this.globalOption.filter, option.filter),
            listUrl: option.listUrl || this.globalOption.listUrl || "",
            extraQuery: Object.assign({}, this.globalOption.extraQuery, option.extraQuery),
            extraData: Object.assign({}, this.globalOption.extraData, option.extraData),
            config: Object.assign({}, this.globalOption.config, option.config),
            castFunc: option.castFunc || this.globalOption.castFunc || (function (data) { return data; }),
        }));
    };
    return DjolarSearcher;
}());
exports.default = DjolarSearcher;
