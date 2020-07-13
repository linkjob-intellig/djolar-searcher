"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var axios_1 = require("axios");
var GoMicroAdapters = require("./adapter_go_micro");
var s = new index_1["default"]({
    globalSearchOption: {
        config: {
            baseURL: "localhost:8080"
        }
    }
});
s.searchOnly(axios_1["default"], {
    listUrl: "/list-users"
})
    .then(function (resolves) {
    var count = resolves.response.count;
    var users = resolves.response.result;
    console.log(count, users);
})["catch"](function (err) {
    var axiosError = err;
    console.log(axiosError.message);
    console.log(axiosError.config.baseURL + axiosError.config.url);
});
s.setAdapter(GoMicroAdapters.GoMicroStyleSearcherAdapter);
s.searchOnly(axios_1["default"], {
    listUrl: "/list-users"
})
    .then(function (resolves) {
    var count = resolves.response.count;
    var users = resolves.response.result;
    console.log(count, users);
})["catch"](function (err) {
    var axiosError = err;
    console.log(axiosError.message);
    console.log(axiosError.config.baseURL + axiosError.config.url);
});
