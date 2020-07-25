interface AppVersion {
  version: string;
  commit: string;
  branch: string;
}

declare global {
  interface Window {
    appVersion: AppVersion;
  }
}

export const appVersion = {
  version: VERSION,
  commit: COMMITHASH,
  branch: BRANCH
};

