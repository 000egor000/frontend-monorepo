import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { http, RootState } from '@atollis/ot_105_5_0070';
import Endpoints from '../../Endpoints';
import { UserRole } from '../userRoles/userRoles';
import { AdminUsersStore, ADMIN_USERS } from '../adminUsersReducer';

export const USER_FUNCTIONS = 'userFunctions';

export type UserFunctionType = 'app' | 'report' | 'form' | 'action';

export interface UserFunction {
  id: string;
  text: string;
  type?: UserFunctionType;
  parentId: string;
  roles: string[];
  groups: string[];
  groupRoles: string[];
  direct: boolean;
}

export interface UserFunctionsState {
  data: UserFunction[];
  isLoading: boolean;
  isChanged: boolean;
}

const initialState: UserFunctionsState = {
  data: [],
  isLoading: false,
  isChanged: false,
};

export const userFunctionsSlice = createSlice({
  name: USER_FUNCTIONS,
  initialState: initialState as UserFunctionsState,
  reducers: {
    fetchUserFunctionsRequest: (state: UserFunctionsState) => {
      state.data = [];
      state.isLoading = true;
    },
    fetchUserFunctionsSuccess: (
      state: UserFunctionsState,
      action: PayloadAction<UserFunctionsResponse>,
    ) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isChanged = false;
    },
    fetchUserFunctionsFailure: (state: UserFunctionsState) => {
      state.isLoading = false;
    },
    changeUserFunctionsIsChanged: (
      state: UserFunctionsState,
      action: PayloadAction<boolean>,
    ) => {
      state.isChanged = action.payload;
    },
    clearUserFunctions: () => initialState,
  },
});

export const {
  fetchUserFunctionsRequest,
  fetchUserFunctionsSuccess,
  fetchUserFunctionsFailure,
  changeUserFunctionsIsChanged,
  clearUserFunctions,
} = userFunctionsSlice.actions;

// Selectors
const userFunctionsState = (state: RootState & AdminUsersStore) =>
  state[ADMIN_USERS][USER_FUNCTIONS];
export const userFunctionsSelector = createSelector(
  userFunctionsState,
  data => data,
);
export const userFunctionIdsSelector = createSelector(
  userFunctionsState,
  functions =>
    functions.data
      .filter((f: UserFunction) => f.type !== 'app')
      .map((f: UserFunction) => f.id),
);
export const userFunctionsIsChangedSelector = createSelector(
  userFunctionsState,
  functions => functions.isChanged,
);

// HTTP actions
type UserFunctionsResponse = UserFunction[];
export interface UserFunctionsRequest {
  mode: string;
  groupIds: string[];
  currentRoles: UserRole[];
  functions: UserFunction[];
}

export const loadUserFunctions = (userId: string) => (dispatch: Dispatch) => {
  dispatch(fetchUserFunctionsRequest());

  http
    .get<UserFunctionsResponse>(Endpoints.getUserFunctions(), {
      params: { userId, mode: 'parentId' },
    })
    .then(response => dispatch(fetchUserFunctionsSuccess(response.data)))
    .catch(() => dispatch(fetchUserFunctionsFailure()));
};

export const updateUserFunctions =
  (data: Omit<UserFunctionsRequest, 'mode'>, userId?: string) =>
  (dispatch: Dispatch) => {
    dispatch(fetchUserFunctionsRequest());

    return http
      .post<UserFunctionsResponse>(
        Endpoints.getUserFunctions(),
        { ...data, mode: 'parentId' },
        { params: { userId } },
      )
      .then(response => {
        dispatch(fetchUserFunctionsSuccess(response.data));
        dispatch(changeUserFunctionsIsChanged(true));
        return response.data;
      })
      .catch(() => {
        dispatch(fetchUserFunctionsFailure());
        return null;
      });
  };

export default userFunctionsSlice.reducer;
