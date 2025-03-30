# Safari Extension Framework Documentation

## Overview

The Safari Extension Framework is a tool for converting Chrome extensions to Safari extensions for macOS and iOS. It automates the process of creating Xcode projects, generating the necessary Swift code, and packaging the extensions for distribution.

## Installation

```bash
npm install -g safari-extension-framework
```

## Usage

### Basic Usage

```bash
safari-convert /path/to/chrome-extension
```

This will:
1. Analyze the Chrome extension
2. Convert it to a Safari extension
3. Generate iOS and macOS app projects
4. Create GitHub Actions workflows for CI/CD

### Options

```
Usage: safari-convert [options] <source>

Arguments:
  source                Path to the Chrome extension

Options:
  -V, --version         output the version number
  -o, --output <path>   Output directory (default: "./safari-extension")
  -c, --config <path>   Path to config file (default: "./safari-extension.config.js")
  --ios-only            Generate only iOS app (default: false)
  --macos-only          Generate only macOS app (default: false)
  --skip-config         Skip config file generation (default: false)
  -h, --help            display help for command
```

### Configuration

The framework can be configured using a `safari-extension.config.js` file:

```javascript
module.exports = {
  name: "My Extension",
  bundleId: "com.example.myextension",
  version: "1.0.0",
  teamId: "ABCDE12345", // Your Apple Developer Team ID
  entitlements: {
    // Custom entitlements
  },
  capabilities: [
    "background",
    "content",
    "popup",
    "settings"
  ],
  ios: {
    deploymentTarget: "15.0",
    devices: ["iphone", "ipad"],
    orientations: ["portrait", "landscape"]
  },
  macos: {
    deploymentTarget: "12.0"
  }
}
```

## Project Structure

The framework generates the following structure:

```
safari-extension/
├── extension/        # The converted Safari extension
├── ios-app/          # iOS app wrapper for the Safari extension
│   ├── App/          # Main iOS app
│   └── Extension/    # Safari extension for iOS
├── macos-app/        # macOS app wrapper for the Safari extension
└── .github/          # GitHub Actions workflows
```

## Building and Testing

### Building for iOS

```bash
cd safari-extension/ios-app
../../scripts/build-unsigned-ipa.sh MyExtension
```

This will generate an unsigned IPA file in the `dist` directory.

### Building for macOS

```bash
cd safari-extension/macos-app
../../scripts/build-macos-app.sh MyExtension
```

This will generate a macOS app bundle and zip file in the `dist` directory.

### Building for TestFlight

```bash
export APPLE_TEAM_ID=ABCDE12345
export APPLE_API_KEY_ID=ABC123DEF456
export APPLE_API_KEY_ISSUER_ID=12345-abcde-67890-fghij
export APPLE_API_KEY_CONTENT="$(cat /path/to/your/private/key.p8)"

cd safari-extension/ios-app
../../scripts/build-testflight-ipa.sh MyExtension $APPLE_TEAM_ID
```

This will build, sign, and upload the app to TestFlight.

## GitHub Actions

The framework generates GitHub Actions workflows for CI/CD:

- `build.yml`: Builds the Safari extension for macOS and iOS
- `test.yml`: Tests the Safari extension on macOS
- `release.yml`: Creates a release with signed IPA and macOS app

### Default Configuration

The GitHub Actions workflows are configured to work with the example directory by default. They include parameters to specify which directory to build and release:

```yaml
workflow_dispatch:
  inputs:
    example_dir:
      description: 'Example directory to build'
      required: false
      default: 'example'
      type: string
```

### Customizing Workflows

You can customize the workflows by:

1. Modifying the workflow files directly
2. Creating your own workflows that reference the example workflows
3. Using the workflow_dispatch event with custom inputs

## iOS App Structure

The iOS app includes:

- Main screen with instructions for enabling the extension
- Settings screen that loads the extension's settings page
- History screen that loads the extension's history page (if available)
- Safari extension that runs in the Safari browser

## macOS App Structure

The macOS app includes:

- Main screen with instructions for enabling the extension
- Button to open Safari extension preferences
- Safari extension that runs in the Safari browser

## Extension Capabilities

The framework supports the following extension capabilities:

- **Background Processing**: Service workers that run in the background
- **Content Scripts**: Scripts that run on web pages
- **Popup**: The popup UI that appears when clicking the extension icon
- **Settings**: The settings page for configuring the extension
- **History**: A page for viewing the extension's history

## Troubleshooting

### Common Issues

#### Extension Not Appearing in Safari

1. Make sure the extension is enabled in Safari settings
2. Check that the app has the correct entitlements
3. Verify that the extension's Info.plist is correctly configured

#### Background Processing Not Working

1. Check that the extension has the `background` capability enabled
2. Verify that the app has the correct app group entitlements
3. Make sure the background script is properly converted

#### Settings Not Saving

1. Check that the extension has the `settings` capability enabled
2. Verify that the settings page is correctly loaded in the WebView
3. Make sure the communication between the WebView and native code is working

## Advanced Topics

### Custom Entitlements

You can add custom entitlements to the app and extension by adding them to the `entitlements` section of the config file:

```javascript
entitlements: {
  "com.apple.security.network.client": true,
  "com.apple.security.application-groups": [
    "group.com.example.myextension"
  ]
}
```

### Custom Templates

You can customize the generated code by providing your own templates:

1. Create a `templates` directory in your project
2. Add your custom templates (e.g., `MainViewController.swift`, `SafariWebExtensionHandler.swift`)
3. The framework will use your templates instead of the built-in ones

### Localization

To add localization support:

1. Create a `Localizable.strings` file for each language
2. Add the files to the `shared` directory
3. The framework will include them in the generated projects