import DjolarSearcher from "./index";
import axios, { AxiosError } from "axios";
import { GoMicroStyleSearcherAdapter } from "./adapter_go_micro";

interface UserObject {
  id: number;
  name: string;
  age: number;
}

const s = new DjolarSearcher<UserObject>({
  globalSearchOption: {
    config: {
      baseURL: "localhost:8080",
    },
  },
});
s.searchOnly(axios, {
  listUrl: "/list-users",
})
  .then((resolves) => {
    const count = resolves.response.count;
    const users = resolves.response.result;
    console.log(count, users);
  })
  .catch((err) => {
    const axiosError = err as AxiosError;
    console.log(axiosError.message);
    console.log(axiosError.config.baseURL + axiosError.config.url);
  });

s.setAdapter(GoMicroStyleSearcherAdapter);
s.searchOnly(axios, {
  listUrl: "/list-users",
})
  .then((resolves) => {
    const count = resolves.response.count;
    const users = resolves.response.result;
    console.log(count, users);
  })
  .catch((err) => {
    const axiosError = err as AxiosError;
    console.log(axiosError.message);
    console.log(axiosError.config.baseURL + axiosError.config.url);
  });
