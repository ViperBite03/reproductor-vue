// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (...args) => ipcRenderer.send(...args),

    on: (...args) => ipcRenderer.on(...args),

    invoke: (...args) => ipcRenderer.invoke(...args),
  },
});
