import { RouterStateSnapshot } from "@angular/router";

export const saveCurrentUrlInLocalStorage = (state: RouterStateSnapshot): void => {
  const url = state.url;
  localStorage.setItem('url', url);
}
