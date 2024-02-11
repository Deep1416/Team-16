import { getActiveTabURL } from "./utils.js";

let addNewBook = (bookmarkbtn , bookmarkbtnTwo) =>{
let container = document.createElement("div");
let innerContainer = document.createElement("div");
let containerBtn = document.createElement("div");

container.textContent = bookmarkbtnTwo.desc;
container.className = "conatiner-tittle";
innerContainer.className = "conatiner-controls";

setBookAttribute("assets/play.png" , onplay ,innerContainer );

setBookAttribute("assets/delete.png" , onDeleted , innerContainer);


containerBtn.id = "bookmark-" + bookmarkbtnTwo.time;
containerBtn.className = "bookmark1";
containerBtn.setAttribute("timestamp", bookmarkbtnTwo.time);

containerBtn.appendChild(container);
containerBtn.appendChild(innerContainer);
bookmarkbtn.appendChild(containerBtn);
};

let viewBookmark = (bookmarks =[]) =>{
    let bookmarkTag = document.getElementById("bookmark");
    bookmarkTag.innerHTML = "";
    if(bookmarks.length > 0){
        for(let i = 0 ; i < bookmarks.length ;i++){
            const bookmarkDiv = bookmarks[i];
            addNewBook(bookmarkTag , bookmarkDiv);
        }
    }else{
        bookmarkTag.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
    return;
};

let onplay = async(e)=>{
    let bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    console.log(bookmarkTime);
    let active = await getActiveTabURL();

    chrome.tabs.sendMessage(active.id, {
        type: "PLAY",
        value: bookmarkTime,
      });
    };

let onDeleted = async(e) =>{
    let active = await getActiveTabURL();
    let bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    console.log(bookmarkTime);

    let bookmarkDelete = document.getElementById("bookmark-" + bookmarkTime);

    bookmarkDelete.parentNode.removeChild(bookmarkDelete);
    chrome.tabs.sendMessage(active.id, {
        type: "DELETE",
        value: bookmarkTime,
      },viewBookmark);
};

let setBookAttribute = (src , event , controlElement) => {
    let control = document.createElement("img");

    control.src = src ;

    control.addEventListener("click" , event);
    controlElement.appendChild(control);

};

document.addEventListener( "DOMContentLoaded" , async () =>{ 
    const activeTab = await getActiveTabURL();
    const query = activeTab.url.split("?")[1];
    const urlparameter = new URLSearchParams(query);

    const currentVideo = urlparameter.get("v");

    if(currentVideo && activeTab.url.includes("https://www.youtube.com/watch")){
        chrome.storage.sync.get([currentVideo] , (data) =>{
            const currentBookmark = data[currentVideo] ? JSON.parse(data[currentVideo]) :[];
            viewBookmark(currentBookmark);
        })
    }else{
        let container = document.getElementById("box");
        container.innerHTML = "<div class ='tittle'> This is youtube video page.</div>" 
    }
});