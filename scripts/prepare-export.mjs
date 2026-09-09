import { existsSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

// Vinext writes path-prefixed assets into a matching directory on disk.
// A static host already mounts the entire artifact at that prefix, so flatten
// only the generated _next directory to avoid a duplicated repository path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath) {
  if (
    !/^\/(?:[a-zA-Z0-9._-]+\/)*[a-zA-Z0-9._-]+$/.test(basePath) ||
    basePath.split('/').some((part) => part === '.' || part === '..')
  ) {
    throw new Error(
      'NEXT_PUBLIC_BASE_PATH must be a path such as /repository, without a trailing slash.',
    );
  }
  const output = resolve('dist/client');
  const generatedAssets = resolve(output, basePath.slice(1), '_next');
  if (!existsSync(generatedAssets)) {
    throw new Error(`Expected Vinext assets at ${generatedAssets}`);
  }
  renameSync(generatedAssets, resolve(output, '_next'));
}
