
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null
export type AppStateType = {
    status: RequestStatusType
    error: ErrorType
};
export type AppReducerActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>;

const initialState: AppStateType = {
    status: 'idle',
    error: null
}

export const appReducer = (state: AppStateType = initialState, action: AppReducerActionsType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}
//--------------------AC----------------------
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        status
    } as const
}
export const setAppErrorAC = (error: ErrorType) => {
    return {
        type: 'APP/SET-ERROR',
        error
    } as const
}
