import {
    SearcherAdapter,
    SearcherPagination, SearcherPaginationOptions,
    SearcherResolves,
    SearchFunc,
} from "./searcher";
import {
  DjolarField,
  encodeSearchFields,
  encodeSortByFields,
  getDjolarParams,
} from "./djolar";

export interface SearcherGoMicroStyleResponse<T> {
  Count: number;
  Result: T[];
}

export const defaultGoMicroListResponse: <T>() => SearcherGoMicroStyleResponse<
  T
> = <T>() => ({
  Count: 0,
  Result: [],
});

function buildDjolarPaginationURLMicro(
  apiUrl: string,
  searchParams: DjolarField[],
  pagination?: SearcherPaginationOptions
) {
  const query: Record<string, any> = {};

  if (searchParams) {
    const q = encodeSearchFields(searchParams);
    if (q !== "") query.Q = q;
  }

  if (
    pagination &&
    pagination.page !== undefined &&
    pagination.rowsPerPage !== undefined
  ) {
    const limit = pagination.rowsPerPage;
    const offset = (pagination.page - 1) * limit || 0;
    query.Limit = limit;
    query.Offset = offset;
  }

  if (pagination?.sortBy && pagination.sortBy.length > 0) {
    query.S = encodeSortByFields(
      pagination.sortBy.map((s) => ({
        name: s.name,
        descend: s.descend,
      }))
    );
  }

  let queryStr = Object.entries(query)
    .map((entry) => {
      const k = entry[0],
        v = entry[1];
      return `${k}=${v}`;
    })
    .join("&");
  if (queryStr.length > 0) queryStr = "?" + queryStr;

  return apiUrl + queryStr;
}

export const defaultGoMicroSearchFunc: SearchFunc<any> = (
  searcher,
  axios,
  option
) => {
  const params = getDjolarParams(option.filter);
  let url = buildDjolarPaginationURLMicro(
    option.listUrl,
    params,
    option.pagination
  );
  const exQuery = option.extraQuery;
  if (Object.keys(exQuery).length > 0) {
    url = `${url}&${Object.entries(exQuery)
      .map((e) => {
        const key = e[0],
          value = e[1];
        return `${key}=${value}`;
      })
      .join("&")}`;
  }
  return new Promise<SearcherResolves<any>>((resolve, reject) => {
    axios
      .get(url, Object.assign({}, searcher.globalOption.config, option.config))
      .then((axiosResp) => {
        const restfulResp = {
          response: Object.assign(
            {
              Count: 0,
              Result: [],
              get count() {
                return this.Count;
              },
              get result() {
                return this.Result;
              },
            },
            axiosResp.data
          ),
          axiosResponse: axiosResp,
        };
        restfulResp.response.Result = option.castFunc(restfulResp.response.result);
        searcher.hooks.onSuccess.forEach((fn) => fn(restfulResp, searcher));
        resolve(restfulResp);
      })
      .catch((err) => {
        searcher.hooks.onFail.forEach((fn) => fn(err, searcher));
        reject(err);
      });
  });
};

export const GoMicroStyleSearcherAdapter: SearcherAdapter<SearcherGoMicroStyleResponse<
  any
>> = (searcher) => {
  searcher.setOption({
    searchFunc: defaultGoMicroSearchFunc,
  });
};
