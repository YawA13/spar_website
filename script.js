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

//checks that name and key inputs are not empty/whitespace, returns true if input is not empty/whitespace
function checkInput(name,key)
{
    if (name.match(/^\s*$/))  //checks that roomane is not empty
    {
        window.alert("Room Name Can't Be Empty");
        return false;
    }
    else if (key.match(/^\s*$/))  //check that room key is not empty
    {
         window.alert("Room Key Can't Be Empty");
         return false;
    }
    else
    {
        return true;
    }
}

function createRoom()
{
    
    var roomName = document.getElementById("room").value;
    var roomKey = document.getElementById("key").value;
    createDeck();

        if (checkInput(roomName,roomKey)) 
        {
            //creates new firestore doc based on room name inputed and fields of various info
            db.collection("rooms").doc(roomName).set(
                {
                    key:roomKey,
                    card:cards,
                    highNumber:0,
                    highPlayer:"",
                    highSuit:"",
                    player1card:0,
                    player2card:0,
                    currentCard:"images/blank.png",
                    ready:false,
                    start:"player1",
                    last:"",
                    round:"new",
                    winner:"none"
                }
            )
            .then(function()
            {
                sessionStorage.setItem("playerId","player1");  //saves which player the user is
                sessionStorage.setItem("roomName",roomName);   //saves what room the user is going to be in
                goToGame();
            });
            
        }

     
}

function goToGame()
{
    window.location = 'game.html';
}

function joinRoom()
{
    var roomName = document.getElementById("room").value;
    var roomKey = document.getElementById("key").value;

    if (checkInput(roomName,roomKey)) 
    {
        db.collection("rooms").doc(roomName).get().then(function(doc)
        {
            if (doc.exists) //room name is found
            {
                var rightKey = doc.get("key");
                
                if (rightKey == roomKey) //room key is found
                {
                    sessionStorage.setItem("playerId","player2"); //saves which player the user is
                    sessionStorage.setItem("roomName",roomName);  //saves what room the user is going to be in
                    
                    goToGame();
                }
                else //no room key is found
                {
                    window.alert("The Key For the room is incorrect");
                }

            }
            else //no room name is found
            {
                window.alert("No room of such name was found");
            }
        });
    }
    


}