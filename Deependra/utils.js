export async function getActiveTabURL() {
  let  tab = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tab[0];
}