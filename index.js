import Player from './Player.js';
import Platform from './Platform.js';
import Fragment from './Fragment.js';

/* function startScreen(){
    document.querySelector('#startScreen').style.display= 'block';
    document.querySelector('#startGame').style.display= 'none';
    document.querySelector('#gameOver').style.display= 'none';
   
}  */ 

function startGame(){
    document.querySelector('#startScreen').style.display= 'none';
    document.querySelector('#startGame').style.display= 'block';
    /* document.querySelector('#gameOver').style.display= 'none'; */
  
    
}

/* function gameOver(){
    document.querySelector('#startScreen').style.display= 'none';
    document.querySelector('#startGame').style.display= 'none';
    document.querySelector('#gameOver').style.display= 'block';
} */
     



//config
const CONFIG = {

    width: 1200,
    height: 900,
    playerSpeed: 5,
};

//variables
let context;
let player;
let ticks = 0;
let fragments = [];
let platforms = [];
let bottomPlatform;
let bgImage;
let points = 0;
let startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startGame);


//initialise game
let init = () => {

    let canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    //set width/height for the dom element
    canvas.setAttribute('width', CONFIG.width);
    canvas.setAttribute('height', CONFIG.height);

    //set width/height styles
    canvas.style.width = CONFIG.width + 'px';
    canvas.style.height = CONFIG.height + 'px';

    player = new Player(CONFIG);

    //Background Image
    bgImage = new Image();
    bgImage.src = './layout2.jpg';

    bottomPlatform = new Platform(0,899,1200,1);
    

    // Array for Platforms and fragments (used the config in fragments becasue they always have the same size)
    platforms[0] = new Platform(0, 745, 81, 18);

    platforms[1] = new Platform(95, 698, 62, 18);

    platforms[2] = new Platform(162, 643, 48, 18);

    platforms[3] = new Platform(223, 591, 27, 18);

    platforms[4] = new Platform(267, 339, 81, 18);

    platforms[5] = new Platform(370, 489, 20, 18);

    platforms[6] = new Platform(400, 680, 57, 18);

    platforms[7] = new Platform(466, 732, 40, 18);

    platforms[8] = new Platform(510, 445, 45, 18);

    platforms[9] = new Platform(611, 505, 66, 18);

    platforms[10] = new Platform(690, 760, 111, 19);

    platforms[11] = new Platform(818, 432, 79, 18);

    platforms[12] = new Platform(914, 523, 43, 18);

    platforms[13] = new Platform(970, 695, 30, 18);

    platforms[14] = new Platform(1076, 348, 65, 18);

    platforms[15] = new Platform(1156, 520, 42, 18);

    fragments[0] = new Fragment (-20, 640, CONFIG);

    fragments[1] = new Fragment (690, 660, CONFIG);

    fragments[2] = new Fragment (475, 345, CONFIG);

    fragments[3] = new Fragment (1120, 415, CONFIG);

    fragments[4] = new Fragment (800, 330, CONFIG);
    gameLoop();
}



// 60 fps
let drawFPS = () => {
    let secondSinceStartOfGame = (performance.now() - timeStart) / 1000;
    let fps = Math.round(ticks / secondSinceStartOfGame);

}

let drawPoints = () => {
    context.textAlign = 'right';
    context.font = '25px sans-serif';
    context.fillStyle = 'red';
    context.fillText(points , CONFIG.width - 30, 30);
}

let updateUi = () => {
    //document.getElementById("ui-points").textContent = points;
}

let gameLoop = () => {

    context.clearRect(0, 0, CONFIG.width, CONFIG.height);

    //drawing bg image
    context.drawImage(bgImage, 0, 0, CONFIG.width, CONFIG.height);

    // updaten der player werten zu dem "eigentlich" Stand (keyevents, friction etc)
    player.update();

    
    player.grounded = false;
    
    //collision check for platform and player --> console tells when colliding + setback function and jump height 
    platforms.forEach(plat => {

        /* context.fillStyle = "#FF0000"
        context.rect(plat.x, plat.y, plat.width, plat.height); */

        // check ob !!!theoretisch eine collision besteht in allen richtungen, falls eine collision auftritt werden die werte im player (grounded, jumping, delta etc) angepasst
        var dir = colCheck(player, plat);

        if (dir === "l" || dir === "r") {
            player.deltaX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.deltalY *= -1;
        }
    });

    //check für grounded --> wenn er auf einer platform steht keine gravitaton
    if(player.grounded){
        player.deltaY = 0;
   }

   // hier werden die werte die in der "theoretsichen" update function ermittelt werden auf den player applied
   player.updateApply();


    //collision check for player and fragment
    fragments.forEach(fragment => {
        if (checkCollision(fragment, player)){
            console.log("yay");
            points++;
            fragments.splice(fragments.indexOf(fragment), 1);
            updateUi();
        }
    });

    // collision check for ground plane --> death
    if (checkCollision(bottomPlatform, player)){
        console.log("DEAD");
        window.location.reload();
        return;
    }
             
    if (points == 5) {    
        console.log("WIN");
        window.location.reload();  
        return;
    }
        


    

   

    


    
    player.render(context);
    fragments.forEach(fragment => fragment.render(context));
    /* bottomPlatform.render(context); */
    
    drawPoints();

    ticks++;

    window.requestAnimationFrame(gameLoop);

}

// nachdem alle elemente der seite geladen wurden wird die init() ausgeführt
window.addEventListener('load', function () {
    init();
});


//collision function --> checking if boundingboxes are "overlapping"
let checkCollision = (gameObjectA, gameObjectB) => {

    
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();


    //collision criteria 
    if (bbA.x < bbB.x + bbB.width &&
        bbA.x + bbA.width > bbB.x &&
        bbA.y < bbB.y + bbB.height &&
        bbA.y + bbA.height > bbB.y){
        return true; // collision
    }
    else
        return false; //no collision

}



// the collision function which checks for the specific sites (vector based)
function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}