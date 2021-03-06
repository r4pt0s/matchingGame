import CardDeck from "./CardDeck.js";

const cardDeck = document.querySelector(".game-content-wrapper");
const gameControls = document.querySelector(".game-control-wrapper");
const gameDetails = document.querySelector(".game-details-wrapper");
const gameScore = document.querySelector(".score > span");
const gameMoves = document.querySelector(".moves > span");
let gameDurationHandler = null;
let gameLevel = 1;
let game = null;

const createContainerDiv = (cssClass, { attribute, value } = {}) => {
  const containerDiv = document.createElement("DIV");
  containerDiv.classList.add(cssClass);

  if (attribute) containerDiv.setAttribute(attribute, value);

  return containerDiv;
};

const createCardDiv = (cssClass, srcString = "") => {
  const cardFaceContainer = createContainerDiv(cssClass);
  const cardFaceImg = document.createElement("IMG");
  cardFaceImg.setAttribute("src", `${srcString}`);
  cardFaceContainer.appendChild(cardFaceImg);

  return cardFaceContainer;
};

const createCard = index => {
  //div class card
  const card = createContainerDiv("card", {
    attribute: "data-key",
    value: index
  });

  card.appendChild(createCardDiv("front"));
  card.appendChild(createCardDiv("back", "assets/card_back/ztm.png"));

  cardDeck.appendChild(card);
};

cardDeck.addEventListener("click", e => {
  const parentEventContainer = e.target.parentElement.parentElement;
  const cardClassList = parentEventContainer.classList;

  if (cardClassList.contains("card") && !cardClassList.contains("active")) {
    const result = game.activeCards(
      parentEventContainer.getAttribute("data-key")
    );
    const cardFrontFaceImg = parentEventContainer.querySelector("img");
    const endOfGame = game.gameFinished();

    if (endOfGame) {
      cardDeck.innerHTML = `
    <div class="overlay">
      <p>Congratulations your score is: ${endOfGame}</p>
    </div>`;
      clearInterval(gameDurationHandler);
    }

    parentEventContainer.classList.add("active");

    //set card front face
    cardFrontFaceImg.setAttribute("src", result.cardAsset);
    //flip card to show front face
    parentEventContainer.style.transform = "rotateY(180deg)";
    if (result.matching === false) {
      setTimeout(() => {
        Object.values(result.cards).forEach(cardKey => {
          const activeCard = document.querySelector(
            `div[data-key= "${cardKey}"]`
          );

          activeCard.style.transform = "rotateY(0deg)";
          activeCard.classList.toggle("active");

          setTimeout(() => {
            const cardFrontFaceImg = activeCard.querySelector("img");
            cardFrontFaceImg.setAttribute("src", "");
          }, 500);
        });
      }, 600);
    }
    if (result.score) gameScore.textContent = result.score;
    if (result.moves) gameMoves.textContent = result.moves;
  }
});

const formatTimeString = numb => (numb < 10 ? `0${numb}` : numb);

gameControls.addEventListener("click", e => {
  clearInterval(gameDurationHandler);

  if (event.target.nodeName === "BUTTON") {
    const formattedTime = [0, 0];
    game = new CardDeck();

    gameControls
      .querySelectorAll("button")
      .forEach(btn => btn.classList.remove("active"));

    event.target.classList.add("active");

    gameLevel = Number(e.target.getAttribute("data-level")) * 10;
    const gameTime = gameDetails.querySelector(".time > span");
    cardDeck.innerHTML = "";

    game.addCardsToDeck(gameLevel);
    gameDurationHandler = setInterval(() => {
      if (formattedTime[1] % 60 === 0 && formattedTime[1] > 0) {
        formattedTime[0]++;
        formattedTime[1] = 0;
      } else {
        formattedTime[1]++;
      }

      gameTime.textContent = `${formatTimeString(
        formattedTime[0]
      )}:${formatTimeString(formattedTime[1])}`;
    }, 1000);

    for (let i = 0; i < gameLevel; i++) {
      createCard(i);
    }
  }
});
