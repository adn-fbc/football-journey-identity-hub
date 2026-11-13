const ASSOCIATION_ALLOWED_PATHS = new Set(["/", "/members", "/notifications", "/settings"]);

export function associationCanAccessPath(pathname: string) {
  return ASSOCIATION_ALLOWED_PATHS.has(pathname) || pathname.startsWith("/members/");
}
