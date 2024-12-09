import Card, { SUITS, VALUES } from "./Card";
class Deck {
    cards : Card[] = [];
    constructor() {
        //put all the cards in the deck
        this.resetDeck();
    }
    resetDeck(){
        this.cards = [];
        SUITS.forEach((suit)=>{
            VALUES.forEach((value)=>{
                this.cards.push(new Card(suit,value));
            });
        });
        this.shuffleDeck();
    }
    //fisher yates
    //works by swapping each element with another element at a random index
    shuffleDeck(){
        for(let i = this.cards.length-1; i > 0; i--){
            const j = Math.floor(Math.random()*i);
            const temp = this.cards[j];
            this.cards[j] = this.cards[i];
            this.cards[i] = temp;
        }
    }
    printDeck(){
        this.cards.forEach((card)=>{
            card.print();
        });
    }
    
    drawCard(): Card{
        const card = this.cards.pop();
        if (card === undefined){
            throw new Error("Deck is empty");
        }
        return card;
    }
    deckSize(){
        return this.cards.length;
    }
}

export default Deck;