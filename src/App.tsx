import { useState, useEffect } from "react";

function App() {
  const [windows, setWindows] = useState<chrome.windows.Window[]>([]);
  const [selectedWindow1, setSelectedWindow1] = useState(
    String(windows && windows.length > 0 ? String(windows[0].id) : "---")
  );
  const [selectedWindow2, setSelectedWindow2] = useState(
    String(windows && windows.length > 0 ? String(windows[0].id) : "---")
  );

  useEffect(() => {
    chrome.windows.getAll({ populate: true }, (windows) => {
      setWindows(windows);
    });
  }, []);

  useEffect(() => {
    if (windows.length > 0) {
      setSelectedWindow1(String(windows[0].id));
      setSelectedWindow2(String(windows[0].id));
    }
  }, [windows]);

  let mergeTabs = () => {
    console.log("mergeTabs");
    console.log(selectedWindow1, selectedWindow2);
    chrome.runtime
      .sendMessage({
        action: "mergeTabs" as const,
        mergeInto: parseInt(selectedWindow1),
        mergeFrom: parseInt(selectedWindow2),
      })
      .catch((err) => {
        window.alert("Error merging tabs");
        console.log(err);
      });
  };

  return (
    <div>
      <select
        value={selectedWindow1}
        onChange={(e) => setSelectedWindow1(e.target.value)}
      >
        {windows.map((w) => (
          <option value={w.id}>Window {w.id}</option>
        ))}
      </select>

      <select
        value={selectedWindow2}
        onChange={(e) => setSelectedWindow2(e.target.value)}
      >
        {windows.map((w) => (
          <option value={w.id}>Window {w.id}</option>
        ))}
      </select>

      <button onClick={mergeTabs}>Merge Tabs</button>
    </div>
  );
}

export default App;
