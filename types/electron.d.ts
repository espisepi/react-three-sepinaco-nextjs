export interface ElectronAPI {
    on: (channel: string, callback: (...args: any[]) => void) => void;
    send: (channel: string, args?: any) => void;
    removeAllListeners: (channel: string) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

