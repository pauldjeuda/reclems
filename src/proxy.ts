import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const localeMiddleware = createMiddleware(routing);
export function proxy(request: NextRequest) {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = btoa(String.fromCharCode(...nonceBytes));
  const devEval = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';
  const adminPath =
    request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/');
  const google = adminPath
    ? ' https://accounts.google.com https://apis.google.com https://www.gstatic.com https://www.googleapis.com'
    : '';
  const authConnect = adminPath
    ? ' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com'
    : '';
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}'${devEval} https://challenges.cloudflare.com${google}; connect-src 'self' https://challenges.cloudflare.com${authConnect}; frame-src https://challenges.cloudflare.com https://accounts.google.com; img-src 'self' data: blob: https://lh3.googleusercontent.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com; frame-ancestors 'none'`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const pathLocale = request.nextUrl.pathname.split('/')[1];
  requestHeaders.set('x-app-locale', pathLocale === 'en' ? 'en' : 'fr');
  const forwarded = new NextRequest(request, { headers: requestHeaders });
  let response: NextResponse;
  const bypassPath =
    request.nextUrl.pathname === '/dev' ||
    request.nextUrl.pathname.startsWith('/dev/') ||
    request.nextUrl.pathname === '/opengraph-image' ||
    request.nextUrl.pathname === '/twitter-image';
  if (adminPath) {
    if (request.nextUrl.pathname !== '/admin/login' && !request.cookies.has('__session'))
      response = NextResponse.redirect(new URL('/admin/login', request.url));
    else response = NextResponse.next({ request: { headers: requestHeaders } });
  } else if (bypassPath) response = NextResponse.next({ request: { headers: requestHeaders } });
  else response = localeMiddleware(forwarded);
  response.headers.set('Content-Security-Policy', csp);
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'https:')
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  return response;
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
