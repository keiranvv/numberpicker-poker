import { Game } from './game'

import cards from './data/cards'
import { Card } from './models/card'
import { GameUI } from './ui/gameUi'

const game = new Game(cards as Card[])

try {
	new GameUI(game)
	game.start()
} catch (e) {
	alert(e.message)
}
