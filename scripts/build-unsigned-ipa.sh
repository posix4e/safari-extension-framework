#!/bin/bash

# Script to build an unsigned IPA for testing

set -e

# Configuration
PROJECT_NAME="$1"
CONFIGURATION="Debug"
WORKSPACE="${PROJECT_NAME}.xcworkspace"
SCHEME="${PROJECT_NAME}"
BUILD_DIR="build"
ARCHIVE_PATH="${BUILD_DIR}/${PROJECT_NAME}.xcarchive"
OUTPUT_DIR="dist"
IPA_NAME="${PROJECT_NAME}-unsigned.ipa"

# Check if project name is provided
if [ -z "$PROJECT_NAME" ]; then
  echo "Error: Project name not provided"
  echo "Usage: $0 <project_name>"
  exit 1
fi

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
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO

# Create IPA
echo "Creating IPA..."
mkdir -p "${BUILD_DIR}/Payload"
cp -r "${ARCHIVE_PATH}/Products/Applications/${PROJECT_NAME}.app" "${BUILD_DIR}/Payload/"
cd "$BUILD_DIR"
zip -r "../${OUTPUT_DIR}/${IPA_NAME}" Payload
cd ..

# Clean up
rm -rf "$BUILD_DIR"

echo "Unsigned IPA created at ${OUTPUT_DIR}/${IPA_NAME}"