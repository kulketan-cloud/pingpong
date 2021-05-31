var canvas = document.getElementById("ttgame");
const framePerSecond = 50;
const ctx = canvas.getContext('2d');
var audio = new Audio("preview.mp3");
var directionofBall = 2;
var execution = false;
var loop;
//var fullScreenFlag = false;

var ttball = {
    x : canvas.width/2,
    y : canvas.height/2,
    vx: 5,
    vy: 5,
    radius : 10,
    color : "#FBC16E"
}

var ttuser = {
    x : 0, 
    y : (canvas.height-100)/2, 
    
    vx: 0,
    vy: 30,

    width : 10,
    height : 100,
    score : 0,
    color : "#3B59F2"
}

var ttcomp = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 

    vx: 0,
    vy : 4,

    width : 10,
    height : 100,
    score : 0,
    color : "#FB747A"
}
var ttnet = {
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
    if(execution){
        if(ev.key=="ArrowUp" || ev.key=="w"){
        
        if(ttuser.y < ttuser.vy) {
            ttuser.y = 0;
        //  raf = window.requestAnimationFrame(render);
        }
        else
        {
            ttuser.y -= ttuser.vy;
        //   raf = window.requestAnimationFrame(render);
        }

        }
        if(ev.key=="ArrowDown" || ev.key=="s"){


            if(ttuser.y > canvas.height-(100 + ttuser.vy)){
                ttuser.y = canvas.height - 100;
                //raf = window.requestAnimationFrame(render);
            }
            else
            {
                ttuser.y += ttuser.vy;
            //raf = window.requestAnimationFrame(render);
            }
        }
    }/*
    if(ev.key=="Escape"){
        console.log('pressed esc key');
        changeScreenToMinimize();
    }*/
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
    //user
    drawRect(ttuser.x, ttuser.y, ttuser.width, ttuser.height, ttuser.color);
    //comp
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
          if(ttball.x == 20){
            audio.play();
            ttball.vx = -ttball.vx;
            var centerofUserPaddle = ttuser.y + (ttuser.height/2);
            //if touches mid
            console.log("ttuser.y:" + ttuser.y);
            console.log("ttball.y:" + ttball.y);
            console.log("centerofuserpaddle:" + centerofUserPaddle);
            if( ttball.y < centerofUserPaddle + 5 && ttball.y > centerofUserPaddle - 5) //check for user paddle between 45 to 55
            {
                //do nothing   
                console.log("touching middle");
                directionofBall = 2;
            }
            else if(ttball.y < centerofUserPaddle - 5 && ttball.y >= (ttuser.y-ttball.radius)) //check for user paddle between -10 to 44
            {
                directionofBall = 1;
                console.log("touching top");
            }
            else if(ttball.y > centerofUserPaddle + 5 && ttball.y <= (ttuser.y+ttuser.height+ttball.radius)) //check for user paddle between 56 to 110
            {
                directionofBall = 1;
                console.log("touching bottom");
            }
          }
      }
      if (ttball.y >= ttcomp.y && ttball.y <= (ttcomp.y + 100)){
          
        //ball hitting the comp paddle
        if(ttball.x == canvas.width - 20){
            audio.play();
            console.log("bounce back from computer paddle");
            ttball.vx = -ttball.vx;

            var centerofUserPaddle = ttcomp.y + (ttcomp.height/2);

            if( ttball.y < centerofUserPaddle + 5 && ttball.y > centerofUserPaddle - 5) //check for comp paddle between 45 to 55
            {
                //do nothing   
                console.log("touching middle");
                directionofBall = 2;
            }
            else if(ttball.y < centerofUserPaddle - 5 && ttball.y >= ttcomp.y) //check for comp paddle between 0 to 44
            {
                directionofBall = 1;
                console.log("touching top");
            }
            else if(ttball.y > centerofUserPaddle + 5 && ttball.y <= (ttuser.y+ttuser.height)) //check for comp paddle between 56 to 100
            {
                console.log("touching bottom");
                directionofBall = 1;
            }
        }
    }

    if(directionofBall == 2)
      ttball.x += ttball.vx;

    if(directionofBall == 1)
    {
        ttball.x += ttball.vx;
        ttball.y += ttball.vy;
    }

}
function resetBall(){   
    if(ttball.x < 15){
        if(ttcomp.score < 20)
            ttcomp.score +=1;
        else{
            alert("Computer Wins!!!!!");
            location.reload();
        }
    }
    else{        
        if(ttuser.score < 20)
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
function restartGame(){
    location.reload();
}

function pauseGame(){
    clearInterval(loop);
    execution = false;
}
function ttcompAutomation(){

    ttcomp.y += (ttball.y - (ttcomp.y + ttcomp.height/2))*0.085;
}
function startGame(){
    if(!execution){
        loop = setInterval(game,1000/framePerSecond);
        execution = true;
    }
}

var buttons = document.getElementById("buttonList");

/*
function fullScreen(){
    
    var elem = document.getElementById("gameCanvas");
    var changeScreenIcon = document.getElementById("changeScreenIcon");
   
    console.log("flag" + fullScreenFlag);
    
    if(fullScreenFlag){
        changeScreenIcon.classList.remove("fa-compress");
        changeScreenIcon.classList.add("fa-expand");
        console.log("inside fullscreenglag true:" + document.exitFullscreen);
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullScreenFlag = false;
            changeScreenToMinimize();
            return true;
        } else if (document.webkitExitFullscreen) {  
            document.webkitExitFullscreen();
            fullScreenFlag = false;
            changeScreenToMinimize();
            return true;
        } else if (document.msExitFullscreen) { 
            document.msExitFullscreen();
            fullScreenFlag = false;
            changeScreenToMinimize();
            return true;
        }
    }
    
    if(!fullScreenFlag){
        
        changeScreenIcon.classList.remove("fa-expand");
        changeScreenIcon.classList.add("fa-compress");
        console.log("inside fullscreenglag false:" + elem.requestFullscreen);
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            fullScreenFlag = true;
        } else if (elem.webkitRequestFullscreen) { //safari
            elem.webkitRequestFullscreen();
            fullScreenFlag = true;
        } else if (elem.msRequestFullscreen) { // ie11
            elem.msRequestFullscreen();
            fullScreenFlag = true;
        }
    
        canvas.width = screen.width -3;
        canvas.height = screen.height -3;
        changeButtonForFullScreen();
        resetValues(); 
    }
    render();
}
function changeButtonForFullScreen(){
    
    buttons.style.display = "none";
    buttons.style.margin = "0px";
    buttons.style.bottom = "10%";
    buttons.style.left = "42%";
}
function changeButtonForMinimize(){
    buttons.style.display = "block";
    buttons.style.margin = "0px";
    buttons.style.marginTop = "10px";
    buttons.style.left = "32%";
    buttons.style.bottom = "0";
}
function changeScreenToMinimize(){
    
    console.log("inside changescreentominimize func");  
    canvas.width = 600;
    canvas.height = 350;
    changeButtonForMinimize();
    resetValues();
    render();
}
function resetValues(){
    ttuser.y =  (canvas.height-100)/2;
    ttcomp.x = canvas.width - 10 ;
    ttcomp.y = (canvas.height - 100)/2;
    ttball.x = canvas.width/2;
    ttball.y = canvas.height/2;
}
document.getElementById("gameCanvas").addEventListener('mousemove', e =>{
    if(fullScreenFlag){
        console.log("mosue is moving");
        buttons.style.display = "block";
    }
})
if(fullScreenFlag){
    buttons.style.display = "none";
}
*/
render();