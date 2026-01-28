let options = ["study", "race", "streak"];

export function drawTitleScreen(state) {
    background(180, 180, 255);

    fill(255);
    textSize(100);
    textAlign(LEFT, TOP);
    text("Chinese Quiz", 50, 50);

    {
        textSize(25);
        textAlign(LEFT,CENTER);
        let unfinished = -1;
        let x = 50;
        for(let i = state.start; x <= width - 50 && i < state.end && i < state.studySets[state.studySetId].length; i++){
            let txt = state.studySets[state.studySetId][i][state.showCol];
            let prevx = x;
            x += textWidth(txt)+5;
            if (x > width - 50){
                txt += "......";
                unfinished = i+1;
            }
            text(txt,prevx,170);
        }
        if(unfinished !== -1){
            textAlign(RIGHT,CENTER);
            x = width-50;
            for(let i = min(state.end,state.studySets[state.studySetId].length)-1; x >= 50 && i >= unfinished; i--){
                let txt = state.studySets[state.studySetId][i][state.showCol];
                let prevx = x;
                x -= textWidth(txt)+5;
                if (x < 50){
                    txt = "......"+txt;
                }
                text(txt,prevx,205);
            }
        }
    }

    textSize(50);
    textAlign(LEFT, TOP);
    for (let i = 0; i < state.studySetNames.length; i++) {
        if(i===state.studySetId) fill(0,0,255);
        else fill(255);
        text("("+String.fromCharCode('a'.charCodeAt(0)+i)+") "+state.studySetNames[i], 50, 230 + i * 70);
    }
    for (let i = 0; i < options.length; i++) {
        fill(255);
        text("("+(i+1)+") "+options[i], width*0.6, 230 + i * 70);
    }
    textAlign(RIGHT, TOP);
    text((1+state.start)+"-"+state.end,width-50, 50);
}

export function keyPressedTitleScreen(keyCode, key, state) {
    state.inp[keyCode] = true;
    
    if(keyCode>=65&&keyCode<=90&&keyCode-65<state.studySetNames.length){
        state.studySetId = keyCode-65;
        state.start = 0;
        state.end = state.studySets[state.studySetId].length;
        stateFunctions.nextCard(true);
    }
    if(keyCode===38){
        if(state.inp[16]) state.start = min(state.start+10,state.end-5);
        else state.end = min(state.end+10,state.studySets[state.studySetId].length);
        stateFunctions.nextCard(true);
    }
    else if(keyCode===40){
        if(state.inp[16]) state.start = max(0,state.start-10);
        else state.end = max(state.start+5,state.end-10);
        stateFunctions.nextCard(true);
    }
    if(keyCode>48&&keyCode<=48+options.length){
        stateFunctions.nextCard(true);
        state.screen = options[keyCode-49].toLowerCase();
        stateFunctions.setOriginalEnterState();
    }
}
