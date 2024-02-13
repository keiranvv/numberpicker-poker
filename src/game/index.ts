import { Card } from '../models/card'
import { EventEmitter } from '../util/events'

export class Game extends EventEmitter {
	private selectedValues: number[] = []

	constructor(private cards: Card[]) {
		super()

		this.resetCards()
	}

	private resetCards() {
		this.cards.forEach((c) => {
			c.selected = false
		})
	}

	public start() {
		this.emit('started', { cards: this.cards })
	}

	public deselectCard(card: Card) {
		card.selected = false

		this.selectedValues.splice(this.selectedValues.indexOf(card.id), 1)

		this.emit('cardsUpdated', { cards: this.cards })
	}

	public selectCard(card: Card) {
		card.selected = true

		this.selectedValues.push(card.id)
		this.cards.splice(this.cards.indexOf(card), 1)

		this.emit('cardsUpdated', { cards: this.cards })
	}

	public play() {
		const r = Math.floor(Math.random() * (this.cards.length - 1))

		const resultCard = this.cards[r]
		const resultStatus = this.selectedValues.indexOf(resultCard.id) > -1 ? 'WIN' : 'LOSS'

		this.emit('result', { result: resultStatus })

		this.resetCards()

		this.emit('cardsUpdated', { cards: this.cards })
	}
}
