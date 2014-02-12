$(document).ready(function(){main();});

var FPS = 30;
var isLoaded = false;
var fallCanvas;
var tics;
var i=0;

var renderer;
var emitter;
var intervalId;

var gameStarted = false;

var gameOver = false;
var wave = 1;
var level = 0;
var gameoverLevel = 0;

// Set up enemy global vars
var enemyCount = 0;
var enemies = {};
var enemyYChanged = 0;

var blinkTime = 600;
var blinkAmount = 8;
var isBlinking = false;
var currentBlink = 0;
var flashVisible = false;
var blinks = 0;

var gameWon = false;

var players = {};

var bunkers = {};

var projectileCount = 0;
var projectiles = {};

// Set up the images
var redAlien = new Image();
redAlien.src = "images/invader1.png";

var redAlienA = new Image();
redAlienA.src = "images/invader12.png";

var redAlienW = new Image();
redAlienW.src = "images/invader12_white.png";

var orangeAlien = new Image();
orangeAlien.src = "images/invader2.png";

var orangeAlienA = new Image();
orangeAlienA.src = "images/invader22.png";

var orangeAlienW = new Image();
orangeAlienW.src = "images/invader22_white.png";

var greenAlien = new Image();
greenAlien.src = "images/invader3.png";

var greenAlienA = new Image();
greenAlienA.src = "images/invader32.png";

var greenAlienW = new Image();
greenAlienW.src = "images/invader32_white.png";

var ship = new Image();
ship.src = "images/ship.png";

var ship_white = new Image();
ship_white.src = "images/ship_white.png";

var bunkerImg = new Image();
bunkerImg.src = "images/bunker.png";

var projImage = new Image();
projImage.src = "images/projectile.png";

var eProjImage = new Image();
eProjImage.src = "images/eprojectile.png";

var eProjImageA = new Image();
eProjImageA.src = "images/eprojectile2.png";

function main ()
{
    isLoaded = true;
    fallCanvas  = document.getElementById("invaders-canvas");
    bgCanvas  = document.getElementById("background-canvas");
	resizeCanvas();
    renderer    = new Renderer(fallCanvas);
    tics        = Math.ceil(1000 / FPS);
    initGame();
    intervalId = window.setInterval(updateGame, tics);
}

function resizeCanvas ()
{
	if (isLoaded) {
		fallCanvas.width    = 570;
		fallCanvas.height   = 350;
		bgCanvas.width    = 570;
		bgCanvas.height    = 350;
		
		$('#game_bezel').css('left', (document.width / 2) - ($('#game_bezel').width() / 2) + 'px');
		
		if (renderer != null) {
			renderer.init(fallCanvas);
		}
	}
}

function addEnemy(enemy){
	enemies[enemy.id] = enemy;
	renderer.addEnemy(enemy);
	++enemyCount;
}

function removeEnemy(enemy)
{
    delete enemies[enemy.id];
    renderer.removeEnemy(enemy);
    --enemyCount;
	
	if(enemyCount == 0){
		gameWon = true;
		finishGame();
	}
}

function addBlock(block)
{
	bunkers[block.id] = block;
	renderer.addBlock(block);
}

function removeBlock(block)
{
	delete bunkers[block.id];
	renderer.removeBlock(block);
}

function addPlayer(player){
	players[player.id] = player;
	renderer.addPlayer(player);
}

function addProjectile(projectile){
	projectiles[projectile.id] = projectile;
	renderer.addProjectile(projectile);
	++projectileCount;
}

function removeProjectile (projectile)
{
    delete projectiles[projectile.id];
    renderer.removeProjectile(projectile);
    --projectileCount;
}

