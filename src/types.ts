export interface Config {
  name: string;
  bundleId: string;
  version: string;
  teamId?: string;
  entitlements?: Record<string, any>;
  capabilities: Array<'background' | 'content' | 'popup' | 'settings' | 'history'>;
  ios: {
    deploymentTarget: string;
    devices: Array<'iphone' | 'ipad'>;
    orientations: Array<'portrait' | 'landscape'>;
  };
  macos: {
    deploymentTarget: string;
  };
}

export interface ChromeManifest {
  manifest_version: number;
  name: string;
  version: string;
  description: string;
  action?: {
    default_popup?: string;
  };
  options_ui?: {
    page: string;
    open_in_tab?: boolean;
  };
  background?: {
    service_worker: string;
    type?: string;
  };
  content_scripts?: Array<{
    matches: string[];
    js: string[];
    css?: string[];
    run_at?: string;
  }>;
  permissions?: string[];
  host_permissions?: string[];
  web_accessible_resources?: Array<{
    resources: string[];
    matches: string[];
  }>;
}

export interface ExtensionInfo {
  manifest: ChromeManifest;
  hasPopup: boolean;
  hasSettings: boolean;
  hasBackground: boolean;
  hasContentScripts: boolean;
  hasHistory: boolean;
  popupFile?: string;
  settingsFile?: string;
  backgroundFile?: string;
  contentScriptFiles?: string[];
  historyFile?: string;
}