module.exports = {
  name: "ChronicleSync",
  bundleId: "com.example.chroniclesync",
  version: "1.0.0",
  teamId: "ABCDE12345", // Your Apple Developer Team ID
  entitlements: {
    // Custom entitlements
  },
  capabilities: [
    "background",
    "content",
    "popup",
    "settings",
    "history"
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