// Set up the initial game
function initGame() {
	var player = new Player(10,bgCanvas.height - 25, ship, ship_white);
	addPlayer(player);
	
	
	for(i = 0; i<= 10; i++){
		for(j = 0; j <=4; j++){
			if (j == 0){
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), orangeAlien, orangeAlienA, orangeAlienW); }
			else {
				// builded in green alien ; )
				if (j <3) {
					var enemy = new Enemy(10 + (i*34), 40 + (j*25), redAlien, redAlienA, redAlienW); }
				else {
					var enemy = new Enemy(8 + (i*34), 40 + (j*25), greenAlien, greenAlienA, greenAlienW); }
			}
			addEnemy(enemy);
		}
	}
	
	createBunkers();
}

// Reset the enemies for the next wave
// or build in a victory screen (museumn8)...
function nextWave() {
	wave++;
	for(i = 0; i<= 11; i++){
		for(j = 0; j <=6; j++){
			if (j == 0){
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), orangeAlien, orangeAlienA);
			}else{
				// builded in green alien ; )
				if (j <3)
				{
					var enemy = new Enemy(10 + (i*34), 40 + (j*25), redAlien, redAlienA);
				}
				else
				{
					var enemy = new Enemy(10 + (i*34), 40 + (j*25), greenAlien, greenAlienA);
				}
			}
			var level = 0;
			addEnemy(enemy);
		}
	}
}

function createBunkers() {
	var bunkerSizeX = 4;
	var bunkerSizeY = 3;
	var bunkerSize = 8;
	var bunkerAmount = 4;
	var bunkerOffsetX = bgCanvas.width/(bunkerAmount+1);
	var bunkerPosY = bgCanvas.height-100;
	
	for(i = 0; i < bunkerAmount; i++){
		for(j = 0; j <= bunkerSizeX; j++){
			for(k = 0; k<= bunkerSizeY; k++) {
				var block = new Bunker(i*bunkerOffsetX+j*bunkerSize+bunkerOffsetX-bunkerSizeX*bunkerSize, k*bunkerSize+bunkerPosY, bunkerSize, bunkerSize, bunkerImg);
				addBlock(block);
			}
		}
	}
}

// Set up the key events
rightDown = false;
leftDown = false;
space = false;

// spaceContinuous was added to prevent continuous shooting while holding the space. Currently one shot per space-event
spaceContinuous = true;

// Key event handelers
function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
  if (evt.keyCode == 32){

// if there's already a projectile from player, don't shoot	
	var projectileCounter = 0;
	for (var id in projectiles) {
		var projectile = projectiles[id];
			if(projectile._type == 1){
			projectileCounter = projectileCounter+1;
			}
		if (projectileCounter>0)
		{
			// there's already a projectile from player, don't shoot
			//alert (projectileCounter);
		spaceContinuous = false;
		}
	}
	if (spaceContinuous == true)
	{space = true;

	// value 25 = speed of projectile player
	var projectile = new Projectile(players[0].x + (players[0]._width/2), players[0].y - 10, projImage, projImage, 20, 1);
	addProjectile(projectile);
	
	spaceContinuous = false;
	}
  };
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
  if (evt.keyCode == 32) space = false; spaceContinuous = true;
}

