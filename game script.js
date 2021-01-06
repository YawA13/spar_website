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

//runs anytime the data is changed in firestore
docRef.onSnapshot(function(doc) 
{
    //updates ready to true if player2 has joined
    if (player == "player2")
    {
        docRef.update({ready:true});
    }
    ready = doc.get("ready");
    
    //when player 2 joins, sets the game board for both players (only one time)
    if (ready&&firstTime)             
    {
        startGameBoard();
        deck = doc.get("card"); //randomised deck from firestore
        setCards();
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
}

function setCards()
{
    var cardSuit;
    var cardValue;
    var cardName;
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
