import UIKit
import SafariServices

class MainViewController: UIViewController {
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let instructionsButton = UIButton(type: .system)
    private let settingsButton = UIButton(type: .system)
    private let historyButton = UIButton(type: .system)
    private let safariButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        // Configure title label
        titleLabel.text = "{{APP_NAME}}"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure description label
        descriptionLabel.text = "To use this extension, you need to enable it in Safari settings."
        descriptionLabel.numberOfLines = 0
        descriptionLabel.textAlignment = .center
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure instructions button
        instructionsButton.setTitle("Show Instructions", for: .normal)
        instructionsButton.addTarget(self, action: #selector(showInstructions), for: .touchUpInside)
        instructionsButton.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure settings button
        settingsButton.setTitle("Open Settings", for: .normal)
        settingsButton.addTarget(self, action: #selector(openSettings), for: .touchUpInside)
        settingsButton.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure history button
        historyButton.setTitle("View History", for: .normal)
        historyButton.addTarget(self, action: #selector(viewHistory), for: .touchUpInside)
        historyButton.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure Safari button
        safariButton.setTitle("Open Safari", for: .normal)
        safariButton.addTarget(self, action: #selector(openSafari), for: .touchUpInside)
        safariButton.translatesAutoresizingMaskIntoConstraints = false
        
        // Create stack view
        let stackView = UIStackView(arrangedSubviews: [
            titleLabel,
            descriptionLabel,
            instructionsButton,
            settingsButton,
            historyButton,
            safariButton
        ])
        stackView.axis = .vertical
        stackView.spacing = 20
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        // Add stack view to view
        view.addSubview(stackView)
        
        // Set constraints
        NSLayoutConstraint.activate([
            stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
        
        // Check if the extension is already configured
        checkExtensionConfiguration()
    }
    
    private func checkExtensionConfiguration() {
        // In a real implementation, this would check if the extension is configured
        // For now, we'll just assume it's not configured
        
        // If not configured, show the settings screen automatically
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.openSettings()
        }
    }
    
    @objc private func showInstructions() {
        let alertController = UIAlertController(
            title: "Enable Extension",
            message: "1. Open Safari\n2. Tap the 'aA' button in the address bar\n3. Select 'Manage Extensions'\n4. Enable {{APP_NAME}}",
            preferredStyle: .alert
        )
        alertController.addAction(UIAlertAction(title: "OK", style: .default))
        present(alertController, animated: true)
    }
    
    @objc private func openSettings() {
        let settingsVC = SettingsViewController()
        navigationController?.pushViewController(settingsVC, animated: true)
    }
    
    @objc private func viewHistory() {
        let historyVC = HistoryViewController()
        navigationController?.pushViewController(historyVC, animated: true)
    }
    
    @objc private func openSafari() {
        if let url = URL(string: "https://www.apple.com") {
            UIApplication.shared.open(url)
        }
    }
}