export declare const DJOLAR_OP_CONTAIN = "co";
export declare const DJOLAR_OP_LESS_THAN_OR_EQUAL = "lte";
export declare const DJOLAR_OP_GREATER_THAN_OR_EQUAL = "gte";
export declare const DJOLAR_OP_LESS_THAN = "lt";
export declare const DJOLAR_OP_GREATER = "gt";
export declare const DJOLAR_OP_EQUAL = "eq";
export declare const DJOLAR_OP_IN = "in";
export declare const DJOLAR_OP_NOT_IN = "ni";
export declare type DjolarOperation = "co" | "lte" | "gte" | "lt" | "gt" | "eq" | "in" | "ni";
export declare const DJOLAR_TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
export interface DjolarField {
    field: string;
    value: string | string[];
    op: DjolarOperation;
}
export interface DjolarSearchParams {
    [propName: string]: DjolarField;
}
export interface DjolarSortBy {
    name: string;
    descend?: boolean;
}
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
export declare function encodeSearchFields(fields: DjolarField[]): string;
export declare function encodeSortByFields(ss: DjolarSortBy[]): string;
export declare const decodeQueryString: (queryStr: string) => DjolarField[];
/**
 * Convert to djolar parameters
 * @param {Object} searchParams The search params
 */
export declare const getDjolarParams: (searchParams: DjolarSearchParams) => DjolarField[];
