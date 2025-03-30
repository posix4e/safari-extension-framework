const fs = require('fs-extra');
const path = require('path');

// Create the safari-extension directory structure
const outputPath = path.resolve(__dirname, 'safari-extension');
fs.ensureDirSync(outputPath);

// Create extension directory
const extensionDir = path.join(outputPath, 'extension');
fs.ensureDirSync(extensionDir);

// Create placeholder HTML files instead of copying
// Check if extension directory exists before copying
const sourceExtensionDir = path.join(__dirname, 'extension');
if (fs.existsSync(sourceExtensionDir)) {
  fs.copySync(sourceExtensionDir, extensionDir);
} else {
  // Create placeholder HTML files
  fs.writeFileSync(path.join(extensionDir, 'settings.html'), '<!DOCTYPE html><html><head><title>Settings</title></head><body><h1>Settings</h1></body></html>');
  fs.writeFileSync(path.join(extensionDir, 'popup.html'), '<!DOCTYPE html><html><head><title>Popup</title></head><body><h1>Popup</h1></body></html>');
  fs.writeFileSync(path.join(extensionDir, 'history.html'), '<!DOCTYPE html><html><head><title>History</title></head><body><h1>History</h1></body></html>');
}

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