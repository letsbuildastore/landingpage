// Set at build time for hosts that serve the site below a repository path.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const publicAsset = (path: string) => basePath + path;
