import {
  DjolarField,
  encodeSearchFields,
  encodeSortByFields,
  getDjolarParams,
} from "./djolar";
import {
  SearcherAdapter,
  SearcherPagination, SearcherPaginationOptions,
  SearcherResolves,
  SearchFunc,
} from "./searcher";

function buildDjolarPaginationURL(
  apiUrl: string,
  searchParams: DjolarField[],
  pagination?: SearcherPaginationOptions
) {
  const query: Record<string, any> = {};

  if (searchParams) {
    const q = encodeSearchFields(searchParams);
    if (q !== "") query.q = q;
  }

  if (
    pagination &&
    pagination.page !== undefined &&
    pagination.rowsPerPage !== undefined
  ) {
    const limit = pagination.rowsPerPage;
    const offset = (pagination.page - 1) * limit || 0;
    query.limit = limit;
    query.offset = offset;
  }

  if (pagination?.sortBy && pagination.sortBy.length > 0) {
    query.s = encodeSortByFields(
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

export interface SearcherWebStyleResponse<T> {
  count: number;
  result: T[];
}

export const defaultWebListResponse: <ResultObject>() => SearcherWebStyleResponse<
  ResultObject
> = <ResultObject>() => ({
  count: 0,
  result: [],
});

export const defaultWebSearchFunc: SearchFunc<any> = (
  searcher,
  axios,
  option
) => {
  const params = getDjolarParams(option.filter);
  let url = buildDjolarPaginationURL(option.listUrl, params, option.pagination);
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
              count: 0,
              result: [],
            },
            axiosResp.data
          ),
          axiosResponse: axiosResp,
        };
        restfulResp.response.result = option.castFunc(restfulResp.response.result);
        searcher.hooks.onSuccess.forEach((fn) => fn(restfulResp, searcher));
        resolve(restfulResp);
      })
      .catch((err) => {
        searcher.hooks.onFail.forEach((fn) => fn(err, searcher));
        reject(err);
      });
  });
};

export const WebStyleSearcherAdapter: SearcherAdapter<SearcherWebStyleResponse<
  any
>> = (searcher) => {
  searcher.setOption({
    searchFunc: defaultWebSearchFunc,
  });
};

export default WebStyleSearcherAdapter;
