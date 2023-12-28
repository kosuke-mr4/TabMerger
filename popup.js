document.addEventListener("DOMContentLoaded", function () {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let mergeIntoSelect = document.getElementById("mergeInto");
    let mergeFromSelect = document.getElementById("mergeFrom");

    windows.forEach(function (window) {
      let option = document.createElement("option");
      option.value = window.id;
      option.text = "Window " + window.id;
      mergeIntoSelect.appendChild(option.cloneNode(true));
      mergeFromSelect.appendChild(option);
    });
  });

  document.getElementById("mergeTabs").addEventListener("click", function () {
    let mergeInto = document.getElementById("mergeInto").value;
    let mergeFrom = document.getElementById("mergeFrom").value;
    chrome.runtime.sendMessage({
      action: "mergeTabs",
      mergeInto: mergeInto,
      mergeFrom: mergeFrom,
    });
  });
});
