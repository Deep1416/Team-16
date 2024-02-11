(() => {
  let youtubeLeftControls;
  let youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];


  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    console.log(sender, obj, response);
    const { type, videoId , value } = obj;
    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }else if(type === "PLAY"){
      youtubePlayer.currentTime = value;
    }else if(type ==="DELETE"){
      currentVideoBookmarks = currentVideoBookmarks.filter((b) =>b.time != value);
      chrome.storage.sync.set({[currentVideo] : JSON.stringify(currentVideoBookmarks)});
      response(currentVideoBookmarks);
    }
  });



  const fetchStroage = () =>{
    return new Promise((resolve) =>{
      chrome.storage.sync.get([currentVideo] , (obj) =>{
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    })
  }

  let newVideoLoaded = async () => {
    // console.log("NewVideo");
    const bookmarksExist = document.querySelector(".bookmarks-Exist");
    currentVideoBookmarks = await fetchStroage();
    // console.log(bookmarksExist);

    if (!bookmarksExist) {
      let bookmarkImg = document.createElement("img");
      bookmarkImg.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkImg.className = "ytp-button " + "bookmarks-Exist";
      youtubeLeftControls = document.querySelector(".ytp-left-controls");
    console.log("hello Shubham")
      youtubeLeftControls.appendChild(bookmarkImg);
      youtubePlayer = document.getElementsByClassName("video-stream")[0];
    //   console.log(youtubePlayer);
      bookmarkImg.addEventListener("click", addBookmarkHandler);
    }
  };

  const addBookmarkHandler =async () => {
    let currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmarka at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchStroage();
    console.log(currentVideoBookmarks);

    // console.log(newBookmark.desc);
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });

    console.log(newBookmark);
  };
  newVideoLoaded();
})();

const getTime = (t) => {
  let date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substr(11, 8);
};

// console.log(getTime());

// console.log(this);
