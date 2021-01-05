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

var cards = [];

//javascript implemtation of Durstenfeld shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//create a 52 element array and each is a map of suits and value
function createDeck()
{
    var suits = ["clubs","diamonds","hearts","spades"];
    
    for (i = 0; i<4;i++)
    {
        for (j = 2; j<15; j++)
        {
            cards.push({
                suit:suits[i],
                value:j     
            });
        }
    }

    //shuffles the array
    shuffleArray(cards);
}



function createRoom()
{
    
    var roomName = document.getElementById("room").value;
    var roomKey = document.getElementById("key").value;
    createDeck();

        if (roomName.match(/^\s*$/))  //checks that roomane is not empty
        {
            window.alert("Room Name Can't Be Empty");
        }
        else if (roomKey.match(/^\s*$/))  //check that room key is not empty
        {
            window.alert("Room Key Can't Be Empty");
        }
        else
        {
            //creates new firestore doc based on room name inputed and fields of various info
            db.collection("rooms").doc(roomName).set(
                {
                    key:roomKey,
                    card:cards,
                    highNumber:"0",
                    highPlayer:"",
                    highSuit:"",
                    player1card:"0",
                    player2card:"0",
                    currentCard:"",
                    ready:false,
                    start:"player1",
                    last:""
                }
            );
        }

     goToGame();
}

function goToGame()
{
    window.location = 'game.html';
}