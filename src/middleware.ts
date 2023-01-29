import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const PREMIUM_ROUTES = ['/p/bikes/'];

const toPremium = (path: string) => '/p' + path;
const toPublic = (path: string) => path.replace('/p/', '/');

export function withAuthorization(middleware: NextMiddleware, routes: string[]) {
  return async (request: NextRequest, next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    if (routes.some((value) => pathname.startsWith(value))) {
      const token = await getToken({
        req: request
      });

      if (token) {
        return;
      }

      const url = new URL(toPublic(pathname), request.url);
      return NextResponse.redirect(url);
    }

    if (routes.some((value) => pathname.startsWith(toPublic(value)))) {
      const token = await getToken({
        req: request
      });

      if (!token) {
        return;
      }

      const url = new URL(toPremium(pathname), request.url);
      return NextResponse.redirect(url);
    }

    return middleware(request, next);
  };
}

const mainMiddleware: NextMiddleware = () => NextResponse.next();

export default withAuthorization(mainMiddleware, PREMIUM_ROUTES);
