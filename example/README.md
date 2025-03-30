# Safari Extension Example

This is an example project that demonstrates how to use the Safari Extension Framework to convert a Chrome extension to a Safari extension.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Convert the Chrome extension to a Safari extension:

```bash
npm run convert
```

3. Build the iOS app:

```bash
npm run build:ios
```

4. Build the macOS app:

```bash
npm run build:macos
```

## TestFlight Distribution

To build and upload the app to TestFlight, you need to set the following environment variables:

```bash
export APPLE_TEAM_ID=ABCDE12345
export APPLE_API_KEY_ID=ABC123DEF456
export APPLE_API_KEY_ISSUER_ID=12345-abcde-67890-fghij
export APPLE_API_KEY_CONTENT="$(cat /path/to/your/private/key.p8)"
```

Then run:

```bash
npm run build:testflight
```

## Project Structure

After running the conversion, the project will have the following structure:

```
safari-extension/
├── extension/        # The converted Safari extension
├── ios-app/          # iOS app wrapper for the Safari extension
│   ├── App/          # Main iOS app
│   └── Extension/    # Safari extension for iOS
├── macos-app/        # macOS app wrapper for the Safari extension
└── .github/          # GitHub Actions workflows
```