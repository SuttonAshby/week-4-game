$(document).ready(function() {

//The array of characters as objects
var fighters = [
	{name: "X-Wing",
	health: 120,
	attack: 8,
	counterAttack: 20,
	image: "assets/images/xwing.png"},

	{name: "Y-Wing",
	health: 150,
	attack: 7,
	counterAttack: 12,
	image: "assets/images/ywing.png"},

	{name: "A-Wing",
	health: 100,
	attack: 15,
	counterAttack: 15,
	image: "assets/images/awing.png"},

	{name: "TIE Fighter",
	health: 80,
	attack: 25,
	counterAttack: 10,
	image: "assets/images/tiefighter.png"}
	];

//Stores current player character and health, current opponent and health
var playerChar;
var opponentChar;
var playerHealth;
var maxPlayerHealth;
var opponentHealth;
var maxOpponentHealth;
//stores attack counter
var attackCounter;
//checks if there is an opponent selected
var isOpponent;

//initializes and resets game
function gameInitialize(){

//reset values for new game
attackCounter = 1;
isOpponent = false;

//emptys out hanger and combat zones
while($("#hanger").children().length > 1) {
	$("#hanger").children().last().remove();
}
if($("#charZone").children().length > 1) {
	$("#charZone").children().last().remove();
}
if($("#enemyZone").children().length > 1) {
	$("#enemyZone").children().last().remove();
}

//Populates the hanger with the fighter icons with associated name and healthbar
for(var i = 0; i < fighters.length; i++){
    var fighter = $("<div>")
        .addClass("fighter inHanger")
   		.attr("type", fighters[i].name)
   		.attr("attack", fighters[i].attack)
   		.attr("counterAttack", fighters[i].counterAttack);
    var fighterImage = $("<img>")
    	.attr("src", fighters[i].image)
    	.addClass("fighterImage");
    var health = $("<p>")
    	.text(fighters[i].health)
    	.addClass("healthBar");
    var fighterName = $("<h1>")
    	.text(fighters[i].name)
    $("#hanger").append(fighter);
    $(fighter).append(fighterName);
    $(fighter).append(fighterImage);
    $(fighter).append(health);

 }

//creates the functionality for picking fighters
    $(".inHanger").on("click", function() {
    	if($(this).hasClass("inHanger")) {
	    	if( $("#charZone").children().length === 1){
	    		for(var i = 0; i < fighters.length; i++){
	    			if(fighters[i].name === $(this).attr("type")) {
	    				playerChar = fighters[i];
	    			} 
	    		}
	    		var player = $(this).detach();
	    		$("#charZone").append(player);
	    		$(this).removeClass("inHanger");
	    		$(this).children('img').addClass("flipped");
	    		playerHealth = playerChar.health;
	    		maxPlayerHealth = playerChar.health;
	    	} else if ($("#enemyZone").children().length === 1){
	    		for(var i = 0; i < fighters.length; i++){
	    			if(fighters[i].name === $(this).attr("type")) {
	    				opponentChar = fighters[i];
	    			} 
	    		}
	  			var enemy = $(this).detach();
	    		$("#enemyZone").append(enemy);
	    		$(this).removeClass("inHanger");
	    		opponentHealth = opponentChar.health;
	    		maxOpponentHealth = opponentChar.health;
	    		isOpponent = true;
	    	}
   		}
    });
//gives player instructions in the battlelog
$("#battlelog").prepend("<p>Choose your fighter and your first opponent, then... ATTACK!</p>");
}

//healthbar utility function for bar percentage
function healthbar(max, health){
    return ((100 / max)*health)
}
// healthbar utility function for color
function healthbarColor(max, health){
	if(health <= max/2 && health > max/4){
		return "yellow"
	} else if (health <= max/4) {
		return "red"
	}
} 

//logic for the attack button
$("#attack").on("click", function() {
	if(isOpponent){
		opponentHealth -= (playerChar.attack * attackCounter);
		$("#battlelog").prepend("<p>You dealt " + (playerChar.attack * attackCounter) + " damage to and took " + opponentChar.counterAttack + " damage from the " + opponentChar.name + "!!</p>")
		attackCounter++;
		$("#enemyZone").children().last().children().last().text(opponentHealth);
		$("#enemyZone").children().last().children().last().css("width", healthbar(maxOpponentHealth, opponentHealth)+"%");
		$("#enemyZone").children().last().children().last().css("background-color", healthbarColor(maxOpponentHealth, opponentHealth));
		playerHealth -= opponentChar.counterAttack;
		$("#charZone").children().last().children().last().text(playerHealth);
		$("#charZone").children().last().children().last().css("width", healthbar(maxPlayerHealth, playerHealth)+"%");
		$("#charZone").children().last().children().last().css("background-color", healthbarColor(maxPlayerHealth, playerHealth));
		if(playerHealth <= 0 && opponentHealth <= 0){
			$("#battlelog").prepend("<p>YOU LOSE!!! You and the" + opponentChar.name + " wiped each other out!!</p>");
			setTimeout(function(){
				$("#battlelog").prepend("<p>STANDBY FOR SIMULATION RESET</p>");
			}, 1000);
			setTimeout(gameInitialize, 1000*3);
		} else if(playerHealth <= 0 && opponentHealth > 0) {
			$("#battlelog").prepend("<p>YOU LOSE!!! You were defeated by the" + opponentChar.name + "</p>");
			setTimeout(function(){
				$("#battlelog").prepend("<p>STANDBY FOR SIMULATION RESET</p>");
			}, 1000);
			setTimeout(gameInitialize, 1000*3);
		} else if(opponentHealth <= 0 && playerHealth > 0){
			if($("#hanger").children().length === 1){
				$("#enemyZone").children().last().remove();
				isOpponent = false;
				$("#battlelog").prepend("<p>YOU WIN!!! You defeated your last opponent, the " + opponentChar.name + "!</p>")
				$("#enemyZone").append("<div id='restart'><br><br><br><br><h1>CLICK HERE</h1><h1>to restart the game</h1></div>")
				$("#restart").on("click", gameInitialize);
				setTimeout(function(){
				$("#battlelog").prepend("<p>Click on the opponent zone if you DARE to restart!!</p>");
				}, 1000);
			} else {
				$("#enemyZone").children().last().remove()
				isOpponent = false;
				$("#battlelog").prepend("<p>You defeated the " + opponentChar.name + "! Pick a new opponent!!</p>")
			}
		}

	}
});

gameInitialize();

})


