import { Game } from '../game'
import { Card } from '../models/card'
import { calculateAngleBreakpoint, getCssAngle } from '../util/transform'

const STARTING_CARDS_ANGLE = 70

type GameDOM = {
	playerCards?: HTMLDivElement
	cpuCards?: HTMLDivElement
	startButton?: HTMLButtonElement
}

const randomCardImage = () => {
	const suits = ['clubs', 'diamonds', 'hearts', 'spades']
	const symbols = ['A', 'K', 'Q', 'J', '10', '09', '08', '07', '06', '05', '04', '03', '02']

	const suit = suits[Math.floor(Math.random() * suits.length)]
	const symbol = symbols[Math.floor(Math.random() * symbols.length)]

	return `/public/images/cards/card_${suit}_${symbol}.png`
}

const randomCardImages = (count: number): string[] => {
	const images: string[] = []

	for (let i = count; i > 0; i--) {
		let image = randomCardImage()

		while (images.indexOf(image) > -1) {
			image = randomCardImage()
		}

		images.push(image)
	}

	return images
}

export class GameUI {
	private cardsAngle = STARTING_CARDS_ANGLE
	private deckSize = 0

	private dom: GameDOM = {}

	private onGameStartedHandler = this.onGameStarted.bind(this)
	private onCardsUpdatedHandler = this.onCardsUpdated.bind(this)
	private onGameResultHandler = this.onGameResult.bind(this)

	private cardImages: string[] = []

	constructor(private game: Game) {
		this.game = game

		this.game.addListener('started', this.onGameStartedHandler)
		this.game.addListener('cardsUpdated', this.onCardsUpdatedHandler)
		this.game.addListener('result', this.onGameResultHandler)

		this.dom.playerCards = document.getElementById('cards') as HTMLDivElement
		this.dom.cpuCards = document.getElementById('cpuCards') as HTMLDivElement
		this.dom.startButton = document.getElementById('btnStart') as HTMLButtonElement

		if (!this.dom.playerCards) {
			throw Error('No card container found')
		}

		if (!this.dom.startButton) {
			throw Error('No start button found')
		}

		this.dom.startButton.addEventListener('click', this.handleStartClick.bind(this))
	}

	// Game Events
	private onGameStarted({ cards }: { cards: Card[] }) {
		this.deckSize = cards.length
		this.cardImages = randomCardImages(cards.length)
		this.renderCards(cards)
		this.renderCpuCards(cards)
	}

	private onCardsUpdated({ cards }: { cards: Card[] }) {
		this.renderCards(cards)
	}

	private onGameResult({ result }: { result: 'WIN' | 'LOSS' }) {
		console.log(result)
	}

	// UI Events
	private handleStartClick() {
		this.game.play()
	}

	private handleCardClick(card: Card) {
		this.game.selectCard(card)
	}

	// Rendering
	private renderCpuCards(cards: Card[]) {
		cards.forEach((card, i) => {
			this.renderCpuCard(card)
		})
	}

	private renderCards(cards: Card[]) {
		this.clearCards()
		this.cardsAngle = (this.deckSize - cards.length + 1) * STARTING_CARDS_ANGLE
		// const angle = calculateAngleBreakpoint(cards.length, this.cardsAngle, 180 - this.cardsAngle)

		cards.forEach((card, i) => {
			// this.renderCard(card, i * angle + this.cardsAngle)
			this.renderPlayerCard(card, null, this.cardImages[i])
		})
	}

	private renderPlayerCard(card: Card, angle: number | null = null, image: string | null = null) {
		let cardNode = document.querySelector(`#${this.dom.playerCards.id} *[data-card-id='${card.id}']`) as HTMLElement

		if (!cardNode) {
			cardNode = document.createElement('div')
			// cardNode.innerText = card.label
			cardNode.className = 'card'
			cardNode.setAttribute('data-card-id', card.id.toString())
			cardNode.style.backgroundImage = `url(${image})`

			cardNode.addEventListener('click', this.handleCardClick.bind(this, card))
		}

		if (card.selected) {
			cardNode.classList.add('selected')
		} else {
			cardNode.classList.remove('selected')
		}

		if (angle !== null) {
			cardNode.style.rotate = `${getCssAngle(angle)}deg`
		}

		this.dom.playerCards.appendChild(cardNode)
	}

	private renderCpuCard(card: Card) {
		let cardNode = document.querySelector(`#${this.dom.cpuCards.id} *[data-card-id='${card.id}']`) as HTMLElement

		if (!cardNode) {
			cardNode = document.createElement('div')
			cardNode.className = 'card'
			cardNode.setAttribute('data-card-id', card.id.toString())
			cardNode.style.backgroundImage = `url(/public/images/cards/card_back.png)`
		}

		this.dom.cpuCards.appendChild(cardNode)
	}

	private clearCards() {
		this.dom.playerCards.innerHTML = ''
	}
}
