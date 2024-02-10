import { getActiveTabURL } from "./utils.js";

let addNewBook = () =>{
    
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

let onplay =(e)=>{};

let onDeleted = (e) =>{};

let setBookAttribute = () => {};

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