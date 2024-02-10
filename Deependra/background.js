chrome.tabs.onUpdated.addListener((tabId, tab )=>{
    if(tab.url && tab.url.includes("https://www.youtube.com/watch")){
        const parameter = tab.url.split("?")[1]; // v=xyz...
        console.log(parameter);
        const urlParameter = new URLSearchParams(parameter);
        // console.log(URLSearchParams);
        // console.log(urlParameter.values);
        chrome.tabs.sendMessage(tabId , {
            type : "NEW",
            videoId : urlParameter.get("v"), // we have go to content.js
        })
    }
});
