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
var db = firebase.firestore();

var player = sessionStorage.getItem("playerId");
var roomName = sessionStorage.getItem("roomName");

var docRef = db.collection("rooms").doc(roomName);
var ready = false;
var deck;
var firstTime = true;   //variable that function only occurs once
var playerCards=[]; //array of current cards the player has
var powerSuit;
var cardSuit;
var cardValue;
var cardName;
var otherPlayer;
var emptyCard = []; //array of postions of empty cards
var startVar;
var lastVar;
var highSuitVar;
var highNumberVar;
var highPlayerVar;
var player1cardVar;
var player2cardVar;
var currentCardVar;
var roundVar;
var winnerVar;

//runs anytime the data is changed in firestore
docRef.onSnapshot(function(doc) 
{
    //runs for only player2 when they first join the game
    if ( (player == "player2") && firstTime)
    {
         //updates ready to true if player2 has joined
        docRef.update({ready:true});

        //sets logo and logo title to player1 logo anad player 1 logo title
        document.getElementById("logo").src="images/p1.jpg";
        document.getElementById("logoTitle").textContent="Player 1";
    }
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
        winnerVar = doc.get("winner");

        //set current card image from firestore current card field
        document.getElementById("currImg").src = currentCardVar;

        //set score of the user based off data in firestore
        document.getElementById("scoreNum").textContent=window[player+"cardVar"];

        if ((startVar==player)||(lastVar==player))
        {
            yourTurn("Your Turn To Play","1","auto");
        }
        else
        {
            yourTurn("Not Your Turn to Play","0.3","none");
        }
        
    }

});

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
        
        cardSuit = playerCards[i].suit;
        cardValue = playerCards[i].value;
        cardName="images/"+cardSuit+cardValue+".jpg";

        //sets each card img on html to its appropiate cardName from playerCards; 
        document.getElementById("img"+i).src=cardName;
       
    }

    //gets suit and value from deck[10] to become power suit in game
    cardSuit = deck[10].suit;
    cardValue = deck[10].value;
    cardName="images/"+cardSuit+cardValue+".jpg";

    //set pSuit image to the power suit above
    document.getElementById("pSuit").src=cardName;
    powerSuit = cardSuit;

    //remove first 11 cards (cards in each playerCards and powerSuit card) from deck
    deck.splice(0,11);
}

//function when a card is clicked, param pos is the postion of the image
function cardClick(pos)
{
    cardSuit = playerCards[pos].suit;
    cardValue = playerCards[pos].value;
    cardName="images/"+cardSuit+cardValue+".jpg";

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
function yourTurn(msg,opacity,clickable)
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