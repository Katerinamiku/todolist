import { Dispatch } from "redux";
import { ResponseType } from "../api/todolists-api";
import { setAppErrorAC, setAppStatusAC } from "../App/app-reducer";

type ErrorUtilsDispatchType = Dispatch<
  ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
>;

// generic function
export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: ErrorUtilsDispatchType
) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(setAppErrorAC({ error: "Some error occurred" }));
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: ErrorUtilsDispatchType
) => {
  dispatch(setAppErrorAC({ error: error.message }));
  dispatch(setAppStatusAC({ status: "failed" }));
};
