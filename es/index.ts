import { defaultGoMicroSearchFunc, GoMicroStyleSearcherAdapter } from "./adapter_go_micro"
import { defaultWebSearchFunc, WebStyleSearcherAdapter } from "./adapter_web"
import * as lib from './djolar'
import DjolarSearcher from './searcher'

export const djolar = {
    defaultGoMicroSearchFunc,
    GoMicroStyleSearcherAdapter,
    defaultWebSearchFunc,
    WebStyleSearcherAdapter,
    DjolarSearcher,
    lib,
}

export default djolar;
