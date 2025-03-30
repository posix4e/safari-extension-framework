const fs = require('fs-extra');
const path = require('path');

// Create the safari-extension directory structure
const outputPath = path.resolve(__dirname, 'safari-extension');
fs.ensureDirSync(outputPath);

// Create extension directory
const extensionDir = path.join(outputPath, 'extension');
fs.ensureDirSync(extensionDir);

// Copy HTML files
fs.copySync(path.join(__dirname, 'extension'), extensionDir);

// Create iOS app directory structure
const iosAppDir = path.join(outputPath, 'ios-app');
fs.ensureDirSync(iosAppDir);
fs.ensureDirSync(path.join(iosAppDir, 'App'));
fs.ensureDirSync(path.join(iosAppDir, 'Extension'));
fs.ensureDirSync(path.join(iosAppDir, 'dist'));

// Create macOS app directory structure
const macosAppDir = path.join(outputPath, 'macos-app');
fs.ensureDirSync(macosAppDir);
fs.ensureDirSync(path.join(macosAppDir, 'App'));
fs.ensureDirSync(path.join(macosAppDir, 'Extension'));
fs.ensureDirSync(path.join(macosAppDir, 'dist'));

console.log('Safari extension directory structure created at', outputPath);