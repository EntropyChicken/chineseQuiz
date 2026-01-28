export function drawRaceEndScreen(state) {
    state.raceWonTimer++;
    push();
    translate(width / 2, height / 2);
    fill(180, 180, 255, state.raceWonTimer * 0.1);
    noStroke();
    rect(-width / 2, -height / 2, width, height);

    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("You won in " + round(state.time*100)/100 + " seconds", 0, -200);

    let topFailed = stateFunctions.getTopFailed(10);
    textSize(40);
    let y = -100;
    for (const [char, count] of topFailed) {
        text(char, -180, y);
        text(state.answerMaps[state.studySetId].get(char), 0, y);
        text((count + 1) + " tries", 180, y);
        y += 45;
    }

    pop();
}

export function keyPressedRaceEndScreen(keyCode, key, state) {
    if (keyCode === 13) {
        stateFunctions.loadOriginalEnterState();
    }
}
