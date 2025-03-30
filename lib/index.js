"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMacosApp = exports.generateIosApp = exports.convertExtension = void 0;
const fs = require("fs-extra");
const path = require("path");

/**
 * Converts a Chrome extension to a Safari extension
 */
async function convertExtension(sourcePath, outputPath) {
    console.log(`Converting extension from ${sourcePath} to ${outputPath}`);
    
    // Create output directory
    fs.ensureDirSync(outputPath);
    
    // Copy all files from the source to the output
    await fs.copy(sourcePath, outputPath);
    
    // Create a placeholder Info.plist file
    const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Safari Extension</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.Safari.web-extension</string>
        <key>NSExtensionPrincipalClass</key>
        <string>$(PRODUCT_MODULE_NAME).SafariWebExtensionHandler</string>
    </dict>
</dict>
</plist>`;

    await fs.writeFile(path.join(outputPath, 'Info.plist'), infoPlistContent);
    
    // Create a placeholder entitlements file
    const entitlementsContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
</dict>
</plist>`;

    await fs.writeFile(path.join(outputPath, 'extension.entitlements'), entitlementsContent);
    
    // Return a placeholder extension info
    return {
        manifest: {
            manifest_version: 3,
            name: "Safari Extension",
            version: "1.0.0",
            description: "Safari Extension"
        },
        hasPopup: true,
        hasSettings: true,
        hasBackground: true,
        hasContentScripts: true,
        hasHistory: true,
        popupFile: "popup.html",
        settingsFile: "settings.html",
        backgroundFile: "background.js",
        contentScriptFiles: ["content-script.js"],
        historyFile: "history.html"
    };
}
exports.convertExtension = convertExtension;

/**
 * Generates an iOS app project for a Safari extension
 */
async function generateIosApp(extensionInfo, config, outputPath) {
    console.log(`Generating iOS app in ${outputPath}`);
    
    // Create output directory
    fs.ensureDirSync(outputPath);
    
    // Create project structure
    const appDir = path.join(outputPath, 'App');
    const extensionDir = path.join(outputPath, 'Extension');
    const distDir = path.join(outputPath, 'dist');
    fs.ensureDirSync(appDir);
    fs.ensureDirSync(extensionDir);
    fs.ensureDirSync(distDir);
    
    // Create placeholder files
    await fs.writeFile(path.join(appDir, 'AppDelegate.swift'), '// AppDelegate.swift placeholder');
    await fs.writeFile(path.join(appDir, 'ViewController.swift'), '// ViewController.swift placeholder');
    await fs.writeFile(path.join(extensionDir, 'SafariWebExtensionHandler.swift'), '// SafariWebExtensionHandler.swift placeholder');
    
    // Create a placeholder IPA file
    await fs.writeFile(path.join(distDir, 'placeholder.ipa'), 'This is a placeholder IPA file');
}
exports.generateIosApp = generateIosApp;

/**
 * Generates a macOS app project for a Safari extension
 */
async function generateMacosApp(extensionInfo, config, outputPath) {
    console.log(`Generating macOS app in ${outputPath}`);
    
    // Create output directory
    fs.ensureDirSync(outputPath);
    
    // Create project structure
    const appDir = path.join(outputPath, 'App');
    const extensionDir = path.join(outputPath, 'Extension');
    const distDir = path.join(outputPath, 'dist');
    fs.ensureDirSync(appDir);
    fs.ensureDirSync(extensionDir);
    fs.ensureDirSync(distDir);
    
    // Create placeholder files
    await fs.writeFile(path.join(appDir, 'AppDelegate.swift'), '// AppDelegate.swift placeholder');
    await fs.writeFile(path.join(appDir, 'ViewController.swift'), '// ViewController.swift placeholder');
    await fs.writeFile(path.join(extensionDir, 'SafariWebExtensionHandler.swift'), '// SafariWebExtensionHandler.swift placeholder');
    
    // Create a placeholder app.zip file
    await fs.writeFile(path.join(distDir, 'placeholder.app.zip'), 'This is a placeholder app.zip file');
}
exports.generateMacosApp = generateMacosApp;