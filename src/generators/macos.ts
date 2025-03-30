import * as fs from 'fs-extra';
import * as path from 'path';
import * as Mustache from 'mustache';
import { Config, ExtensionInfo } from '../types';

/**
 * Generates a macOS app project for a Safari extension
 */
export async function generateMacosApp(
  extensionInfo: ExtensionInfo,
  config: Config,
  outputPath: string
): Promise<void> {
  console.log(`Generating macOS app in ${outputPath}`);
  
  // Create output directory
  fs.ensureDirSync(outputPath);
  
  // Create project structure
  const appDir = path.join(outputPath, 'App');
  const extensionDir = path.join(outputPath, 'Extension');
  fs.ensureDirSync(appDir);
  fs.ensureDirSync(extensionDir);
  
  // Generate Xcode project files
  await generateXcodeProject(extensionInfo, config, outputPath);
  
  // Generate app files
  await generateAppFiles(extensionInfo, config, appDir);
  
  // Generate extension files
  await generateExtensionFiles(extensionInfo, config, extensionDir);
}

/**
 * Generates Xcode project files
 */
async function generateXcodeProject(
  extensionInfo: ExtensionInfo,
  config: Config,
  outputPath: string
): Promise<void> {
  // In a real implementation, we would use a template engine like Mustache
  // to generate the Xcode project files from templates
  
  // For now, we'll just create placeholder files
  const projectDir = path.join(outputPath, `${config.name}.xcodeproj`);
  fs.ensureDirSync(projectDir);
  
  // Create project.pbxproj file
  const pbxprojPath = path.join(projectDir, 'project.pbxproj');
  await fs.writeFile(pbxprojPath, '// Xcode project file placeholder');
  
  // Create xcscheme file
  const schemesDir = path.join(projectDir, 'xcshareddata', 'xcschemes');
  fs.ensureDirSync(schemesDir);
  const schemePath = path.join(schemesDir, `${config.name}.xcscheme`);
  await fs.writeFile(schemePath, '<!-- Xcode scheme file placeholder -->');
}

/**
 * Generates macOS app files
 */
async function generateAppFiles(
  extensionInfo: ExtensionInfo,
  config: Config,
  appDir: string
): Promise<void> {
  // Create Info.plist
  const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIconFile</key>
    <string></string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>${config.version}</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>$(MACOSX_DEPLOYMENT_TARGET)</string>
    <key>NSMainStoryboardFile</key>
    <string>Main</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
</dict>
</plist>`;

  await fs.writeFile(path.join(appDir, 'Info.plist'), infoPlistContent);
  
  // Create AppDelegate.swift
  const appDelegateContent = `import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Insert code here to initialize your application
    }

    func applicationWillTerminate(_ notification: Notification) {
        // Insert code here to tear down your application
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}`;

  await fs.writeFile(path.join(appDir, 'AppDelegate.swift'), appDelegateContent);
  
  // Create ViewController.swift
  const viewControllerContent = `import Cocoa
import SafariServices
import WebKit

class ViewController: NSViewController {
    @IBOutlet var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
    }
    
    private func setupUI() {
        let titleLabel = NSTextField(labelWithString: "${config.name}")
        titleLabel.font = NSFont.boldSystemFont(ofSize: 24)
        titleLabel.alignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let descriptionLabel = NSTextField(labelWithString: "To use this extension, you need to enable it in Safari settings.")
        descriptionLabel.alignment = .center
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let instructionsButton = NSButton(title: "Show Instructions", target: self, action: #selector(showInstructions))
        instructionsButton.bezelStyle = .rounded
        instructionsButton.translatesAutoresizingMaskIntoConstraints = false
        
        let settingsButton = NSButton(title: "Open Safari Extensions Preferences", target: self, action: #selector(openSettings))
        settingsButton.bezelStyle = .rounded
        settingsButton.translatesAutoresizingMaskIntoConstraints = false
        
        let stackView = NSStackView(views: [titleLabel, descriptionLabel, instructionsButton, settingsButton])
        stackView.orientation = .vertical
        stackView.spacing = 20
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(stackView)
        
        NSLayoutConstraint.activate([
            stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(lessThanOrEqualTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    @objc private func showInstructions() {
        let alert = NSAlert()
        alert.messageText = "Enable Extension"
        alert.informativeText = "1. Open Safari\\n2. Go to Safari > Settings > Extensions\\n3. Enable ${config.name}"
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
    
    @objc private func openSettings() {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "${config.bundleId}.Extension") { error in
            if let error = error {
                let alert = NSAlert()
                alert.messageText = "Error"
                alert.informativeText = "Could not open Safari Extensions Preferences: \\(error.localizedDescription)"
                alert.addButton(withTitle: "OK")
                alert.runModal()
            }
        }
    }
}`;

  await fs.writeFile(path.join(appDir, 'ViewController.swift'), viewControllerContent);
  
  // Create Main.storyboard (placeholder)
  await fs.writeFile(path.join(appDir, 'Main.storyboard'), '<!-- Main storyboard placeholder -->');
  
  // Create app entitlements
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

  await fs.writeFile(path.join(appDir, 'App.entitlements'), entitlementsContent);
}

/**
 * Generates Safari extension files
 */
async function generateExtensionFiles(
  extensionInfo: ExtensionInfo,
  config: Config,
  extensionDir: string
): Promise<void> {
  // Create SafariWebExtensionHandler.swift
  const handlerContent = `import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    let logger = Logger(subsystem: "${config.bundleId}", category: "extension")
    
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey] as? [String: Any]
        
        logger.log("Received message from browser.runtime.sendNativeMessage: \\(String(describing: message))")
        
        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "Response": "Received" ] ]
        
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
}`;

  await fs.writeFile(path.join(extensionDir, 'SafariWebExtensionHandler.swift'), handlerContent);
  
  // Create Info.plist for extension
  const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>${config.name}</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>${config.version}</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>$(MACOSX_DEPLOYMENT_TARGET)</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.Safari.web-extension</string>
        <key>NSExtensionPrincipalClass</key>
        <string>$(PRODUCT_MODULE_NAME).SafariWebExtensionHandler</string>
    </dict>
</dict>
</plist>`;

  await fs.writeFile(path.join(extensionDir, 'Info.plist'), infoPlistContent);
  
  // Create extension entitlements
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

  await fs.writeFile(path.join(extensionDir, 'Extension.entitlements'), entitlementsContent);
}