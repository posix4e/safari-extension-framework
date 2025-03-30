#!/bin/bash

# Script to run the example

set -e

# Install dependencies
npm install

# Convert the Chrome extension to a Safari extension
npm run convert

# Build the iOS app (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  npm run build:ios
  npm run build:macos
  
  echo "iOS app built at: safari-extension/ios-app/dist/ChronicleSync-unsigned.ipa"
  echo "macOS app built at: safari-extension/macos-app/dist/ChronicleSync.app.zip"
else
  echo "Skipping iOS and macOS app builds (not running on macOS)"
fi

echo "Example completed successfully!"