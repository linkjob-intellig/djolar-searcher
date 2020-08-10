"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.djolar = void 0;
var adapter_go_micro_1 = require("./adapter_go_micro");
var adapter_web_1 = require("./adapter_web");
var lib = require("./djolar");
var searcher_1 = require("./searcher");
exports.djolar = {
    defaultGoMicroSearchFunc: adapter_go_micro_1.defaultGoMicroSearchFunc,
    GoMicroStyleSearcherAdapter: adapter_go_micro_1.GoMicroStyleSearcherAdapter,
    defaultWebSearchFunc: adapter_web_1.defaultWebSearchFunc,
    WebStyleSearcherAdapter: adapter_web_1.WebStyleSearcherAdapter,
    DjolarSearcher: searcher_1.default,
    lib: lib,
};
exports.default = exports.djolar;