function startGame() {
	gameStarted = true;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function finishGame(){
	gameOver = true;
	level = gameoverLevel;
	isBlinking = true;
	currentBlink = 0;
	blinks = 0;
	flashVisible = true;
	if(gameWon) {
		$('#game_flash').css("background-image", 'url("images/victory_flash.png")'); }
	else {
		$('#game_flash').css("background-image", 'url("images/gameover_flash.png")'); }
}

function showFinal(){
	if(gameWon) {
		$('#game_bezel_done').css("background-image", 'url("images/canvasinv-victory.png")'); }
	else {
		$('#game_bezel_done').css("background-image", 'url("images/canvasinv-defeat.png")'); }	
		
	$('#game_bezel_done').fadeIn(1000);
}

function updateGame() {
	renderer.redraw();
	
	if(isBlinking) {
		currentBlink+=100;
		if(currentBlink>=blinkTime) {
			blinks++;
			flashVisible=!flashVisible;
			currentBlink=0;
			if(blinks>=blinkAmount) {
				isBlinking = false;
				flashVisible=false;
				showFinal(); 
				}
		}
		
		if(flashVisible) {
			$('#game_flash').fadeIn(100); }//css("display", 'inline'); }
		else {
			$('#game_flash').fadeOut(100); } //css("display", 'none'); }
	}
	
	if (gameOver != true){
		for (var id in players){
			var player = players[id];
			
			if (player._lives < 0){
				finishGame(); }
			
			player.update(100);
			$('#player_score').html(player._score);
		}
		
		for (var id in projectiles) {
			var projectile = projectiles[id];
			projectile.update(100); }
			
		// Change the direction of the invaders movement
		if (updateLogic == true){
			updateLogic = false;
			direction = -direction;
			enemyMoveSpeed = -enemyMoveSpeed;
			
			if(gameStarted) {
				enemyYChange = 10;

	// check position of enemies: after 20 times the botton aliens are down and you lose...
				enemyYChanged = enemyYChanged+10;
	//			alert(enemyYChanged); 
				if (enemyYChanged>200) {//alert('JA, bouw gameover in...');
					for (var pid in players) {
						var player = players[pid];
								player._lives --;
					}
				}
			}
			
		}
		
		// Loop through the enemies update their speed based on enemies left, check if they have fired.
		for (var id in enemies) {
			var enemy = enemies[id];
			enemy.delay = 20+4.45*Math.pow(enemyCount,1)+0.37*Math.pow(enemyCount,2);
			
			if (enemy.delay <=70 ){
				enemy.delay = 70;
			}
			
			enemy.update(100);
			
			if (enemy._fire == true){
				enemy._fire = false;
				var projectile = new Projectile(enemy.x + (enemy._width/2), enemy.y + 10, eProjImage, eProjImageA, -6, 2);
				addProjectile(projectile);
			}
		}
		
		// reset the y var for the enemies to move down.
		enemyYChange = 0;
		
		// Check collisions between player, enemies, and projectiles
		checkCollisions();

		// music update, check level		
		if (enemyCount < 85){level = 0;}
		if (enemyCount < 77){level = 1;}
		if (enemyCount < 60){level = 2;}			
		if (enemyCount < 40){level = 3;}
		if (enemyCount < 20){level = 4;}
		if (enemyCount < 10){level = 5;}			
		if (gameOver == true){level = gameoverLevel;}		
	
	}
}

// Need to clean up at some point. Loops through the projectiles, checks who they came from then performs collision tests to see if its a hit
function checkCollisions(){
	for (var id in projectiles) {
		var projectile = projectiles[id];
		
		for (var bid in bunkers) {
			var block = bunkers[bid];
			if (projectile.x >= block.x && projectile.x <= (block.x + block._width)){
				if (projectile.y <= (block.y + block._height) && projectile.y >= block.y){
					removeBlock(block);
					removeProjectile(projectile);
				}
			}
		}
		
		if(projectile._type == 1){
			for (var eid in enemies) {
				var enemy = enemies[eid];
				
				if (!enemy._blinking && projectile.x >= enemy.x && projectile.x <= (enemy.x + enemy._width)){
					if (projectile.y <= (enemy.y + enemy._height) && projectile.y >= (enemy.y)){
						enemy.blink();
						//removeEnemy(enemy);
						removeProjectile(projectile);
						players[0]._score += 100;
					}
				}
			}
		}
		else
		{
			for (var pid in players) {
				var player = players[pid];
				if (projectile.x >= player.x && projectile.x <= (player.x + player._width)){
					if (projectile.y <= (player.y + player._height) && projectile.y >= (player.y)){
						removeProjectile(projectile);
						player._lives --;
						player.blink();
					}
				}
			}
		}
		
		if (projectile.y <=0 || projectile.y > fallCanvas.height){
			removeProjectile(projectile);
		}
	}
	
}