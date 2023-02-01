import {
  appReducer,
  setAppStatusAC,
  setAppErrorAC,
  RequestStatusType,
  ErrorType,
} from "./app-reducer";

let startState = {
  status: "idle" as RequestStatusType,
  error: null as ErrorType,
  isInitialized: false as boolean,
};

beforeEach(() => {
  startState = {
    status: "idle",
    error: null,
    isInitialized: false,
  };
});

test("app status should be changed", () => {
  const endState = appReducer(
    startState,
    setAppStatusAC({ status: "loading" })
  );

  expect(endState.status).toBe("loading");
});

test("app error should be changed", () => {
  const endState = appReducer(startState, setAppErrorAC({ error: "boom" }));

  expect(endState.error).toBe("boom");
});
