let options = ["study", "race"];

export function drawTitleScreen(state) {
    background(180, 180, 255);

    fill(255);
    textSize(100);
    textAlign(LEFT, TOP);
    text("Chinese Quiz", 50, 50);

    textSize(50);
    for (let i = 0; i < state.studySetNames.length; i++) {
        if(i===state.studySetId) fill(0,0,255);
        else fill(255);
        text("("+String.fromCharCode('a'.charCodeAt(0)+i)+") "+state.studySetNames[i], 50, 220 + i * 80);
    }
    for (let i = 0; i < options.length; i++) {
        fill(255);
        text("("+(i+1)+") "+options[i], width*0.6, 220 + i * 80);
    }
    textAlign(RIGHT, TOP);
    text((1+state.start)+"-"+state.end,width-50, 50);
}

export function keyPressedTitleScreen(keyCode, key, state) {
    state.inp[keyCode] = true;
    
    if(keyCode>=65&&keyCode<=90&&keyCode-65<state.studySetNames.length){
        state.studySetId = keyCode-65;
    }
    if(keyCode===38){
        if(state.inp[16]){
            state.start = min(state.start+10,state.end);
        }
        else{
            state.end = state.end+10;
        }
    }
    else if(keyCode===40){
        if(state.inp[16]){
            state.start = max(0,state.start-10);
        }
        else{
            state.end = max(0,state.end-10);
        }
    }
    if(keyCode>48&&keyCode<=48+options.length){
        state.wStudySet = []; // reload set when transition out of screen
        state.nextCard();
        state.screen = options[keyCode-49].toLowerCase();
    }
}
