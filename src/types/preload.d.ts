// src/types/preload.d.ts

export {}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>
        send(channel: string, ...args: any[]): void
        on(
          channel: string,
          listener: (event: any, ...args: any[]) => void
        ): void
        once(
          channel: string,
          listener: (event: any, ...args: any[]) => void
        ): void
        removeAllListeners(channel: string): void
      }
    }
  }
}
