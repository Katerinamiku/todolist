import { appReducer, AppStateType, setAppStatusAC, setAppErrorAC } from './app-reducer'

let startState: AppStateType

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null
    }
})

test('app status should be changed', () => {
    const endState = appReducer(startState, setAppStatusAC('loading'))

    expect(endState.status).toBe('loading')
})

test('app error should be changed', () => {
    const endState = appReducer(startState, setAppErrorAC('boom'))

    expect(endState.error).toBe('boom')
})
