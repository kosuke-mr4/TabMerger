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

  function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: "scale(1.5) rotate(180deg)" }}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }

  function getActiveTabTitle(windowId: string) {
    let activeTabTitle = "";
    windows.forEach((w) => {
      if (w.id === Number(windowId)) {
        w.tabs?.forEach((t) => {
          if (t.active) {
            activeTabTitle = t.title || "";
          }
        });
      }
    });
    return activeTabTitle;
  }

  function getActiveTabImage(windowId: string) {
    let activeTabImage = "";
    windows.forEach((w) => {
      if (w.id === Number(windowId)) {
        w.tabs?.forEach((t) => {
          if (t.active) {
            activeTabImage = t.favIconUrl || "";
          }
        });
      }
    });
    return activeTabImage;
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">マージ先</h2>
            <select
              value={selectedWindow1}
              onChange={(e) => setSelectedWindow1(e.target.value)}
            >
              {windows.map((w) => (
                <option value={w.id}>Window {w.id}</option>
              ))}
            </select>

            <div className="flex mt-2">
              <img
                src={getActiveTabImage(selectedWindow1)}
                alt=" "
                className="h-5 w-auto m-0.5	drop-shadow-xl mr-1"
              />
              <p className="text-sm">{getActiveTabTitle(selectedWindow1)}</p>
            </div>
          </div>
          <ArrowRightIcon className="mx-4 my-2 text-gray-600 w-6 h-6" />
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">マージ元</h2>
            <select
              value={selectedWindow2}
              onChange={(e) => setSelectedWindow2(e.target.value)}
            >
              {windows.map((w) => (
                <option value={w.id}>Window {w.id}</option>
              ))}
            </select>

            <div className="flex mt-2">
              <img
                src={getActiveTabImage(selectedWindow2)}
                alt=" "
                className="h-5 w-auto m-0.5	drop-shadow-xl mr-1"
              />
              <p className="text-sm">{getActiveTabTitle(selectedWindow2)}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              selectedWindow1 === selectedWindow2
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={mergeTabs}
            disabled={selectedWindow1 === selectedWindow2}
          >
            Merge Tabs
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
