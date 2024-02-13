document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let flag = 0;
  let width = 10;
  let squares = [];
  let bombAmout = 20;
  let isGameOver = false;

  function createBox() {
    const bombArray = Array(bombAmout).fill("bomb");
    const emptyArray = Array(width * width - bombAmout).fill("valid");
    // console.log(bombArray)
    // console.log(emptyArray)

    const gameArray = emptyArray.concat(bombArray);
    // console.log(gameArray)

    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    // console.log(shuffledArray)

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener("click", function (e) {
        clicks(square);
      });
      square.oncontextmenu = function (e) {
        e.preventDefault();
        createFlag(square);
      };
    }

    //Adding Numbers
    for (let i = 0; i < squares.length; i++) {
      const isLeftEdge = i % width === 0;
      const isRightEdge = i === width - 1;

      if (squares[i].classList.contains("valid")) {
        let total = 0;
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++;

        squares[i].setAttribute("data", total);
        // console.log(squares[i])
      }
    }
  }

  createBox();

  function createFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flag < bombAmout) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "flag";
        flag++;
        checkWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flag--;
      }
    }
  }
  //clicks on square action

  function clicks(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  //check neighboring sqares once a scqare is clicked

  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId - width)].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }

      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
      if (currentId < 89 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        clicks(newSquare);
      }
    }, 10);
  }

  function gameOver(square) {
    console.log("Boom game over");
    isGameOver = true;

    squares.forEach((elem) => {
      if (elem.classList.contains("bomb")) square.innerHTML = "bomb";
    });
  }

  function checkWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmout) {
        console.log("you won");
        isGameOver = true;
      }
    }
  }
});
