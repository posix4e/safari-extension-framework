import * as fs from 'fs-extra';
import * as path from 'path';
import { Config, ExtensionInfo } from '../types';

/**
 * Generates an iOS app project for a Safari extension
 */
export async function generateIosApp(
  extensionInfo: ExtensionInfo,
  config: Config,
  outputPath: string
): Promise<void> {
  console.log(`Generating iOS app in ${outputPath}`);
  
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
  
  // Generate shared files
  await generateSharedFiles(extensionInfo, config, outputPath);
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
 * Generates iOS app files
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
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <false/>
        <key>UISceneConfigurations</key>
        <dict>
            <key>UIWindowSceneSessionRoleApplication</key>
            <array>
                <dict>
                    <key>UISceneConfigurationName</key>
                    <string>Default Configuration</string>
                    <key>UISceneDelegateClassName</key>
                    <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
                    <key>UISceneStoryboardFile</key>
                    <string>Main</string>
                </dict>
            </array>
        </dict>
    </dict>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        ${config.ios.orientations.includes('portrait') ? '<string>UIInterfaceOrientationPortrait</string>' : ''}
        ${config.ios.orientations.includes('landscape') ? '<string>UIInterfaceOrientationLandscapeLeft</string>\n        <string>UIInterfaceOrientationLandscapeRight</string>' : ''}
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        ${config.ios.orientations.includes('portrait') ? '<string>UIInterfaceOrientationPortrait</string>\n        <string>UIInterfaceOrientationPortraitUpsideDown</string>' : ''}
        ${config.ios.orientations.includes('landscape') ? '<string>UIInterfaceOrientationLandscapeLeft</string>\n        <string>UIInterfaceOrientationLandscapeRight</string>' : ''}
    </array>
</dict>
</plist>`;

  await fs.writeFile(path.join(appDir, 'Info.plist'), infoPlistContent);
  
  // Create AppDelegate.swift
  const appDelegateContent = `import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
}`;

  await fs.writeFile(path.join(appDir, 'AppDelegate.swift'), appDelegateContent);
  
  // Create SceneDelegate.swift
  const sceneDelegateContent = `import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let _ = (scene as? UIWindowScene) else { return }
    }
}`;

  await fs.writeFile(path.join(appDir, 'SceneDelegate.swift'), sceneDelegateContent);
  
  // Create ViewController.swift
  const viewControllerContent = `import UIKit
import SafariServices

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        let titleLabel = UILabel()
        titleLabel.text = "${config.name}"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let descriptionLabel = UILabel()
        descriptionLabel.text = "To use this extension, you need to enable it in Safari settings."
        descriptionLabel.numberOfLines = 0
        descriptionLabel.textAlignment = .center
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let instructionsButton = UIButton(type: .system)
        instructionsButton.setTitle("Show Instructions", for: .normal)
        instructionsButton.addTarget(self, action: #selector(showInstructions), for: .touchUpInside)
        instructionsButton.translatesAutoresizingMaskIntoConstraints = false
        
        let settingsButton = UIButton(type: .system)
        settingsButton.setTitle("Open Safari Settings", for: .normal)
        settingsButton.addTarget(self, action: #selector(openSettings), for: .touchUpInside)
        settingsButton.translatesAutoresizingMaskIntoConstraints = false
        
        let stackView = UIStackView(arrangedSubviews: [titleLabel, descriptionLabel, instructionsButton, settingsButton])
        stackView.axis = .vertical
        stackView.spacing = 20
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(stackView)
        
        NSLayoutConstraint.activate([
            stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    @objc private func showInstructions() {
        let alertController = UIAlertController(
            title: "Enable Extension",
            message: "1. Open Safari\\n2. Tap the 'aA' button in the address bar\\n3. Select 'Manage Extensions'\\n4. Enable ${config.name}",
            preferredStyle: .alert
        )
        alertController.addAction(UIAlertAction(title: "OK", style: .default))
        present(alertController, animated: true)
    }
    
    @objc private func openSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }
}`;

  await fs.writeFile(path.join(appDir, 'ViewController.swift'), viewControllerContent);
  
  // Create Main.storyboard (placeholder)
  await fs.writeFile(path.join(appDir, 'Main.storyboard'), '<!-- Main storyboard placeholder -->');
  
  // Create LaunchScreen.storyboard (placeholder)
  await fs.writeFile(path.join(appDir, 'LaunchScreen.storyboard'), '<!-- Launch screen placeholder -->');
  
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

/**
 * Generates shared files
 */
async function generateSharedFiles(
  extensionInfo: ExtensionInfo,
  config: Config,
  outputPath: string
): Promise<void> {
  // Create project.xcconfig
  const xcconfigContent = `// Xcode configuration file
DEVELOPMENT_TEAM = ${config.teamId || ''}
PRODUCT_BUNDLE_IDENTIFIER = ${config.bundleId}
MARKETING_VERSION = ${config.version}
CURRENT_PROJECT_VERSION = 1
IPHONEOS_DEPLOYMENT_TARGET = ${config.ios.deploymentTarget}
MACOSX_DEPLOYMENT_TARGET = ${config.macos.deploymentTarget}
SWIFT_VERSION = 5.0
TARGETED_DEVICE_FAMILY = ${config.ios.devices.includes('iphone') && config.ios.devices.includes('ipad') ? '1,2' : config.ios.devices.includes('iphone') ? '1' : '2'}
`;

  await fs.writeFile(path.join(outputPath, 'project.xcconfig'), xcconfigContent);
}