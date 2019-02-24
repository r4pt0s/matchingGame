class CardDeck {
  constructor(deckSize = 10) {
    this.deckSize = deckSize;
    this.deckArray = [];
    this.selectedCards = { card1: null, card2: null };
    this.selectedCardsCount = 0;

    this.countPoints = 0;
    this.countMoves = 0;
  }

  addCardsToDeck(amount) {
    this.deckSize = amount;
    for (let i = 0; i < amount / 2; i++) {
      this.deckArray.push(`assets/card_front/${i}.png`);
    }

    this.deckArray.push(...this.deckArray);
    this.deckArray = this.shuffleCards(this.deckArray);
    console.log(this.deckArray);

    return this.deckArray;
  }

  shuffleCards(cardDeck) {
    let ctr = cardDeck.length;
    let temp = null;
    let index = null;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = cardDeck[ctr];
      cardDeck[ctr] = cardDeck[index];
      cardDeck[index] = temp;
    }
    return cardDeck;
  }

  activeCards(card) {
    if (this.selectedCards.card1 === null) {
      this.selectedCards.card1 = card;
      this.selectedCardsCount++;
      return { cardAsset: this.deckArray[card] };
    }

    this.selectedCards.card2 = card;
    this.selectedCardsCount++;
    return this.matchCards(this.deckArray[card]);
  }

  matchCards(cardAsset) {
    const resultobject = {
      matching: false,
      score: 0,
      cardAsset,
      cards: { ...this.selectedCards }
    };

    if (this.selectedCardsCount === 2) {
      resultobject.matching =
        this.deckArray[this.selectedCards.card1] ===
        this.deckArray[this.selectedCards.card2];

      if (resultobject.matching) {
        this.countPoints++;
        resultobject.score = this.countPoints;
      }
    }
    this.countMoves++;
    resultobject.moves = this.countMoves;
    this.resetActiveCards();

    return resultobject;
  }

  resetActiveCards() {
    this.selectedCards = { card1: null, card2: null };
    this.selectedCardsCount = 0;
  }

  gameFinished() {
    console.log(this.countPoints === this.deckSize / 2);
  }
}

export default CardDeck;
