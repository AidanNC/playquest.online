type Suit = "C" | "H" | "D" | "S";
const SUITS: Suit[] = ["C", "H", "D", "S"];
type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
const VALUES: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export { Suit, SUITS, Value, VALUES };

class Card {
	suit: Suit;
	value: Value;
	name: string;
	constructor(suit: Suit, value: Value) {
		this.suit = suit;
		this.value = value;
		this.name = value <= 10 ? String(value) : ["J", "Q", "K", "A"][value - 11];
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
}

//make sure to update backendimports/Card.ts if change this
export default Card;
