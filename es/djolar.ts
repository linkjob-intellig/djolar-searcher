export const DJOLAR_OP_CONTAIN = "co";
export const DJOLAR_OP_LESS_THAN_OR_EQUAL = "lte";
export const DJOLAR_OP_GREATER_THAN_OR_EQUAL = "gte";
export const DJOLAR_OP_LESS_THAN = "lt";
export const DJOLAR_OP_GREATER = "gt";
export const DJOLAR_OP_EQUAL = "eq";
export const DJOLAR_OP_IN = "in";
export const DJOLAR_OP_NOT_IN = "ni";

export declare type DjolarOperation =
  | "co"
  | "lte"
  | "gte"
  | "lt"
  | "gt"
  | "eq"
  | "in"
  | "ni";

// Postgres time stamp
export const DJOLAR_TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";

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
export function encodeSearchFields(fields: DjolarField[]) {
  if (!(fields instanceof Array)) {
    throw Error("fields must be Array");
  }

  const queries: string[] = [];
  for (const item of fields) {
    if (item.value === "") {
      continue;
    }

    if (item.op === DJOLAR_OP_CONTAIN) {
      const q = `${item.field}__co__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_EQUAL) {
      const q = `${item.field}__eq__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_GREATER_THAN_OR_EQUAL) {
      const q = `${item.field}__gte__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_GREATER) {
      const q = `${item.field}__gt__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_LESS_THAN_OR_EQUAL) {
      const q = `${item.field}__lte__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_LESS_THAN) {
      const q = `${item.field}__lt__${item.value}`;
      queries.push(q);
    } else if (item.op === DJOLAR_OP_IN) {
      if (!(item.value instanceof Array)) {
        // value field should be array when using "IN" operator, fall back to "EQUAL"
        const q = `${item.field}__eq__${item.value}`;
        queries.push(q);
      } else {
        const q = `${item.field}__in__[${item.value.join(",")}]`;
        queries.push(q);
      }
    } else if (item.op === DJOLAR_OP_NOT_IN) {
      if (!(item.value instanceof Array)) {
        throw Error('value field should be array when using "NOT IN" operator');
      } else {
        const q = `${item.field}__ni__[${item.value.join(",")}]`;
        queries.push(q);
      }
    }
  }

  const queryStr = encodeURIComponent(queries.join("|"));
  return queryStr;
}

export function encodeSortByFields(ss: DjolarSortBy[]) {
  return ss
    .map((s) => {
      if (s.descend && s.descend) {
        return `-${s.name}`;
      } else {
        return s.name;
      }
    })
    .join(",");
}

export const decodeQueryString = function (queryStr: string) {
  if (queryStr === "") {
    return [];
  }

  const query = decodeURIComponent(queryStr);
  const tokens = query.split("|");
  const fields: DjolarField[] = [];
  for (const token of tokens) {
    let matches = token.match(/(\w+)__eq__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_EQUAL,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__co__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_CONTAIN,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__lt__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_LESS_THAN,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__lte__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_LESS_THAN_OR_EQUAL,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__gt__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_GREATER,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__gte__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_GREATER_THAN_OR_EQUAL,
        value: matches[2],
        field: matches[1],
      });
      continue;
    }

    matches = token.match(/(\w+)__in__\[(\S+)\]$/);
    if (matches !== null) {
      const values = matches[2].split(",");
      fields.push({ op: DJOLAR_OP_IN, value: values, field: matches[1] });
      continue;
    }

    matches = token.match(/(\w+)__ni__(.+)/);
    if (matches !== null) {
      fields.push({
        op: DJOLAR_OP_NOT_IN,
        value: matches[2],
        field: matches[1],
      });
    }
  }

  return fields;
};

/**
 * Convert to djolar parameters
 * @param {Object} searchParams The search params
 */
export const getDjolarParams = function (searchParams: DjolarSearchParams) : DjolarField[] {
  return Object.values(searchParams).map(param => ({
    field: param.field,
    op: param.op,
    value: param.value,
  }));
};
