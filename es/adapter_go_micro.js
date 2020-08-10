"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoMicroStyleSearcherAdapter = exports.defaultGoMicroSearchFunc = exports.defaultGoMicroListResponse = void 0;
var djolar_1 = require("./djolar");
exports.defaultGoMicroListResponse = function () { return ({
    Count: 0,
    Result: [],
}); };
function buildDjolarPaginationURLMicro(apiUrl, searchParams, pagination) {
    var query = {};
    if (searchParams) {
        var q = djolar_1.encodeSearchFields(searchParams);
        if (q !== "")
            query.Q = q;
    }
    if (pagination &&
        pagination.page !== undefined &&
        pagination.rowsPerPage !== undefined) {
        var limit = pagination.rowsPerPage;
        var offset = (pagination.page - 1) * limit || 0;
        query.Limit = limit;
        query.Offset = offset;
    }
    if ((pagination === null || pagination === void 0 ? void 0 : pagination.sortBy) && pagination.sortBy.length > 0) {
        query.S = djolar_1.encodeSortByFields(pagination.sortBy.map(function (s) { return ({
            name: s.name,
            descend: s.descend,
        }); }));
    }
    var queryStr = Object.entries(query)
        .map(function (entry) {
        var k = entry[0], v = entry[1];
        return k + "=" + v;
    })
        .join("&");
    if (queryStr.length > 0)
        queryStr = "?" + queryStr;
    return apiUrl + queryStr;
}
exports.defaultGoMicroSearchFunc = function (searcher, axios, option) {
    var params = djolar_1.getDjolarParams(option.filter);
    var url = buildDjolarPaginationURLMicro(option.listUrl, params, option.pagination);
    var exQuery = option.extraQuery;
    if (Object.keys(exQuery).length > 0) {
        url = url + "&" + Object.entries(exQuery)
            .map(function (e) {
            var key = e[0], value = e[1];
            return key + "=" + value;
        })
            .join("&");
    }
    return new Promise(function (resolve, reject) {
        axios
            .get(url, Object.assign({}, searcher.globalOption.config, option.config))
            .then(function (axiosResp) {
            var restfulResp = {
                response: Object.assign({
                    Count: 0,
                    Result: [],
                    get count() {
                        return this.Count;
                    },
                    get result() {
                        return this.Result;
                    },
                }, axiosResp.data),
                axiosResponse: axiosResp,
            };
            searcher.hooks.onSuccess.forEach(function (fn) { return fn(restfulResp, searcher); });
            resolve(restfulResp);
        })
            .catch(function (err) {
            searcher.hooks.onFail.forEach(function (fn) { return fn(err, searcher); });
            reject(err);
        });
    });
};
exports.GoMicroStyleSearcherAdapter = function (searcher) {
    searcher.setOption({
        searchFunc: exports.defaultGoMicroSearchFunc,
    });
};
