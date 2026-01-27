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
}

export function keyPressedTitleScreen(keyCode, key, state) {
    if(keyCode>=65&&keyCode<=90){
        state.studySetId = keyCode-65;
        state.wStudySet = [];
        state.nextCard();
    }
    if(keyCode>48&&keyCode<=48+options.length){
        state.screen = options[keyCode-49].toLowerCase();
    }
}