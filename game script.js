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

var player = localStorage.getItem("playerId");
var roomName = localStorage.getItem("roomName");

var docRef = db.collection("rooms").doc(roomName);
var ready = false;

docRef.onSnapshot(function(doc) 
{
    ready = doc.get("ready");
    if (ready)
    {
        startGameBoard();
    }
});

function startGameBoard()
{
    //for img1-img5 change all opaque = 1 and clickable
    for (var i = 1;i<=5;i++)
    {
        document.getElementById("img"+i).style.opacity="1";
        document.getElementById("img"+i).style.pointerEvents="auto";
    }
    
    //make other elements opaque = 1
    document.getElementById("logo").style.opacity="1";
    document.getElementById("pSuit").style.opacity="1";
    document.getElementById("currImg").style.opacity="1";
    document.getElementById("cardMsg").style.opacity="1";

    //make the wasit messgae be hidden
    document.getElementById("waitMsg").style.visibility = "hidden";
}
