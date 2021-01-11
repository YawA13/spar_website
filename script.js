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
var cards = [];     //array of deck of cards

//javascript implemtation of Durstenfeld shuffle to randomize array
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
    if (name.match(/^\s*$/))  //checks that roomane is not empty/contain only whitespace
    {
        window.alert("Room Name Can't Be Empty");
        return false;
    }
    else if (key.match(/^\s*$/))  //check that room key is not empty/contain only whitespace
    {
         window.alert("Room Key Can't Be Empty");
         return false;
    }
    else
    {
        return true;
    }
}

//function when submit button is clicked on in create.html 
function createRoom()
{
    var roomName = document.getElementById("room").value;
    var roomKey = document.getElementById("key").value;
    createDeck();

    if (checkInput(roomName,roomKey)) 
    {
        db.collection("rooms").doc(roomName).get().then(function(doc)
        {
            if (doc.exists)     //check if there is a room with the same name
            {
                window.alert("There is another room with that name, please choose something else");
            }
            else
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
                    gameOver:false
                })
                .then(function()
                {
                    sessionStorage.setItem("playerId","player1");  //saves which player the user is
                    sessionStorage.setItem("roomName",roomName);   //saves what room the user is going to be in
                    window.location = 'game.html';                 //loads the page to game.html 
                });
            }
        });
    }
}

//function when submit button is clicked on in join.html 
function joinRoom()
{
    var roomName = document.getElementById("room").value;
    var roomKey = document.getElementById("key").value;

    if (checkInput(roomName,roomKey)) 
    {
        db.collection("rooms").doc(roomName).get().then(function(doc)
        {
            if (doc.exists) //checks to see that room name exists
            {
                var rightKey = doc.get("key");
                
                if (rightKey == roomKey) //room key is found
                {
                    sessionStorage.setItem("playerId","player2"); //saves which player the user is
                    sessionStorage.setItem("roomName",roomName);  //saves what room the user is going to be in
                    window.location = 'game.html';                 //loads the page to game.html 
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