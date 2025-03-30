# Safari Extension Framework

A framework for converting Chrome extensions to Safari extensions for macOS and iOS.

## Features

- **Chrome to Safari Conversion**: Automatically converts Chrome extensions to Safari extensions
- **iOS Support**: Generates Xcode projects for iOS Safari extensions
- **Testing Support**: Includes tools for testing Safari extensions on iOS
- **GitHub Actions Integration**: CI/CD workflows for building and testing Safari extensions
- **Settings Management**: Handles settings synchronization between platforms
- **Background Processing**: Controls background processing based on settings configuration

## Prerequisites

- macOS with Xcode 14+ installed (for building iOS and macOS apps)
- Node.js 16+ and npm
- Apple Developer Account (for signing and distribution)

## Quick Start

1. Install the framework:

```bash
npm install -g safari-extension-framework
```

2. Convert your Chrome extension:

```bash
safari-convert /path/to/chrome-extension
```

3. Build and test the Safari extension:

```bash
cd /path/to/safari-extension
# For iOS
cd ios-app
../../scripts/build-unsigned-ipa.sh MyExtension
# For macOS
cd ../macos-app
../../scripts/build-macos-app.sh MyExtension
```

## Example

Check out the [example](./example) directory for a complete example of how to use the framework.

```bash
cd example
./run-example.sh
```

## Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Project Structure

The framework generates the following structure:

```
safari-extension/
├── extension/        # The converted Safari extension
├── ios-app/          # iOS app wrapper for the Safari extension
│   ├── App/          # Main iOS app
│   └── Extension/    # Safari extension for iOS
├── macos-app/        # macOS app wrapper for the Safari extension
├── shared/           # Shared code between platforms
└── scripts/          # Build and deployment scripts
```

## Configuration

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

## GitHub Actions

The framework includes GitHub Actions workflows for CI/CD:

- `build.yml`: Builds the Safari extension for macOS and iOS
- `test.yml`: Tests the Safari extension on macOS
- `release.yml`: Creates a release with signed IPA and macOS app

## iOS Testing

To test the Safari extension on iOS:

1. Connect your iOS device to your Mac
2. Build the unsigned IPA:
   ```bash
   cd safari-extension/ios-app
   ../../scripts/build-unsigned-ipa.sh MyExtension
   ```
3. Install the IPA on your device using Xcode or a tool like [ios-deploy](https://github.com/ios-control/ios-deploy)
4. Follow the on-screen instructions to enable the extension

## Distribution

To distribute your Safari extension:

1. Configure your Apple Developer account in the config file
2. Set up the required environment variables:
   ```bash
   export APPLE_TEAM_ID=ABCDE12345
   export APPLE_API_KEY_ID=ABC123DEF456
   export APPLE_API_KEY_ISSUER_ID=12345-abcde-67890-fghij
   export APPLE_API_KEY_CONTENT="$(cat /path/to/your/private/key.p8)"
   ```
3. Build and upload to TestFlight:
   ```bash
   cd safari-extension/ios-app
   ../../scripts/build-testflight-ipa.sh MyExtension $APPLE_TEAM_ID
   ```

## License

MIT