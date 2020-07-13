"use strict";
exports.__esModule = true;
exports.getDjolarParams = exports.decodeQueryString = exports.encodeSortByFields = exports.encodeSearchFields = exports.DJOLAR_TIMESTAMP_FORMAT = exports.DJOLAR_OP_NOT_IN = exports.DJOLAR_OP_IN = exports.DJOLAR_OP_EQUAL = exports.DJOLAR_OP_GREATER = exports.DJOLAR_OP_LESS_THAN = exports.DJOLAR_OP_GREATER_THAN_OR_EQUAL = exports.DJOLAR_OP_LESS_THAN_OR_EQUAL = exports.DJOLAR_OP_CONTAIN = void 0;
exports.DJOLAR_OP_CONTAIN = "co";
exports.DJOLAR_OP_LESS_THAN_OR_EQUAL = "lte";
exports.DJOLAR_OP_GREATER_THAN_OR_EQUAL = "gte";
exports.DJOLAR_OP_LESS_THAN = "lt";
exports.DJOLAR_OP_GREATER = "gt";
exports.DJOLAR_OP_EQUAL = "eq";
exports.DJOLAR_OP_IN = "in";
exports.DJOLAR_OP_NOT_IN = "ni";
// Postgres time stamp
exports.DJOLAR_TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
/**
 * Parse the fields def to query string
 *
 * Fields format:
 * eg,. [{ field: 'order_id', value: this.form.order_id, op: 'eq' }]
 *
 * - field: The field name
 * - value: The field value
 * - op: The compare operation
 *
 */
function encodeSearchFields(fields) {
    if (!(fields instanceof Array)) {
        throw Error("fields must be Array");
    }
    var queries = [];
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var item = fields_1[_i];
        if (item.value === "") {
            continue;
        }
        if (item.op === exports.DJOLAR_OP_CONTAIN) {
            var q = item.field + "__co__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_EQUAL) {
            var q = item.field + "__eq__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_GREATER_THAN_OR_EQUAL) {
            var q = item.field + "__gte__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_GREATER) {
            var q = item.field + "__gt__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_LESS_THAN_OR_EQUAL) {
            var q = item.field + "__lte__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_LESS_THAN) {
            var q = item.field + "__lt__" + item.value;
            queries.push(q);
        }
        else if (item.op === exports.DJOLAR_OP_IN) {
            if (!(item.value instanceof Array)) {
                // value field should be array when using "IN" operator, fall back to "EQUAL"
                var q = item.field + "__eq__" + item.value;
                queries.push(q);
            }
            else {
                var q = item.field + "__in__[" + item.value.join(",") + "]";
                queries.push(q);
            }
        }
        else if (item.op === exports.DJOLAR_OP_NOT_IN) {
            if (!(item.value instanceof Array)) {
                throw Error('value field should be array when using "NOT IN" operator');
            }
            else {
                var q = item.field + "__ni__[" + item.value.join(",") + "]";
                queries.push(q);
            }
        }
    }
    var queryStr = encodeURIComponent(queries.join("|"));
    return queryStr;
}
exports.encodeSearchFields = encodeSearchFields;
function encodeSortByFields(ss) {
    return ss
        .map(function (s) {
        if (s.descend && s.descend) {
            return "-" + s.name;
        }
        else {
            return s.name;
        }
    })
        .join(",");
}
exports.encodeSortByFields = encodeSortByFields;
exports.decodeQueryString = function (queryStr) {
    if (queryStr === "") {
        return [];
    }
    var query = decodeURIComponent(queryStr);
    var tokens = query.split("|");
    var fields = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        var matches = token.match(/(\w+)__eq__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_EQUAL,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__co__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_CONTAIN,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__lt__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_LESS_THAN,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__lte__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_LESS_THAN_OR_EQUAL,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__gt__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_GREATER,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__gte__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_GREATER_THAN_OR_EQUAL,
                value: matches[2],
                field: matches[1]
            });
            continue;
        }
        matches = token.match(/(\w+)__in__\[(\S+)\]$/);
        if (matches !== null) {
            var values = matches[2].split(",");
            fields.push({ op: exports.DJOLAR_OP_IN, value: values, field: matches[1] });
            continue;
        }
        matches = token.match(/(\w+)__ni__(\S+)$/);
        if (matches !== null) {
            fields.push({
                op: exports.DJOLAR_OP_NOT_IN,
                value: matches[2],
                field: matches[1]
            });
        }
    }
    return fields;
};
/**
 * Convert to djolar parameters
 * @param {Object} searchParams The search params
 */
exports.getDjolarParams = function (searchParams) {
    var params = [];
    for (var name_1 in searchParams) {
        params.push({
            field: name_1,
            value: searchParams[name_1].value,
            op: searchParams[name_1].op
        });
    }
    return params;
};
