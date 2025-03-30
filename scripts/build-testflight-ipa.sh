#!/bin/bash

# Script to build and sign an IPA for TestFlight

set -e

# Configuration
PROJECT_NAME="$1"
TEAM_ID="$2"
CONFIGURATION="Release"
WORKSPACE="${PROJECT_NAME}.xcworkspace"
SCHEME="${PROJECT_NAME}"
BUILD_DIR="build"
ARCHIVE_PATH="${BUILD_DIR}/${PROJECT_NAME}.xcarchive"
OUTPUT_DIR="dist"
IPA_NAME="${PROJECT_NAME}.ipa"

# Check if project name and team ID are provided
if [ -z "$PROJECT_NAME" ] || [ -z "$TEAM_ID" ]; then
  echo "Error: Project name or team ID not provided"
  echo "Usage: $0 <project_name> <team_id>"
  exit 1
fi

# Check if API key is available
if [ -z "$APPLE_API_KEY_ID" ] || [ -z "$APPLE_API_KEY_ISSUER_ID" ] || [ -z "$APPLE_API_KEY_CONTENT" ]; then
  echo "Error: Apple API key environment variables not set"
  echo "Please set APPLE_API_KEY_ID, APPLE_API_KEY_ISSUER_ID, and APPLE_API_KEY_CONTENT"
  exit 1
fi

# Create API key file
echo "Creating API key file..."
mkdir -p ~/.appstoreconnect/private_keys
echo "$APPLE_API_KEY_CONTENT" > ~/.appstoreconnect/private_keys/AuthKey_${APPLE_API_KEY_ID}.p8

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Clean build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Build and archive the app
echo "Building and archiving the app..."
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  DEVELOPMENT_TEAM="$TEAM_ID"

# Create exportOptions.plist
cat > "${BUILD_DIR}/exportOptions.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>${TEAM_ID}</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
EOF

# Export IPA
echo "Exporting IPA..."
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "${BUILD_DIR}/exportOptions.plist" \
  -exportPath "$OUTPUT_DIR"

# Rename IPA if needed
if [ -f "${OUTPUT_DIR}/${PROJECT_NAME}.ipa" ]; then
  mv "${OUTPUT_DIR}/${PROJECT_NAME}.ipa" "${OUTPUT_DIR}/${IPA_NAME}"
fi

# Upload to TestFlight
echo "Uploading to TestFlight..."
xcrun altool --upload-app \
  --type ios \
  --file "${OUTPUT_DIR}/${IPA_NAME}" \
  --apiKey "$APPLE_API_KEY_ID" \
  --apiIssuer "$APPLE_API_KEY_ISSUER_ID"

# Clean up
rm -rf "$BUILD_DIR"
rm ~/.appstoreconnect/private_keys/AuthKey_${APPLE_API_KEY_ID}.p8

echo "IPA built, signed, and uploaded to TestFlight: ${OUTPUT_DIR}/${IPA_NAME}"