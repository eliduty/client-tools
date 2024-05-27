export function invoke(channel: string, ...arg: any[]) {
 return window.ipcRenderer.invoke(channel, ...arg);
}
