const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'mjs' to the resolver source extensions
config.resolver.sourceExts.push('mjs');

module.exports = config;