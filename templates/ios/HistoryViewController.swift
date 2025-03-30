import UIKit
import SafariServices
import WebKit

class HistoryViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        setupActivityIndicator()
        loadHistoryPage()
    }
    
    private func setupWebView() {
        let configuration = WKWebViewConfiguration()
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
    
    private func loadHistoryPage() {
        activityIndicator.startAnimating()
        
        // Get the URL to the history.html file in the extension bundle
        if let extensionBundle = Bundle(identifier: "{{BUNDLE_IDENTIFIER}}.Extension"),
           let historyURL = extensionBundle.url(forResource: "history", withExtension: "html") {
            webView.loadFileURL(historyURL, allowingReadAccessTo: historyURL.deletingLastPathComponent())
        } else {
            showError("Could not load history page")
        }
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showError("Failed to load history: \(error.localizedDescription)")
    }
    
    // MARK: - Helper Methods
    
    private func showError(_ message: String) {
        let alertController = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default))
        present(alertController, animated: true)
    }
}