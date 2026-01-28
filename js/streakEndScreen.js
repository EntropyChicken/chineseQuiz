export function drawStreakEndScreen(state) {
    state.raceWonTimer++;
    push();
    translate(width / 2, height / 2);
    fill(180, 180, 255, state.raceWonTimer * 0.1);
    noStroke();
    rect(-width / 2, -height / 2, width, height);

    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("Your Streak was "+state.successes, 0, -200);

    let topFailed = stateFunctions.getTopFailed(1);
    textSize(40);
    let y = -100;
    for (const [char, count] of topFailed) {
        text(char, -100, y);
        text(state.answerMaps[state.studySetId].get(char), 100, y);
        y += 45;
    }

    pop();
}

export function keyPressedStreakEndScreen(keyCode, key, state) {
    if (keyCode === 13) {
        state.screen = "race";
    }
}
