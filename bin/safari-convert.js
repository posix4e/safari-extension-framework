#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { convertExtension, generateIosApp, generateMacosApp } = require('../lib');

program
  .name('safari-convert')
  .description('Convert a Chrome extension to a Safari extension')
  .version('1.0.0')
  .argument('<source>', 'Path to the Chrome extension')
  .option('-o, --output <path>', 'Output directory', './safari-extension')
  .option('-c, --config <path>', 'Path to config file', './safari-extension.config.js')
  .option('--ios-only', 'Generate only iOS app', false)
  .option('--macos-only', 'Generate only macOS app', false)
  .option('--skip-config', 'Skip config file generation', false)
  .action(async (source, options) => {
    try {
      const sourcePath = path.resolve(source);
      const outputPath = path.resolve(options.output);
      
      // Check if source exists
      if (!fs.existsSync(sourcePath)) {
        console.error(`Error: Source directory "${sourcePath}" does not exist`);
        process.exit(1);
      }
      
      // Create output directory if it doesn't exist
      fs.ensureDirSync(outputPath);
      
      // Check if config file exists
      const configPath = path.resolve(options.config);
      let config;
      
      if (fs.existsSync(configPath) && !options.skipConfig) {
        config = require(configPath);
      } else if (!options.skipConfig) {
        // Generate config file
        config = await generateConfig(sourcePath);
        
        // Write config file
        fs.writeFileSync(
          configPath,
          `module.exports = ${JSON.stringify(config, null, 2)}`
        );
        
        console.log(`Config file generated at ${configPath}`);
      } else {
        console.log('Skipping config file generation');
        
        // Use default config
        config = {
          name: 'Safari Extension',
          bundleId: 'com.example.safariextension',
          version: '1.0.0',
          capabilities: ['background', 'content', 'popup', 'settings'],
          ios: {
            deploymentTarget: '15.0',
            devices: ['iphone', 'ipad'],
            orientations: ['portrait', 'landscape']
          },
          macos: {
            deploymentTarget: '12.0'
          }
        };
      }
      
      // Convert extension
      console.log(`Converting extension from ${sourcePath} to ${outputPath}`);
      const extensionInfo = await convertExtension(sourcePath, path.join(outputPath, 'extension'));
      
      // Generate iOS app
      if (!options.macosOnly) {
        await generateIosApp(extensionInfo, config, path.join(outputPath, 'ios-app'));
      }
      
      // Generate macOS app
      if (!options.iosOnly) {
        await generateMacosApp(extensionInfo, config, path.join(outputPath, 'macos-app'));
      }
      
      // Generate GitHub Actions workflows
      await generateGitHubWorkflows(outputPath);
      
      console.log(`Safari extension generated at ${outputPath}`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

/**
 * Generates a config file based on user input
 */
async function generateConfig(sourcePath) {
  // Read manifest.json
  const manifestPath = path.join(sourcePath, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Ask for configuration
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Extension name:',
      default: manifest.name || 'Safari Extension'
    },
    {
      type: 'input',
      name: 'bundleId',
      message: 'Bundle identifier:',
      default: `com.example.${manifest.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'safariextension'}`
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: manifest.version || '1.0.0'
    },
    {
      type: 'input',
      name: 'teamId',
      message: 'Apple Developer Team ID (optional):'
    },
    {
      type: 'checkbox',
      name: 'capabilities',
      message: 'Extension capabilities:',
      choices: [
        { name: 'Background processing', value: 'background', checked: !!manifest.background },
        { name: 'Content scripts', value: 'content', checked: !!manifest.content_scripts },
        { name: 'Popup', value: 'popup', checked: !!manifest.action?.default_popup },
        { name: 'Settings', value: 'settings', checked: !!manifest.options_ui },
        { name: 'History', value: 'history', checked: !!manifest.web_accessible_resources?.some(r => r.resources.some(f => f.includes('history.html'))) }
      ]
    },
    {
      type: 'input',
      name: 'iosDeploymentTarget',
      message: 'iOS deployment target:',
      default: '15.0'
    },
    {
      type: 'checkbox',
      name: 'iosDevices',
      message: 'iOS devices:',
      choices: [
        { name: 'iPhone', value: 'iphone', checked: true },
        { name: 'iPad', value: 'ipad', checked: true }
      ]
    },
    {
      type: 'checkbox',
      name: 'iosOrientations',
      message: 'iOS orientations:',
      choices: [
        { name: 'Portrait', value: 'portrait', checked: true },
        { name: 'Landscape', value: 'landscape', checked: true }
      ]
    },
    {
      type: 'input',
      name: 'macosDeploymentTarget',
      message: 'macOS deployment target:',
      default: '12.0'
    }
  ]);
  
  return {
    name: answers.name,
    bundleId: answers.bundleId,
    version: answers.version,
    teamId: answers.teamId || undefined,
    capabilities: answers.capabilities,
    ios: {
      deploymentTarget: answers.iosDeploymentTarget,
      devices: answers.iosDevices,
      orientations: answers.iosOrientations
    },
    macos: {
      deploymentTarget: answers.macosDeploymentTarget
    }
  };
}

/**
 * Generates GitHub Actions workflows
 */
async function generateGitHubWorkflows(outputPath) {
  const workflowsDir = path.join(outputPath, '.github', 'workflows');
  fs.ensureDirSync(workflowsDir);
  
  // Create build.yml
  const buildYml = `name: Build Safari Extension

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build extension
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: safari-extension
          path: |
            dist/*.ipa
            dist/*.app.zip
          retention-days: 7
`;

  await fs.writeFile(path.join(workflowsDir, 'build.yml'), buildYml);
  
  // Create test.yml
  const testYml = `name: Test Safari Extension

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
`;

  await fs.writeFile(path.join(workflowsDir, 'test.yml'), testYml);
  
  // Create release.yml
  const releaseYml = `name: Release Safari Extension

on:
  release:
    types: [ created ]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version number'
        required: true
        default: ''

jobs:
  release:
    runs-on: macos-latest
    env:
      APPLE_TEAM_ID: \${{ secrets.APPLE_TEAM_ID }}
      APPLE_API_KEY_ID: \${{ secrets.APPLE_API_KEY_ID }}
      APPLE_API_KEY_ISSUER_ID: \${{ secrets.APPLE_API_KEY_ISSUER_ID }}
      APPLE_API_KEY_CONTENT: \${{ secrets.APPLE_API_KEY_CONTENT }}
      
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Set version
        if: github.event.inputs.version != ''
        run: |
          npm version \${{ github.event.inputs.version }} --no-git-tag-version
      
      - name: Build and sign
        run: npm run build:release
      
      - name: Upload to TestFlight
        if: env.APPLE_TEAM_ID != ''
        run: npm run upload:testflight
      
      - name: Upload artifacts to release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.ipa
            dist/*.app.zip
`;

  await fs.writeFile(path.join(workflowsDir, 'release.yml'), releaseYml);
}

program.parse();