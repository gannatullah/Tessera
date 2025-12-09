// Create this file: src/app/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = localStorage.getItem('authToken');

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
