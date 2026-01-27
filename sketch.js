import { drawTitleScreen, keyPressedTitleScreen } from "./js/titleScreen.js";
import { drawRaceScreen, keyPressedRaceScreen } from "./js/raceScreen.js";
import { drawRaceWinScreen, keyPressedRaceWinScreen } from "./js/raceWinScreen.js";
// import { drawStudyScreen, keyPressedStudyScreen } from "./js/studyScreen.js";

let state = {
    screen: "title",
    studySetNames: ["frequent100", "subjects"],
    studySets: [], // preload from JSON
	studySetId: 0,
    start: 0,
    end: 50,
    showCol: 0,
    showCol2: 1,
    targetCol: 2,
    wStudySet: [],
    card: [],
    inp: [],
    activeTextbox: { txt: "" },
    cursorBlinkTimer: 0,
    cursorBlinkPeriod: 60,
    succeedTimer: 0,
    failTimer: 0,
    successes: 0,
    fails: 0,
    time: 0,
    failCountMap: new Map(),
    raceWonTimer: 0,
    answerMaps: [], // many new Map()
    showGraph: false,
    dots: []
};

window.preload = function() {
	for(let i = 0; i<state.studySetNames.length; i++){
		loadJSON("studySets/" + state.studySetNames[i] + ".json", data => {
			state.studySets[i] = data;
		});
	}
}

window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    nextCard(); // loads from state.studySets[0] by default, overwritten by title screen choice
	
	for(let i = 0; i<state.studySetNames.length; i++){
		state.answerMaps.push(new Map());
		for (const row of state.studySets[i]) {
			state.answerMaps[i].set(row[state.showCol], row[state.targetCol]);
		}
	}
}

window.draw = function() {
    if (state.screen === "title") drawTitleScreen(state);
    else if (state.screen === "race") drawRaceScreen(state);
    else if (state.screen === "raceWin") drawRaceWinScreen(state);
    else if (state.screen === "study") drawRaceScreen(state);
    // else if (state.screen === "study") drawStudyScreen(state);
}

window.keyPressed = function() {
    if (state.screen === "title") {
        keyPressedTitleScreen(keyCode, key, state);
    } else if (state.screen === "race") {
        keyPressedRaceScreen(keyCode, key, state);
    } else if (state.screen === "raceWin") {
        keyPressedRaceWinScreen(keyCode, key, state);
    } else if (state.screen === "study") {
        keyPressedRaceScreen(keyCode, key, state);
        // keyPressedStudyScreen(keyCode, key, state);
    }
}

window.keyReleased = function() {
    state.inp[keyCode] = false;
}






// shared functions

function nextCard() {
    if (state.wStudySet.length > 0) {
        state.wStudySet.splice(0, 1);
    }
    if (state.wStudySet.length === 0) {
        state.wStudySet = shuffle(state.studySets[state.studySetId].slice(state.start, state.end));
        if (state.wStudySet[0][0] === state.card[0]) {
            [state.wStudySet[0], state.wStudySet[1]] = [state.wStudySet[1], state.wStudySet[0]];
        }
    }
}

function succeed() {
    state.successes++;
    state.succeedTimer = 28;
    if (state.screen === "race" && state.wStudySet.length === 1) {
        state.screen = "raceWin";
    } else {
        state.dots.push({
            x: state.successes / (state.end - state.start),
            y: state.time
        });
        nextCard();
    }
    state.activeTextbox.txt = "";
}

function fail(char) {
    state.fails++;
    state.failTimer = 32;
    if (!state.failCountMap.has(char)) state.failCountMap.set(char, 0);
    state.failCountMap.set(char, state.failCountMap.get(char) + 1);
}

function getTopFailed(n = 10) {
    return [...state.failCountMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

state.succeed = succeed;
state.fail = fail;
state.nextCard = nextCard;
state.getTopFailed = getTopFailed;