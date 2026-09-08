chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, {
    type: "KEYBOARD_COMMAND",
    command,
  });
});
