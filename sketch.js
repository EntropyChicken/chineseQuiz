import { drawTitleScreen, keyPressedTitleScreen } from "./js/titleScreen.js";
import { drawStudyScreen, keyPressedStudyScreen } from "./js/studyScreen.js";
import { drawRaceEndScreen, keyPressedRaceEndScreen } from "./js/raceEndScreen.js";
import { drawStreakEndScreen, keyPressedStreakEndScreen } from "./js/streakEndScreen.js";

window.stateFunctions = window.stateFunctions || {};

let state = {
    screen: "title",
    studySetNames: ["frequent100", "maliping", "subjects", "classifiers", "units"],
    studySets: [], // preload from JSON
	studySetId: 0,
    start: 50,
    end: 80,
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
    lastMillis: -1,
    failCountMap: new Map(),
    raceWonTimer: 0,
    answerMaps: [], // many new Map()
    showGraph: false,
    dots: [],
    originalEnterState: {}  // set to state after choosing what mode to play. remake this in loadOriginalEnterState
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
    else if (state.screen === "race") drawStudyScreen(state);
    else if (state.screen === "raceEnd") drawRaceEndScreen(state);
    else if (state.screen === "study") drawStudyScreen(state);
    else if (state.screen === "streak") drawStudyScreen(state);
    else if (state.screen === "streakEnd") drawStreakEndScreen(state);
}

window.keyPressed = function() {
    if (state.screen === "title") {
        keyPressedTitleScreen(keyCode, key, state);
    } else if (state.screen === "race") {
        keyPressedStudyScreen(keyCode, key, state);
    } else if (state.screen === "raceEnd") {
        keyPressedRaceEndScreen(keyCode, key, state);
    } else if (state.screen === "study") {
        keyPressedStudyScreen(keyCode, key, state);
    } else if (state.screen === "streak") {
        keyPressedStudyScreen(keyCode, key, state);
    } else if (state.screen === "streakEnd") {
        keyPressedStreakEndScreen(keyCode, key, state);
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
        state.screen = "raceEnd";
    } else {
        state.dots.push({
            x: state.successes / min(state.end-state.start,state.studySets[state.studySetId].length),
            y: state.time
        });
        nextCard();
    }
    state.activeTextbox.txt = "";
}

function fail(char) {
    state.fails++;
    state.failTimer = 32;
    if (state.screen === "streak") {
        state.screen = "streakEnd";
    }
    if (!state.failCountMap.has(char)) state.failCountMap.set(char, 0);
    state.failCountMap.set(char, state.failCountMap.get(char) + 1);
}

function getTopFailed(n = 10) {
    return [...state.failCountMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function setOriginalEnterState() {
    state.originalEnterState = structuredClone(state);
}
function loadOriginalEnterState() {
    state = structuredClone(state.originalEnterState);
    state.originalEnterState = structuredClone(state);
}

stateFunctions.succeed = succeed;
stateFunctions.fail = fail;
stateFunctions.nextCard = nextCard;
stateFunctions.getTopFailed = getTopFailed;
stateFunctions.setOriginalEnterState = setOriginalEnterState;
stateFunctions.loadOriginalEnterState = loadOriginalEnterState;