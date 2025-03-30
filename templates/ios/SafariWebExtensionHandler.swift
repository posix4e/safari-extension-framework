import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    let logger = Logger(subsystem: "{{BUNDLE_IDENTIFIER}}", category: "extension")
    
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey] as? [String: Any]
        
        logger.log("Received message from browser.runtime.sendNativeMessage: \(String(describing: message))")
        
        // Process the message
        var responseMessage: [String: Any] = ["Response": "Received"]
        
        if let message = message {
            if let command = message["command"] as? String {
                switch command {
                case "checkSettings":
                    // Check if settings are configured
                    responseMessage["settingsConfigured"] = checkSettingsConfigured()
                case "getSettings":
                    // Get settings
                    responseMessage["settings"] = getSettings()
                case "saveSettings":
                    // Save settings
                    if let settings = message["settings"] as? [String: Any] {
                        let success = saveSettings(settings)
                        responseMessage["success"] = success
                    }
                default:
                    responseMessage["error"] = "Unknown command: \(command)"
                }
            }
        }
        
        // Send response
        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: responseMessage ]
        
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
    
    // MARK: - Settings Management
    
    private func checkSettingsConfigured() -> Bool {
        // Check if settings are configured
        // In a real implementation, this would check if the settings are stored in UserDefaults
        
        if let settings = UserDefaults.standard.dictionary(forKey: "ExtensionSettings") {
            // Check if required settings are present
            if let clientId = settings["clientId"] as? String, !clientId.isEmpty {
                return true
            }
        }
        
        return false
    }
    
    private func getSettings() -> [String: Any]? {
        // Get settings from UserDefaults
        return UserDefaults.standard.dictionary(forKey: "ExtensionSettings")
    }
    
    private func saveSettings(_ settings: [String: Any]) -> Bool {
        // Save settings to UserDefaults
        UserDefaults.standard.set(settings, forKey: "ExtensionSettings")
        return true
    }
}