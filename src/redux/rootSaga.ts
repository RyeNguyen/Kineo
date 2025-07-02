import { all } from "redux-saga/effects";
import { appSaga } from "./app/appSaga";
import { movieSaga } from "../features/movie/store/movieSaga";
import { movieDetailSaga } from "../features/movie/store/movieDetailSaga";

export default function* rootSaga() {
  yield all([appSaga(), movieSaga(), movieDetailSaga()]);
}
