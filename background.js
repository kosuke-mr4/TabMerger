chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab Merger Extension Installed :)");
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "mergeTabs") {
    try {
      let mergeInto = parseInt(request.mergeInto);
      let mergeFrom = parseInt(request.mergeFrom);

      if (mergeInto !== mergeFrom) {
        // マージ元のウィンドウからタブを取得
        let tabs = await chrome.tabs.query({ windowId: mergeFrom });
        for (const tab of tabs) {
          // 各タブをマージ先ウィンドウに移動
          await chrome.tabs.move(tab.id, { windowId: mergeInto, index: -1 });
        }
      }
      sendResponse({ status: "success" });
      console.log("success");
    } catch (error) {
      console.log("Error: " + error.message);
      sendResponse({ status: "error", message: error.message });
    }
  }
  return true; // 非同期レスポンスを示すために必要
});
