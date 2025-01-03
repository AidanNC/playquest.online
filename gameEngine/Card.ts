type Suit = "C" | "H" | "D" | "S";
const SUITS: Suit[] = ["S","H","C", "D",];
type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
const VALUES: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export type { Suit, Value };
export { SUITS, VALUES };

class Card {
	suit: Suit;
	value: Value;
	name: string;
	constructor(suit: Suit, value: Value) {
		this.suit = suit;
		this.value = value;
		this.name = value <= 9 ? String(value) : ["T", "J", "Q", "K", "A"][value - 10];
	}
	getValueAndSuit() {
		return { value: this.value, suit: this.suit };
	}
	getNameAndSuit() {
		return { name: this.name, suit: this.suit };
	}
	getSuit() {
		return this.suit;
	}
	print() {
		console.log(this.name + " " + this.suit);
	}
    toString():string{
        return this.name + " " + this.suit;
    }
	equals(card: Card) {
		return this.suit === card.suit && this.value === card.value;
	}
	compare(card: Card) {
		if(this.suit === card.suit){
			return this.value - card.value;
		}else{
			return SUITS.indexOf(this.suit) - SUITS.indexOf(card.suit);
		}
	}
	getNumericValue(){
		//spades -> hearts -> clubs -> diamonds
		//so 2 of spades has value 0
		return (SUITS.indexOf(this.suit) * 13) + (this.value - 2);
	}
}

//make sure to update backendimports/Card.ts if change this
export default Card;
