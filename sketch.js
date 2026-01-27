let studySet;
let start = 0,
  end = 50; // 0-50 fine
let showIndex = 0,
  showIndex2 = 1,
  targetIndex = 2;

let screen = "race";
let wStudySet = [];
let card = [];

let inp = [];
let activeTextbox = {
  txt: "",
};
let cursorBlinkTimer = 0,
  cursorBlinkPeriod = 60;
let succeedTimer = 0,
  failTimer = 0;

let successes = 0, fails = 0, time = 0;
const failCountMap = new Map();
let raceWonTimer = 0;
const answerMap = new Map();
let showGraph = false;
let dots = [];

function preload() {
	loadJSON("studySets/mainSet.json", data => { studySet = data; });
}

function setup() {
	createCanvas(windowWidth, windowHeight);
  nextCard();
  
  // console.log(studySet.length);

  for (const row of studySet) {
    answerMap.set(row[showIndex], row[targetIndex]);
  }
}

function draw() {
  if(screen==="race"){
    background(255);
    
    let maxy = 1;
    for(let d of dots){
      maxy = max(maxy,d.y);
    }

    if(showGraph){
      fill(222,222,255);
      beginShape();
      vertex(0,height);
      vertex(0,0);
      for(let d of dots){
        vertex(width*d.x,height*d.y/maxy);
      }
      endShape(CLOSE);
    }

    
    if(failTimer>0){
      failTimer--;
      fill(255,0,0,failTimer*2.5);
      noStroke();
      rect(0,0,width,height);
    }
    if(succeedTimer>0){
      succeedTimer--;
      fill(0,255,0,succeedTimer*2.5);
      noStroke();
      rect(0,0,width,height);
    }
    
    push();
    translate(width/2,height/2);

    card = wStudySet[0];
    textSize(140);
    textAlign(CENTER, CENTER);
    fill(0);
    text(card[showIndex],0,-90);

    textSize(50);
    textAlign(LEFT, TOP);
    let showTxt = activeTextbox.txt;
    if (cursorBlinkTimer < cursorBlinkPeriod / 2) {
      showTxt += "︳"; // pretend cursor. or use "|"
    }
    text(showTxt,-120,0);
    textAlign(CENTER, CENTER);
    text(card[showIndex2],0,100);
    {
      let ind = card[showIndex2].search(card[showIndex]);
      if (ind !== -1) {
        let leftWidth = textWidth(card[showIndex2].slice(0,ind));
        let rightWidth = textWidth(card[showIndex2].slice(ind+card[showIndex].length,card[showIndex2].length));
        fill(255,0,255);
        text(card[showIndex],(leftWidth-rightWidth)/2,100);
      }
    }
    
    pop();

    cursorBlinkTimer++;
    if (cursorBlinkTimer >= cursorBlinkPeriod) {
      cursorBlinkTimer = 0;
    }
    
    if (activeTextbox.txt === card[targetIndex]) {
      succeed();
    }

    time = round(millis()/1000);
    textAlign(RIGHT,TOP);
    textSize(40);
    fill(0,150,0);
    text(successes+" / "+(end-start),width-50,40);
    fill(220,0,0);
    text(fails,width-50,80);
    fill(0);
    text(time,width-50,120);
  }
  else if(screen==="raceWin"){
    raceWonTimer++;
    push();
    translate(width/2,height/2);
    fill(180,180,255,raceWonTimer*0.1);
    noStroke();
    rect(-width*0.5,-height*0.5,width,height);
    fill(255);
    textSize(80);
    textAlign(CENTER,CENTER);
    text("You won in "+time+" seconds",0,-200);
    let topFailed = getTopFailed(10);
    
    textSize(40);
    let y = -100;
    for (const [char, count] of topFailed){
      text(char,-180,y);
      text(answerMap.get(char),0,y);
      text((count+1)+" tries",180,y);
      y += 45;
    }
    pop();
  }
}

keyPressed = function () {
  inp[keyCode] = true;
  if(screen === "race"){
    switch (keyCode) {
      case 8:
        // backspace
        if (activeTextbox.txt.length) {
          if (inp[17]) {
            while (
              activeTextbox.txt.length &&
              activeTextbox.txt[activeTextbox.txt.length - 1] === " "
            ) {
              activeTextbox.txt = activeTextbox.txt.substr(
                0,
                activeTextbox.txt.length - 1
              );
            } // delete spaces first
            while (
              activeTextbox.txt.length &&
              activeTextbox.txt[activeTextbox.txt.length - 1] !== " "
            ) {
              activeTextbox.txt = activeTextbox.txt.substr(
                0,
                activeTextbox.txt.length - 1
              );
            } // delete a word
            inp[17] = false; // because when you press backspace, it no longer lets you unpress ctrl
          } else {
            activeTextbox.txt = activeTextbox.txt.substr(
              0,
              activeTextbox.txt.length - 1
            );
          }
          cursorBlinkTimer = cursorBlinkPeriod / 4;
        }
        break;
      default:
        if (keyCode > 46 || keyCode === 32) {
          // generally only accept stuff that displays
          activeTextbox.txt += key.toString();
          cursorBlinkTimer = cursorBlinkPeriod / 4;
          if(keyCode >= 48 && keyCode <= 52){
            if (activeTextbox.txt === card[targetIndex]) {
              succeed();
            }
            else {
              fail(card[showIndex]);
            }
          }
        }
        break;
    }
  }
  else if(screen === "raceWin"){
    if(keyCode===13){
      screen = "race";
    }
  }
};
keyReleased = function () {
  inp[keyCode] = false;
};

function nextCard() {
  if (wStudySet.length > 0) {
    wStudySet.splice(0, 1);
  }
  if (wStudySet.length === 0) {
    wStudySet = shuffle(studySet.slice(start, end));
    if (wStudySet[0][0] === card[0]) {
      [wStudySet[0], wStudySet[1]] = [wStudySet[1], wStudySet[0]];
    }
  }
}
function succeed(){
  successes++;
  succeedTimer = 28;
  if(wStudySet.length===1){
    screen = "raceWin";
  }
  else{
    dots.push({
      x:(successes)/(end-start),
      y:time,
    });
    nextCard();
  }
  activeTextbox.txt = "";
}
function fail(char){
  fails++;
  failTimer = 32;
	if (!failCountMap.has(char)) {
		failCountMap.set(char, 0);
	}
	failCountMap.set(char, failCountMap.get(char) + 1);
}
function getTopFailed(n = 10) {
	return [...failCountMap.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, n);
}