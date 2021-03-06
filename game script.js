// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAc9-jQbharaduQu6ZxIBl_EFNcNLFlCTA",
    authDomain: "spar-web.firebaseapp.com",
    projectId: "spar-web",
    storageBucket: "spar-web.appspot.com",
    messagingSenderId: "954715243296",
    appId: "1:954715243296:web:9c49f0db5fcafeee2d0d45"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//declare variables
var db = firebase.firestore();
var player = sessionStorage.getItem("playerId");
var roomName = sessionStorage.getItem("roomName");
var docRef = db.collection("rooms").doc(roomName);  
var firstTime = true;   //variable that function only occurs once
var playerCards=[];     //array of current cards the player has
var powerSuit;
var cardSuit;
var cardValue;
var cardName;
var otherPlayer;        //variable of other user name (either player1 or player2)
var emptyCard = [];     //array of postions of empty cards

//variables of data from firestore
var ready = false;      //variable to determine if the game is ready   
var deck;    
var startVar;
var lastVar;
var highSuitVar;
var highNumberVar;
var highPlayerVar;
var player1cardVar;
var player2cardVar;
var currentCardVar;
var roundVar;
var gameOverVar;

//runs anytime the data is changed in firestore
docRef.onSnapshot(function(doc) 
{
    setForPlayer2();
    ready = doc.get("ready");
    
    if (ready)             
    {
         //when player 2 joins, sets the game board for both players (only one time)
        if (firstTime)
        {
            startGameBoard();
            deck = doc.get("card"); //randomised deck from firestore
            setCards();
        }
        
        //retrive all the fields from firestore  
        startVar = doc.get("start");
        lastVar = doc.get("last");
        highSuitVar = doc.get("highSuit");
        highNumberVar = doc.get("highNumber");
        highPlayerVar = doc.get("highPlayer");
        player1cardVar = doc.get("player1card");
        player2cardVar = doc.get("player2card");
        currentCardVar = doc.get("currentCard");
        roundVar = doc.get("round");
        gameOverVar = doc.get("gameOver");

         //set current card image from firestore current card field
         document.getElementById("currImg").src = currentCardVar;

        //checks if the game is over
        if (gameOverVar)
        {
            //determines the winner and sets the message to be shown to the user
            winAlert(); 
        }
        else
        {
            if ((startVar==player)||(lastVar==player))
            {
                setMsg("Your Turn To Play","1","auto");
            }
            else
            {
                setMsg("Not Your Turn to Play","0.3","none");
            }
            
            //call roundEnd() method
            roundEnd();
        }
    }

});

//function to load logo and logo title for player2 and tell firestore the game is ready
function setForPlayer2()
{
    //runs for only player2 when they first join the game
    if ( (player == "player2") && firstTime)
    {
        //sets logo and logo title to player1 logo anad player 1 logo title
        document.getElementById("logo").src="images/p1.jpg";
        document.getElementById("logoTitle").textContent="Player 1";

        //updates ready to true if player2 has joined
        docRef.update({ready:true});
    }
}

//function to make html elements visible and set what player the user is
function startGameBoard()
{
    //for img1-img5 change all opaque to 1 and all of them are clickable
    for (var i = 0;i<=4;i++)
    {
        document.getElementById("img"+i).style.opacity="1";
        document.getElementById("img"+i).style.pointerEvents="auto";
    }
    
    //make other elements opaque = 1
    document.getElementById("logo").style.opacity="1";
    document.getElementById("pSuit").style.opacity="1";
    document.getElementById("currImg").style.opacity="1";
    document.getElementById("cardMsg").style.opacity="1";

    //make the wait messgae be hidden
    document.getElementById("waitMsg").style.visibility = "hidden"; 
    firstTime = false;

    if (player == "player1")
    {
        otherPlayer = "player2";
    }
    else
    {
        otherPlayer = "player1";
    }
}

//get card suit, card value and card name from array of cards and at index
function getCardInfo(cardArray,index)
{
    cardSuit = cardArray[index].suit;
    cardValue = cardArray[index].value;
    cardName="images/"+cardSuit+cardValue+".jpg";
}

//function to set users cards, both array and images and powersuit and deck 
function setCards()
{
    
    for (var i =0;i<=4;i++)
    {
        if (player=="player1")
        {
            //set playerCards[0]-playerCards[4] to deck[0]-deck[4]
            playerCards[i]=deck[i];
        }
        else
        {
            //set playerCards[0]-playerCards[4] to deck[5]-deck[9]
            playerCards[i]=deck[i+5];
        }
        
        //get card info for all player cards
        getCardInfo(playerCards,i);

        //sets each card img on html to its appropiate cardName from playerCards; 
        document.getElementById("img"+i).src=cardName;
       
    }

    //gets suit and value from deck[10] to become power suit in game
    getCardInfo(deck,10);

    //set pSuit image to the power suit above
    document.getElementById("pSuit").src=cardName;
    powerSuit = cardSuit;

    //remove first 11 cards (cards in each playerCards and powerSuit card) from deck
    deck.splice(0,11);
}

