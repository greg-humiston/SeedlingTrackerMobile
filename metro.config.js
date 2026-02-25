const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// @tanstack/query-core v5 uses an `exports` map. Metro resolves the `import`
// condition to the ESM build which it cannot handle. We bypass the exports map
// entirely by resolving the package.json directory ourselves and pointing Metro
// directly at the CJS build file.
const queryCoreDir = path.dirname(
  require.resolve('@tanstack/query-core/package.json')
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@tanstack/query-core') {
    return {
      filePath: path.join(queryCoreDir, 'build/modern/index.cjs'),
      type: 'sourceFile',
    };
  }
  // Fall back to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
