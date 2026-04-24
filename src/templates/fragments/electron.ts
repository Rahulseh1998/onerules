import type { RuleSet } from "../../types.js";

export function getElectronRules(): RuleSet {
  return {
    projectContext: "This is an Electron desktop application.",
    codingPatterns: [
      "Separate main process (Node.js) and renderer process (browser) clearly. Use IPC (`ipcMain`/`ipcRenderer`) for communication.",
      "Use `contextBridge.exposeInMainWorld()` to safely expose APIs to the renderer. Never expose the entire `electron` module.",
      "Use `preload.js` as the bridge between main and renderer. It runs in a sandboxed context.",
      "Use Electron's built-in APIs (dialog, notification, tray, menu) instead of npm packages for platform features.",
    ],
    security: [
      "Always enable `contextIsolation: true` and `nodeIntegration: false` in BrowserWindow options.",
      "Validate all IPC messages in the main process. The renderer is untrusted — treat IPC like an API boundary.",
      "Never load remote content in a BrowserWindow without validating the URL. Set a strict CSP.",
    ],
    doNot: [
      "DO NOT use `nodeIntegration: true`. It gives the renderer full Node.js access — any XSS becomes an RCE.",
      "DO NOT use `remote` module. It's deprecated and a security risk. Use IPC.",
      "DO NOT put file system or shell operations in the renderer. Do them in the main process, expose via IPC.",
    ],
  };
}
