chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed :)");
});

chrome.runtime.onMessage.addListener(
  async (
    request: { action: string; mergeInto: string; mergeFrom: string },
    __: chrome.runtime.MessageSender,
    sendResponse: (response: { status: string; message?: string }) => void
  ) => {
    if (request.action === "mergeTabs") {
      console.log("mergeTabs");
      try {
        const mergeInto: number = parseInt(request.mergeInto);
        const mergeFrom: number = parseInt(request.mergeFrom);

        if (mergeInto !== mergeFrom) {
          const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
            windowId: mergeFrom,
          });
          for (const tab of tabs) {
            if (tab.id !== undefined) {
              await chrome.tabs.move(tab.id, {
                windowId: mergeInto,
                index: -1,
              });
            }
          }
        }
        sendResponse({ status: "success" });
      } catch (error: any) {
        sendResponse({ status: "error", message: error.message });
      }
      return true;
    }
  }
);
