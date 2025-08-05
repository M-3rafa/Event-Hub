import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = inject(TokenService).isLoggedIn();
  if (!isLoggedIn) {
    return true;
  } else {
    router.navigate(['home']);
    return false;
  }
};
