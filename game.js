
let game = {
    "juice": 0,
    "upgrade": 1,
    "capacity": 10,
    "juicers": 0,
    "criticalChance": 0.05
};

let juicerIntervalId = -1;
let juicerCurrent = 0;
let juicerSwitchTime = 0;

let shopMultiplier = 1;
let capacityAuto = false;

function toggleCapacityAuto(button) {
    button.className = button.className == "selected" ? "" : "selected";
    capacityAuto = !capacityAuto;
}

function setShopMultipler(button, mul) {
    shopMultiplier = mul;
    displayShopMultiplier(button);
}

function getUpgradeCost() {
    return shopMultiplier * (15 + Math.floor(game.upgrade * game.upgrade * 0.5));
}

function getCriticalCost() {
    return shopMultiplier * Math.ceil(1000 * game.criticalChance);
}

function getCapacityCost() {
    return game.capacity;
}

function getJuicerCost() {
    return shopMultiplier * (game.juicers * 50 + 100);
}

function juice() {
    let isCritical = Math.random() < game.criticalChance;

    game.juice += game.upgrade * (isCritical ? 2 : 1);
    if (capacityAuto && game.juice >= game.capacity) capacity();

    if (game.juice > game.capacity) {
        game.juice = game.capacity;
    } else {
        createJuiceParticle(isCritical);
    }
}

function upgrade() {
    if (game.juice >= getUpgradeCost()) {
        game.juice -= getUpgradeCost();
        createSpendingParticleUpgrade(getUpgradeCost());
        game.upgrade += 1 * shopMultiplier;
    }
}

function critical() {
    if (game.juice >= getCriticalCost()) {
        game.juice -= getCriticalCost();
        createSpendingParticleCritical(getCriticalCost());
        game.criticalChance += (1 - game.criticalChance) * 0.08;
    }
}

function capacity() {
    if (game.juice >= getCapacityCost()) {
        game.juice -= getCapacityCost();
        createSpendingParticleCapacity(getCapacityCost());
        game.capacity += 10 * shopMultiplier;
    }
}

function juicer() {
    if (game.juice >= getJuicerCost()) {
        game.juice -= getJuicerCost();
        createSpendingParticleJuicer(getJuicerCost());
        game.juicers += 1 * shopMultiplier;
        setJuicerLoop();
    }
}

function setJuicerLoop() {
    if (juicerIntervalId != -1) clearInterval(juicerIntervalId);
    juicerIntervalId = setInterval(juicerLoop, 2000 / game.juicers);
}

function juicerLoop() {
    juice();
    juicerSwitchTime = performance.now();
    juicerCurrent++;
    if (juicerCurrent >= game.juicers) juicerCurrent = 0;
}

function gameLoop() {
    display();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameLoop();
}
