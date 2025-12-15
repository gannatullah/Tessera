// Create this file: src/app/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Only access localStorage if we're in the browser
  const authToken = isPlatformBrowser(platformId) ? localStorage.getItem('authToken') : null;

  const skipUrls = ['/login', '/register'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));


  if (authToken && !shouldSkip) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
