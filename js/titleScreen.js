let options = ["Study", "Race"];

export function drawTitleScreen(state) {
    background(180, 180, 255);

    fill(255);
    textSize(100);
    textAlign(LEFT, TOP);
    text("Chinese Quiz", 50, 50);

    textSize(60);
    for (let i = 0; i < options.length; i++) {
        fill(255);
        text("("+(i+1)+") "+options[i], 50, 220 + i * 100);
    }
}

export function keyPressedTitleScreen(keyCode, key, state) {
    if(keyCode>48&&keyCode<=48+options.length){
        return options[keyCode-49].toLowerCase();
    }
    return "title";
}