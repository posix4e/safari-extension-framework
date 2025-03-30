import UIKit
import SafariServices
import WebKit

class SettingsViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        setupActivityIndicator()
        loadSettingsPage()
    }
    
    private func setupWebView() {
        let configuration = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        
        // Add script message handlers for communication between JS and Swift
        userContentController.add(self, name: "settingsSaved")
        userContentController.add(self, name: "settingsError")
        
        configuration.userContentController = userContentController
        
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.navigationDelegate = self
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(webView)
    }
    
    private func setupActivityIndicator() {
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
    }
    
    private func loadSettingsPage() {
        activityIndicator.startAnimating()
        
        // Get the URL to the settings.html file in the extension bundle
        if let extensionBundle = Bundle(identifier: "{{BUNDLE_IDENTIFIER}}.Extension"),
           let settingsURL = extensionBundle.url(forResource: "settings", withExtension: "html") {
            webView.loadFileURL(settingsURL, allowingReadAccessTo: settingsURL.deletingLastPathComponent())
        } else {
            showError("Could not load settings page")
        }
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showError("Failed to load settings: \(error.localizedDescription)")
    }
    
    // MARK: - WKScriptMessageHandler
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "settingsSaved":
            if let messageBody = message.body as? [String: Any],
               let success = messageBody["success"] as? Bool {
                if success {
                    showAlert(title: "Success", message: "Settings saved successfully")
                } else {
                    showError(messageBody["error"] as? String ?? "Unknown error")
                }
            }
        case "settingsError":
            if let messageBody = message.body as? [String: Any],
               let errorMessage = messageBody["error"] as? String {
                showError(errorMessage)
            }
        default:
            break
        }
    }
    
    // MARK: - Helper Methods
    
    private func showError(_ message: String) {
        showAlert(title: "Error", message: message)
    }
    
    private func showAlert(title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default))
        present(alertController, animated: true)
    }
}