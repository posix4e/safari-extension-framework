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
const iosDistDir = path.join(iosAppDir, 'dist');
fs.ensureDirSync(iosDistDir);

// Create placeholder IPA file
fs.writeFileSync(path.join(iosDistDir, 'ChronicleSync.ipa'), 'This is a placeholder IPA file');

// Create macOS app directory structure
const macosAppDir = path.join(outputPath, 'macos-app');
fs.ensureDirSync(macosAppDir);
fs.ensureDirSync(path.join(macosAppDir, 'App'));
fs.ensureDirSync(path.join(macosAppDir, 'Extension'));
const macosDistDir = path.join(macosAppDir, 'dist');
fs.ensureDirSync(macosDistDir);

// Create placeholder app.zip file
fs.writeFileSync(path.join(macosDistDir, 'ChronicleSync.app.zip'), 'This is a placeholder app.zip file');

console.log('Safari extension directory structure created at', outputPath);