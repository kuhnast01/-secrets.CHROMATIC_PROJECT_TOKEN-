const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.unstable_enableSymlinks = true;
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  '@api': path.resolve(workspaceRoot, 'packages/api/src'),
  '@api/src': path.resolve(workspaceRoot, 'packages/api/src'),
  '@models': path.resolve(workspaceRoot, 'packages/models/src'),
  '@ui': path.resolve(workspaceRoot, 'packages/ui/src'),
};

module.exports = config;
