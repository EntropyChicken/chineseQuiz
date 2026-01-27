export function drawTitleScreen(state) {
    background(180, 180, 255);
    fill(255);
    textSize(100);
    textAlign(LEFT, TOP);
    text("Chinese Quiz", 50, 50);
}

export function keyPressedTitleScreen(keyCode, key, state) {
    if (keyCode === 13) { // Enter to start
        return "race";
    }
    return "title";
}
