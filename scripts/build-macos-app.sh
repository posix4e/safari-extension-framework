#!/bin/bash

# Script to build and sign a macOS app

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
APP_NAME="${PROJECT_NAME}.app"
ZIP_NAME="${PROJECT_NAME}.app.zip"

# Check if project name and team ID are provided
if [ -z "$PROJECT_NAME" ]; then
  echo "Error: Project name not provided"
  echo "Usage: $0 <project_name> [team_id]"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Clean build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Build and archive the app
echo "Building and archiving the app..."
if [ -z "$TEAM_ID" ]; then
  # Build without signing
  xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO
else
  # Build with signing
  xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    DEVELOPMENT_TEAM="$TEAM_ID"
fi

# Create exportOptions.plist
if [ -n "$TEAM_ID" ]; then
  cat > "${BUILD_DIR}/exportOptions.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>developer-id</string>
    <key>teamID</key>
    <string>${TEAM_ID}</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

  # Export app
  echo "Exporting app..."
  xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportOptionsPlist "${BUILD_DIR}/exportOptions.plist" \
    -exportPath "$OUTPUT_DIR"
else
  # Copy app from archive
  echo "Copying app from archive..."
  cp -r "${ARCHIVE_PATH}/Products/Applications/${APP_NAME}" "${OUTPUT_DIR}/"
fi

# Create zip file
echo "Creating zip file..."
cd "$OUTPUT_DIR"
zip -r "$ZIP_NAME" "$APP_NAME"
cd ..

# Clean up
rm -rf "$BUILD_DIR"

echo "macOS app built and packaged: ${OUTPUT_DIR}/${ZIP_NAME}"