//function when a card is clicked, param pos is the postion of the image
function cardClick(pos)
{
    //get card info for currently clicked card
    getCardInfo(playerCards,pos);

    var dataUpdate = {}; //object of fields that willl be updated in firestore

    if (startVar == player)
    {
        dataUpdate = {
            last:otherPlayer,
            start:"",
            highPlayer:player,
            highSuit:cardSuit,
            highNumber:cardValue
        };
    }
    else if (lastVar == player)
    {
        dataUpdate = {last:""};

        //true if both cards are same suit and the player card value is greater than other player
        var condition1 = (highSuitVar == cardSuit) && (cardValue>highNumberVar);

        //true if card clicked suit is the same as power suit and the other card is not pat of the power suit
        var condition2 = (cardSuit == powerSuit) && !(highSuitVar == powerSuit);

        
        if (condition1 || condition2)   //runs if last player won/played a higher card
        {
            Object.assign(dataUpdate,addData(player));
        }
        else    //runs if start player won/played a higher card
        {
            Object.assign(dataUpdate,addData(otherPlayer));
        }
    }
    
    //card clicked becomes current card in firestore  
    dataUpdate["currentCard"] = cardName;

    //card clciked becomes "unavailable" to user
    playerCards[pos]="";
    document.getElementById("img"+pos).style.opacity="0.3";
    document.getElementById("img"+pos).style.pointerEvents="none";
    document.getElementById("img"+pos).src="images/blank.png";

    //add postion of card (pos) unclicked into array
    emptyCard.unshift(pos);

    //update fields all at once
    docRef.update(dataUpdate);
}

function addData(playerId)
{
    return ({
        start:playerId,
        highPlayer:playerId,
        round:"end",
        [playerId+"card"]: window[playerId+"cardVar"]+2
    });
}

//function that sets wait message and turn on or off each card image
function setMsg(msg,opacity,clickable)
{
    //set waitmsg text to msg paramter
    document.getElementById("waitMsg").getElementsByTagName("h1")[0].innerText = msg;

    //set waitmsg visible to user
    document.getElementById("waitMsg").style.visibility = "visible";
    
    //set each image either clickable and 100% opaque or not clickable and 0.3 opaque
    for (var i = 0;i<=4;i++)
    {
        //sets only for positions not in emptyCard array
        if (!emptyCard.includes(i))
        {
            document.getElementById("img"+i).style.opacity=opacity;
            document.getElementById("img"+i).style.pointerEvents=clickable;
        }
        
    }
}

//function to apply changes to firestore when round ends including adding new cards into an empty spot from deck and reducuing the deck number
function roundEnd()
{
    //runs when the round ends 
    if (roundVar == "end")
    {
        //hides wait msg until roundEnd is evaluated
        document.getElementById("waitMsg").style.visibility = "hidden";

        //evaluates  function after 1 second so both oplayer can view the last player clicked card
        setTimeout(function()
        {

            if (highPlayerVar==player)
            {
                //pos of an empty card
                var pos = emptyCard[0];

                //take first card from deck and set into player card at pos of last empty card
                playerCards[pos] = deck[0];

                //get card info for new card from deck
                getCardInfo(playerCards,pos);
                
                //"enable" card image at the new position 
                document.getElementById("img"+pos).style.opacity="1";
                document.getElementById("img"+pos).style.pointerEvents="auto";
                document.getElementById("img"+pos).src=cardName;
                
                //remove the last position that was empty
                emptyCard.shift();

                //update firestore
                docRef.update(
                {
                    currentCard:"images/blank.png",
                    round:"new"
                });
            }
            //checks if there is no cards left for the user
            if (emptyCard.length == 5)
            {
                docRef.update({
                    gameOver:true,
                    currentCard:"images/blank.png",
                });
            }

            //set score of the user based off data in firestore
            document.getElementById("scoreNum").textContent=window[player+"cardVar"];

        }, 1000);

        //remove first card of the deck
        deck.shift();

        //change the text of how many cards are available
        document.getElementById("numCard").textContent= deck.length;
    }
}

//displays a winer message to the player who won and gives the loser, a loser message
function winAlert()
{
    //checks if user's score greater than other player
    if (window[player+"cardVar"]>window[otherPlayer+"cardVar"])
    {
        setMsg("WINNER","0.3","none");
    }
    else if (window[otherPlayer+"cardVar"]>window[player+"cardVar"])
    {
        setMsg("LOSER","0.3","none");
    }
}