# Spar Web Game

Web game of the traditional ghanaian card game Spar based off my own family's rules. Online web based game that allows two players to play agaisnt each other in Spar in a realtime enviroment 

## Features
- Online implementation of Spar
- Replicated a real time multiplier game utilizing Google's Firbase Firestore
- Responsive design for use on screens of all sizes
- Simple and minimalistic web design for easy to use gameplay

## Prerequisites To Use Website

Modern Web Browser:
- Google Chrome ver 29+
- Firefox ver 28+
- Microsoft Edge ver 11+
- Safari ver 9.0+

## How To Play

Create Game
- ![create spar gif](https://user-images.githubusercontent.com/44479056/104159445-52529400-53bd-11eb-84b4-68a13691c22f.gif)
- Enter name of game room that you and the other player will be in
- Enter key of game room that will be used as password for the other player to join the game
- Submit typed in room and key 
- Deliver both information to the other player  
- Room and key can not be empty/only whitespace
- Considered as player 1 in the game

Join Game
- ![join spar gif](https://user-images.githubusercontent.com/44479056/104159474-5d0d2900-53bd-11eb-8ced-202730c545fd.gif)
- Enter name of game room the other player has told you 
- Enter name of game key the other player has told you 
- Submit typed in room and key
- Considered as player 2 in the game

Game Play
- Game starts when both players are loaded into the game
- 5 cards are given to both players and 1 card is considered the power suit and all 11 cards are removed from the deck
- Player 1 starts the game and can choose any card and is displayed to both players
- Player 2 then chooses any card and that is displayed to both players
- Each player chooses the card by clicking on the respetive card and once clicked the card is removed from the players cards 
- After both players have choosen the winner of the round is decided by:
	- whoever played the highest card of the suit that the first player led OR
	- whoever played the highest card of the power suit
- The winner scores 2 points and recives 1 card from the deck at the last spot where a card was removed
- The winner of the round starts the next round and this is repeated untill one player has no cards
- When one player has no cards the winner is decided by whoever has the highest score and the game is over
- To play again create a new room again and have the other player join

## Link To Website

Link to [Website](https://github.com/YawA13)

## Built With
- HTML
- CSS
- Javascript
- Firebase Firestore
- Visual Studio Code

## License

[MIT](https://choosealicense.com/licenses/mit/)
