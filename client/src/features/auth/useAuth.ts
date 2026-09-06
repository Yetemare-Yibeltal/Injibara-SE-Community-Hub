import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { setCredentials, clearCredentials } from "./authSlice";
import { setAccessToken } from "../../lib/axiosClient";
import type { AccountDTO } from "@shared/types";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  function login(newUser: AccountDTO, newAccessToken: string): void {
    setAccessToken(newAccessToken);
    dispatch(setCredentials({ user: newUser, accessToken: newAccessToken }));
  }

  function logout(): void {
    setAccessToken(null);
    dispatch(clearCredentials());
  }

  return { user, accessToken, isAuthenticated, login, logout };
}
