export function drawRaceScreen(state) {
    background(255);

    if (state.showGraph) {
        let maxy = 1;
        for (let d of state.dots) maxy = Math.max(maxy, d.y);
        fill(222, 222, 255);
        beginShape();
        vertex(0, height);
        vertex(0, 0);
        for (let d of state.dots) vertex(width * d.x, height * d.y / maxy);
        endShape(CLOSE);
    }

    if (state.failTimer > 0) {
        state.failTimer--;
        fill(255, 0, 0, state.failTimer * 2.5);
        noStroke();
        rect(0, 0, width, height);
    }

    if (state.succeedTimer > 0) {
        state.succeedTimer--;
        fill(0, 255, 0, state.succeedTimer * 2.5);
        noStroke();
        rect(0, 0, width, height);
    }

    push();
    translate(width / 2, height / 2);
    state.card = state.wStudySet[0];
    textSize(140);
    textAlign(CENTER, CENTER);
    fill(0);
    text(state.card[state.showCol], 0, -90);

    textSize(50);
    textAlign(LEFT, TOP);
    let showTxt = state.activeTextbox.txt;
    if (state.cursorBlinkTimer < state.cursorBlinkPeriod / 2) showTxt += "︳";
    text(showTxt, -120, 0);

    textAlign(CENTER, CENTER);
    text(state.card[state.showCol2], 0, 100);
    {
        let ind = state.card[state.showCol2].search(state.card[state.showCol]);
        if (ind !== -1) {
            let leftWidth = textWidth(state.card[state.showCol2].slice(0, ind));
            let rightWidth = textWidth(state.card[state.showCol2].slice(ind + state.card[state.showCol].length));
            fill(255, 0, 255);
            text(state.card[state.showCol], (leftWidth - rightWidth) / 2, 100);
        }
    }

    pop();

    state.cursorBlinkTimer++;
    if (state.cursorBlinkTimer >= state.cursorBlinkPeriod) state.cursorBlinkTimer = 0;

    if (state.activeTextbox.txt === state.card[state.targetCol]) {
        state.succeed();
    }

    state.time = round(millis() / 1000);
    textAlign(RIGHT, TOP);
    textSize(40);
    fill(0, 150, 0);
    text(state.successes + " / " + (state.end - state.start), width - 50, 40);
    fill(220, 0, 0);
    text(state.fails, width - 50, 80);
    if(state.screen === "race"){
        fill(0);
        text(state.time, width - 50, 120);
    }
}

export function keyPressedRaceScreen(keyCode, key, state) {
    state.inp[keyCode] = true;

    switch (keyCode) {
        case 8: // backspace
            if (state.activeTextbox.txt.length) {
                if (state.inp[17]) {
                    while (state.activeTextbox.txt.length && state.activeTextbox.txt.slice(-1) === " ") {
                        state.activeTextbox.txt = state.activeTextbox.txt.slice(0, -1);
                    }
                    while (state.activeTextbox.txt.length && state.activeTextbox.txt.slice(-1) !== " ") {
                        state.activeTextbox.txt = state.activeTextbox.txt.slice(0, -1);
                    }
                    state.inp[17] = false;
                } else {
                    state.activeTextbox.txt = state.activeTextbox.txt.slice(0, -1);
                }
                state.cursorBlinkTimer = state.cursorBlinkPeriod / 4;
            }
            break;
        default:
            if (keyCode > 46 || keyCode === 32) {
                state.activeTextbox.txt += key.toString();
                state.cursorBlinkTimer = state.cursorBlinkPeriod / 4;
                if (keyCode >= 48 && keyCode <= 52 && [...state.activeTextbox.txt].filter(c => "01234".includes(c)).length === state.card[state.showCol].length) {
                    if (state.activeTextbox.txt === state.card[state.targetCol]) state.succeed();
                    else state.fail(state.card[state.showCol]);
                }
            }
            break;
    }
}
