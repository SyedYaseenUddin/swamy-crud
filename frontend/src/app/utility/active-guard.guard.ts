import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';
export const activeGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.getUserDetails();
  const currentRoute = state.url;
  const publicRoutes = ['/login', '/register'];
  if (publicRoutes.includes(currentRoute)) return user ? (router.navigate(['/']), false) : true;
  if (!user) return router.navigate(['/login']), false;
  return true;
};
