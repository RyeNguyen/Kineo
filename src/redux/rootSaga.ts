import { all } from "redux-saga/effects";
import { appSaga } from "./app/appSaga";
import { authSaga } from "../features/auth/store/authSaga";
import { homeSaga } from "./home/homeSaga";
import { movieSaga } from "../features/movie/store/movieSaga";

export default function* rootSaga() {
  yield all([appSaga(), movieSaga()]);
}
