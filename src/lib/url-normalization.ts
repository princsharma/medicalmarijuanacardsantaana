import { siteConfig } from "@/data/site";

/** Canonical site origin without trailing slash, e.g. https://example.com */
export function getCanonicalOrigin() {
  const url = new URL(siteConfig.url);
  url.hostname = url.hostname.replace(/^www\./i, "");
  return url.origin;
}

/** True when the last path segment looks like a static file (has an extension). */
function isFilePath(pathname: string): boolean {
  const segment = pathname.replace(/\/+$/, "").split("/").pop() ?? "";
  return /\.[a-z0-9]{1,8}$/i.test(segment);
}

/** Add a trailing slash on indexable routes; keep assets and bare `/` as-is. */
export function withTrailingSlash(pathname: string): string {
  if (pathname === "/" || pathname === "") {
    return "/";
  }
  const bare = pathname.replace(/\/+$/, "");
  if (isFilePath(bare)) {
    return bare;
  }
  return `${bare}/`;
}

/** Build an absolute canonical URL for a path segment ("" or "/about-us"). */
export function getCanonicalUrl(path = "") {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const pathOnly = hashIndex >= 0 ? path.slice(0, hashIndex) : path;

  const normalizedPath = pathOnly.startsWith("/") ? pathOnly : pathOnly ? `/${pathOnly}` : "";

  if (normalizedPath === "" || normalizedPath === "/") {
    return `${getCanonicalOrigin()}/${hash}`;
  }

  const routePath = withTrailingSlash(normalizedPath);
  return `${getCanonicalOrigin()}${routePath}${hash}`;
}

/**
 * Normalize a pathname for SEO: lowercase, collapse slashes, enforce trailing slash on routes.
 * Returns null when no change is needed.
 */
export function normalizePathname(pathname: string): string | null {
  let normalized = pathname;

  const lower = normalized.toLowerCase();
  if (lower !== normalized) {
    normalized = lower;
  }

  if (normalized.includes("//")) {
    normalized = normalized.replace(/\/{2,}/g, "/");
  }

  const withSlash = withTrailingSlash(normalized);

  if (withSlash !== normalized) {
    normalized = withSlash;
  }

  return normalized === pathname ? null : normalized;
}

/** Whether the request host should redirect to the canonical production host. */
export function getCanonicalHostRedirect(host: string): string | null {
  if (process.env.NODE_ENV !== "production") return null;

  const canonicalHost = new URL(getCanonicalOrigin()).host.toLowerCase();
  const bareHost = host.split(":")[0]?.toLowerCase() ?? "";

  if (!bareHost || bareHost === canonicalHost) return null;

  const apexHost = canonicalHost.replace(/^www\./, "");
  if (bareHost === apexHost || bareHost === `www.${apexHost}`) {
    return canonicalHost;
  }

  return null;
}