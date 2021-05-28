const canvas = document.getElementById("ttgame");
const framePerSecond = 70;
const ctx = canvas.getContext('2d');
console.log(ctx);
var audio = new Audio("preview.mp3");
const ttball = {
    x : canvas.width/2,
    y : canvas.height/2,
    vx: 5,
    vy: 5,
    radius : 10,
    color : "#FBC16E"
}

const ttuser = {
    x : 0, 
    y : (canvas.height-100)/2, 

    width : 10,
    height : 100,
    score : 0,
    color : "#3B59F2"
}

const ttcomp = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 

    vy : 5,
    width : 10,
    height : 100,
    score : 0,
    color : "#FB747A"
}
const ttnet = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "#000"
}
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color){
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);    
    ctx.stroke();
    ctx.fill();
 
}

document.onkeydown = function keyControlsUser(ev){
    
    const paddleSpeed = 30; 

    if(ev.key=="ArrowUp"){
    
      if(ttuser.y < paddleSpeed) {
        ttuser.y = 0;
      //  raf = window.requestAnimationFrame(render);
      }
      else if(ttuser.y >=0 ) 
      {
        ttuser.y -= paddleSpeed;
     //   raf = window.requestAnimationFrame(render);
      }

    }
    if(ev.key=="ArrowDown"){


        if(ttuser.y > canvas.height-(100 + paddleSpeed)){
            ttuser.y = canvas.height - 100;
            //raf = window.requestAnimationFrame(render);
        }

        else if(ttuser.y<canvas.height-100)
        {
        ttuser.y += paddleSpeed;
        //raf = window.requestAnimationFrame(render);
        }
    }
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(ttnet.x, ttnet.y + i, ttnet.width, ttnet.height, ttnet.color);
    }
}
function drawScore(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "50px fantasy";
    ctx.fillText(text, x, y);
}

function render(){
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawRect(0,0, canvas.width, canvas.height, "#27C16A");
    drawScore(ttuser.score,canvas.width/4,canvas.height/7);
    drawScore(ttcomp.score,3*canvas.width/4,canvas.height/7);    
    drawNet();
    drawRect(ttuser.x, ttuser.y, ttuser.width, ttuser.height, ttuser.color);
    drawRect(ttcomp.x, ttcomp.y, ttcomp.width, ttcomp.height, ttcomp.color);
    drawBall(ttball.x, ttball.y, ttball.radius, ttball.color);
}
function game(){
    ttcompAutomation();
    moveBall();
    render();
}
//var  = window.requestAnimationFrame(render);
//1 = going top
//2 = going straight
//3 = going bot

var directionofBall = 2;

function moveBall(){  
    //left and right sides of the ractangle won't bounce back the ball
    //top and bottom sides of the rectangle will bounce back the ball
    //and if paddle touches the ball then ball will bounce back

    if (ttball.y + ttball.vy + ttball.radius > canvas.height || ttball.y + ttball.vy - ttball.radius < 0) {
        ttball.vy = -ttball.vy;
      }
      if (ttball.x + ttball.vx + ttball.radius > canvas.width || ttball.x + ttball.vx - ttball.radius < 0) {
        ttball.vx = -ttball.vx;
        resetBall();
      }
      if (ttball.y >= ttuser.y && ttball.y <= (ttuser.y + 100)){
          
          //ball hitting the paddle
          if(ttball.x == 15){
            audio.play();
            ttball.vx = -ttball.vx;
            var centerofUserPaddle = ttuser.y + (ttuser.height/2);
            //if touches mid
            console.log("ttuser.y:" + ttuser.y);
            console.log("ttball.y:" + ttball.y);
            console.log("centerofuserpaddle:" + centerofUserPaddle);
            if( ttball.y < centerofUserPaddle + 10 && ttball.y > centerofUserPaddle - 10){
                //do nothing   
                console.log("touching middle");
                directionofBall = 2;
            }
            else{
                directionofBall = 1;
                console.log("touching top");
            }
          }
      }
      if (ttball.y >= ttcomp.y && ttball.y <= (ttcomp.y + 100)){
          
        //ball hitting the comp paddle
        if(ttball.x == canvas.width - 15){
            audio.play();
            console.log("bounce back from computer paddle");
            ttball.vx = -ttball.vx;

            var centerofUserPaddle = ttcomp.y + (ttcomp.height/2);

            if( ttball.y < centerofUserPaddle + 10 && ttball.y > centerofUserPaddle - 10){
                //do nothing   
                console.log("touching middle");
                directionofBall = 2;
            }
            else{
                directionofBall = 1;
                console.log("touching top");
            }
        }
    }

    if(directionofBall == 2)
      ttball.x += ttball.vx;

    if(directionofBall == 1){
        ttball.x += ttball.vx;
        ttball.y += ttball.vy;
    }
}
function resetBall(){
    if(ttball.x < 15){
        if(ttcomp.score <4)
            ttcomp.score +=1;
        else{
            alert("Computer Wins!!!!!");
            location.reload();
        }
    }
    else{        
        if(ttuser.score <4)
            ttuser.score +=1;
        else{
            alert("Player Wins!!!!!");
            location.reload();
        }
    }
    console.log("reset ball")
    ttball.x = canvas.width/2;
    ttball.y = canvas.height/2;
}
//  ttball's y is in between ( paddle'y & paddle's y + 100)
// ttball's x paddle's width 
//bounce back

/*player.top = player.y;
   player.right = player.x + player.width;
   player.bottom = player.y + player.height;
   player.left = player.x;*/

function restartGame(){
    location.reload();
}

function pauseGame(){
    execution = false;
    console.log("Setting execution to: " + execution);
    
}
function ttcompAutomation(){
    if(ttball.y > ttcomp.y + ttcomp.height - ttball.radius){
        ttcomp.y += ttcomp.vy;
    }
    if(ttball.y < ttcomp.y){
        ttcomp.y -= ttcomp.vy;
    }
}
function startGame(){
    execution = true;
    console.log("Setting execution to: " + execution);
    if(execution){
    let loop = setInterval(game,1000/framePerSecond);
    }
}
var execution = true;
render();