module.exports = {
  name: 'ChronicleSync',
  bundleId: 'com.example.chroniclesync',
  version: '1.0.0',
  teamId: process.env.APPLE_TEAM_ID || '',
  capabilities: [
    'background',
    'content',
    'popup',
    'settings',
    'history'
  ],
  ios: {
    deploymentTarget: '15.0',
    devices: ['iphone', 'ipad'],
    orientations: ['portrait', 'landscape']
  },
  macos: {
    deploymentTarget: '12.0'
  }
};