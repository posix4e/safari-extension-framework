import * as fs from 'fs-extra';
import * as path from 'path';
import { ChromeManifest, ExtensionInfo } from './types';

/**
 * Analyzes a Chrome extension and extracts information about its components
 */
export async function analyzeExtension(extensionPath: string): Promise<ExtensionInfo> {
  // Read the manifest.json file
  const manifestPath = path.join(extensionPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found in ${extensionPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ChromeManifest;
  
  // Determine which components the extension has
  const hasPopup = !!manifest.action?.default_popup;
  const hasSettings = !!manifest.options_ui?.page;
  const hasBackground = !!manifest.background?.service_worker;
  const hasContentScripts = !!manifest.content_scripts && manifest.content_scripts.length > 0;
  
  // Check for history page in web_accessible_resources
  let hasHistory = false;
  let historyFile: string | undefined;
  
  if (manifest.web_accessible_resources) {
    for (const resource of manifest.web_accessible_resources) {
      const historyIndex = resource.resources.findIndex(r => r.includes('history.html'));
      if (historyIndex !== -1) {
        hasHistory = true;
        historyFile = resource.resources[historyIndex];
        break;
      }
    }
  }
  
  // Get file paths
  const popupFile = hasPopup ? manifest.action?.default_popup : undefined;
  const settingsFile = hasSettings ? manifest.options_ui?.page : undefined;
  const backgroundFile = hasBackground ? manifest.background?.service_worker : undefined;
  
  // Get content script files
  const contentScriptFiles = hasContentScripts 
    ? manifest.content_scripts?.flatMap(script => script.js) 
    : undefined;
  
  return {
    manifest,
    hasPopup,
    hasSettings,
    hasBackground,
    hasContentScripts,
    hasHistory,
    popupFile,
    settingsFile,
    backgroundFile,
    contentScriptFiles,
    historyFile
  };
}

/**
 * Converts a Chrome extension to a Safari extension
 */
export async function convertExtension(
  sourcePath: string, 
  outputPath: string
): Promise<ExtensionInfo> {
  console.log(`Converting extension from ${sourcePath} to ${outputPath}`);
  
  // Analyze the extension
  const extensionInfo = await analyzeExtension(sourcePath);
  
  // Create output directory
  fs.ensureDirSync(outputPath);
  
  // Copy all files from the source to the output
  await fs.copy(sourcePath, outputPath);
  
  // Create a Safari extension manifest (Info.plist)
  await createInfoPlist(extensionInfo, outputPath);
  
  // Create a Safari extension entitlements file
  await createEntitlements(extensionInfo, outputPath);
  
  return extensionInfo;
}

/**
 * Creates an Info.plist file for the Safari extension
 */
async function createInfoPlist(extensionInfo: ExtensionInfo, outputPath: string): Promise<void> {
  const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${extensionInfo.manifest.name}</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleVersion</key>
    <string>${extensionInfo.manifest.version}</string>
    <key>CFBundleShortVersionString</key>
    <string>${extensionInfo.manifest.version}</string>
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
}

/**
 * Creates an entitlements file for the Safari extension
 */
async function createEntitlements(extensionInfo: ExtensionInfo, outputPath: string): Promise<void> {
  const entitlementsContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    ${extensionInfo.hasBackground ? '<key>com.apple.security.application-groups</key>\n    <array>\n        <string>$(TeamIdentifierPrefix)$(PRODUCT_BUNDLE_IDENTIFIER)</string>\n    </array>' : ''}
</dict>
</plist>`;

  await fs.writeFile(path.join(outputPath, 'extension.entitlements'), entitlementsContent);
}