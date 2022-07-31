var score = 0
var enemy, enemyImg
var player, playerImg
var enemyGroup
var play = 2
var end = 1
var start = 0
var win = 5
var gamestate = start
var speed = 30
var bosshits = 0 

function preload()
{
	playerImg = loadImage("assets/player.png")
	enemy1Img = loadImage("assets/enemy1.png")
	enemy2Img = loadImage("assets/enemy2.png")
	enemy3Img = loadImage("assets/enemy3.png")
	bossImg = loadImage("assets/boss.png")

	backroundImg = loadImage("assets/space backround.png")
}

function setup() {
	
	createCanvas(windowWidth, windowHeight);
	//creatingGroups
	bulletGroup = createGroup()
	enemyGroup = createGroup()
	enemybulletGroup = createGroup()
	alienBossGroup = createGroup()
	bossBulletGroup = createGroup()
	

	//creating player
	player = createSprite(displayWidth-(displayWidth/1.07),displayHeight/2-20, 50, 50 )
	player.addImage(playerImg)
	player.scale = 0.4
	player.setCollider("circle",-7,-5,230)
	player.rotation = 90

	//creating backround
	backround = createSprite(windowWidth/3, windowHeight/2, windowWidth, windowHeight)
	backround.addImage(backroundImg)
	backround.scale = 1.6
	backround.depth = player.depth-1

	//displaying health bar
	healthbackround=createSprite(windowWidth/2, 50, 1000, 20)
	health=createSprite(healthbackround.x-(bosshits*33.333), 50, 1000-(bosshits*66.6667), 20)
	health.shapeColor=("red")
	

	

  
}


function draw() {
 background("white")
 drawSprites();
 console.log(gamestate)

 health.width=1000-(bosshits*66.6667)
 health.x=healthbackround.x-(bosshits*33.333)

 //start state
 if (gamestate === start){
	healthbackround.visible = false
	health.visible = false
	backround.velocityX = 0
	player.visible=false
	textSize(20)
    text("PRESS SPACE TO START, CONTROL SHIP HEIGHT WITH MOUSE", windowWidth/2-300, windowHeight/2+80)

  if (keyWentDown("SPACE")){
	gamestate = play
   }
 }


 if (gamestate === play){
 //resetting from start
 backround.visible=true
 player.visible=true
 //player movement
 player.y = World.mouseY

 //moving backround
 backround.velocityX = -speed - (score*2)
 if(backround.x<windowWidth/5){
	backround.x=windowWidth/2
 }


 spawnEnemy()

 //player shooting
 if (mouseWentDown("leftButton")){
	shoot()
 }
 if (bulletGroup.isTouching(enemyGroup)){
	score = score+1
	for (var i=0;i<enemyGroup.length;i++){
		if(enemyGroup[i].isTouching(bulletGroup)){
		  console.log(enemyGroup[i])
		  enemyGroup[i].destroy()
		  bulletGroup.destroyEach()
		}
 }
 }
  console.log(backround.x)


  //player destroyed by boss bullets
 if(player.isTouching(enemybulletGroup)){
	player.lifetime=-1
	player.visible=false
	gamestate=end
	backround.velocityX=0
   }


   if(player.isTouching(bossBulletGroup)){
	player.lifetime=-1
	player.visible=false
	gamestate=end
	backround.velocityX=0
   }

   //alien boss health
 if (bulletGroup.isTouching(alienBossGroup)){
	bosshits=bosshits+1
	for (var i=0;i<alienBossGroup.length;i++){
		if(alienBossGroup[i].isTouching(bulletGroup)){
		  console.log(alienBossGroup[i])
		  alienBossGroup[i].destroy()
		  bulletGroup.destroyEach()
		}
	}
 }
	if (bosshits>=15){
		alienBossGroup.destroyEach()
		gamestate = win
		}

	if (bosshits===15){
		health.visible=false
	  }

	  if (score>=8){
		healthbackround.visible = true
		health.visible = true
	}
 bosss()
}
 

if (gamestate === end){
 fill("orange")
 textSize(40)
 text("GAME OVER!", windowWidth/2-windowWidth/11, windowHeight/2)
}

//victory
if(gamestate === win){
	player.velocityX=4
	player.velocityY=-2
	player.rotation = 60
	fill(rgb(255, 0, 68))
	textSize(80)
	text("YOU WIN!", windowWidth/2-windowWidth/11, windowHeight/2)
	healthbackround.visible=false
	backround.velocityX=-10

	if(backround.x<windowWidth/5){
		backround.x=windowWidth/2
	}
}

  
  //showing score
  fill(rgb(91, 167, 189))
  textSize(50)
  text ("Score:" + score, 100, 100)
}

function shoot(){
 bullet = createSprite(player.x+90, player.y, 20, 20)
 bullet.velocityX = 40
 bullet.shapeColor = "red"
 bulletGroup.add(bullet)



}

function spawnEnemy(){
 if(frameCount%30===0&&score<8){
	enemy = createSprite(displayWidth-displayWidth*0.1, random(windowHeight-100, 50), 50, 50 )
	enemy.scale = 0.5
	enemy.velocityX = -15
	enemy.rotation = 270
	enemyGroup.add(enemy)
	enemy.setCollider("circle",-7,-5,230)
	//enemy.debug = true


	//enemy shooting
	enemybullet = createSprite(enemy.x+90, enemy.y, 20, 20)
	enemybullet.velocityX = -60
	enemybullet.shapeColor = "green"
	enemybulletGroup.add(enemybullet)

	//random enemy images
	var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: enemy.addImage(enemy1Img);
              break;
      case 2: enemy.addImage(enemy2Img);
              break;
      case 3: enemy.addImage(enemy3Img);
              break;
      default: break;
    }
 }
}

function bosss(){
	if ((score>=8)&&frameCount % 1 === 0){

 
		if (bosshits<=14){
		alienBoss = createSprite((windowWidth-windowWidth/7),windowHeight/2, 120, 120)
		alienBoss.addImage(bossImg)
		alienBoss.scale=1
		alienBoss.lifetime=2
		alienBoss.velocityX= 2
		enemyGroup.destroyEach()
		alienBossGroup.add(alienBoss)
		alienBoss.y=player.y
		}


		if (frameCount % 9 ===0){
			bossbullet = createSprite(alienBoss.x-50, alienBoss.y+50, 50, 20)
			bossbullet.velocityX = -60
			bossbullet.shapeColor="yellow"
			bossBulletGroup.add(bossbullet)
          }   
	}
}

