const juicebar = document.getElementById("juicebar");
const juicebutton = document.getElementById("juicebutton");
const juicelabel = document.getElementById("juicelabel");

const upgradeButton = document.getElementById("upgradebutton");
const criticalButton = document.getElementById("criticalbutton")
const capacityButton = document.getElementById("capacitybutton");
const juicerButton = document.getElementById("juicerbutton");

const upgradeCost = document.getElementById("upgradeCost");
const criticalCost = document.getElementById("criticalCost");
const capacityCost = document.getElementById("capacityCost");
const juicerCost = document.getElementById("juicerCost");

const shopMultiplierButtons = document.getElementById("shopMultiplierSection");

const PARTICLE_TYPE = {
    JUICE: 0,
    SPEND: 1,
    NUMBER: 2
};

let particles = [];
const particleCanvas = document.getElementById("particle");
const pCtx = particleCanvas.getContext("2d");

function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function display() {
    juicebar.value = game.juice / game.capacity;
    juicelabel.innerHTML = game.juice + "/" + game.capacity;

    upgradeCost.innerHTML = getUpgradeCost();
    criticalCost.innerHTML = getCriticalCost();
    capacityCost.innerHTML = getCapacityCost();
    juicerCost.innerHTML = getJuicerCost();

    upgradeButton.disabled = game.juice < getUpgradeCost();
    criticalButton.disabled = game.juice < getCriticalCost();
    capacityButton.disabled = game.juice < getCapacityCost();
    juicerButton.disabled = game.juice < getJuicerCost();

    juicebutton.disabled = game.juice >= game.capacity;

    doParticles();
    drawJuicers();
}

function createJuiceParticle(isCritical = false) {
    const sourceRect = juicebutton.getBoundingClientRect();
    for (let i = 0; i < Math.min(game.upgrade, 50); i++) {
        particles.push({
            x: sourceRect.left + sourceRect.width / 2,
            y: sourceRect.top + sourceRect.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            tx: particleCanvas.width / 2,
            ty: 0,
            r: 0,
            t: PARTICLE_TYPE.JUICE
        });
    }
    particles.push({
        x: sourceRect.left + sourceRect.width / 2,
        y: sourceRect.top + sourceRect.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() + 0.5) * -20,
        tx: 0,
        ty: 0,
        r: 0,
        color: isCritical ? "255, 255, 0" : "0, 0, 0",
        critcal: isCritical,
        t: PARTICLE_TYPE.NUMBER,
        text: "+" + (game.upgrade * (isCritical ? 2 : 1))
    });
}

function createSpendingParticleUpgrade(amount) {
    const targetRect = upgradeButton.getBoundingClientRect();
    createSpendingParticle(targetRect, amount);
}

function createSpendingParticleCritical(amount) {
    const targetRect = criticalButton.getBoundingClientRect();
    createSpendingParticle(targetRect, amount);
}

function createSpendingParticleCapacity(amount) {
    const targetRect = capacityButton.getBoundingClientRect();
    createSpendingParticle(targetRect, amount);
}

function createSpendingParticleJuicer(amount) {
    const targetRect = juicerButton.getBoundingClientRect();
    createSpendingParticle(targetRect, amount);
}

function createSpendingParticle(targetRect, amount) {
    for (let i = 0; i < Math.min(amount, 100); i++) {
        particles.push({
            x: particleCanvas.width * Math.random(),
            y: -19,
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5,
            tx: targetRect.left + targetRect.width / 2,
            ty: targetRect.top + targetRect.height / 2,
            r: 0,
            t: PARTICLE_TYPE.SPEND,
            rand: Math.random() - 0.5
        });
    }
    particles.push({
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
        vx: (Math.random() + 0.5) * 20,
        vy: (Math.random() - 0.5) * 8,
        tx: 0,
        ty: 0,
        r: 0,
        color: "255, 0, 0",
        t: PARTICLE_TYPE.NUMBER,
        text: "-" + amount
    });
}

function doParticles() {
    const newParticles = [];
    pCtx.lineWidth = 3;
    pCtx.strokeStye = "black";
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.t != PARTICLE_TYPE.NUMBER) {
            if (p.x < 0 || p.x > particleCanvas.width || p.y < -20 || p.y > particleCanvas.height) continue;
            const distanceToTarget = Math.sqrt(Math.pow(p.x - p.tx, 2) + Math.pow(p.y - p.ty, 2));
            if (distanceToTarget < 1) continue;
            
            p.x += p.vx;
            p.y += p.vy;
            p.life += 1;

            if (p.t == PARTICLE_TYPE.JUICE) {
                if (p.y < p.ty) {
                    p.vy += 0.02
                } else {
                    p.vy -= 0.05;
                }
                if (p.x < p.tx) {
                    p.vx += 0.08;
                } else {
                    p.vx -= 0.09;
                }
            } else if (p.t == PARTICLE_TYPE.SPEND) {
                const angleToTarget = Math.atan2(p.ty - p.y, p.tx - p.x);
                const finalAngle = angleToTarget + p.rand  * (Math.PI / 2);
                const speed = Math.max(1, distanceToTarget / (21 + p.rand * 20));
                p.vx = Math.cos(finalAngle) * speed;
                p.vy = Math.sin(finalAngle) * speed;
            }

            if (p.t == PARTICLE_TYPE.JUICE) {p.r += 0.1; pCtx.fillStyle = "blue";}
            else if (p.t == PARTICLE_TYPE.SPEND) {p.r = Math.min(distanceToTarget / 10, 19); pCtx.fillStyle = "red";}

            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            pCtx.fill();
        } else {
            pCtx.globalAlpha = 1 - p.r / 70;
            if (p.r > 70) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.r += 1;

            p.vx *= 0.9;
            p.vy *= 0.9;
            
            if (p.critcal) {
                pCtx.font = "bold " + (p.r * 1.5) + "px serif";
            } else {
                pCtx.font = p.r + "px Arial";
            }

            pCtx.fillStyle = "rgb(" + p.color + ")";
            pCtx.fillText(p.text, p.x, p.y);
            if (p.critcal) pCtx.strokeText(p.text, p.x, p.y);
            pCtx.globalAlpha = 1;
        }

        newParticles.push(p);
    }
    particles = newParticles;
}

function drawJuicers() {
    const sourceRect = juicebutton.getBoundingClientRect();
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;
    const longAxis = sourceRect.width > sourceRect.height ? sourceRect.width : sourceRect.height;

    pCtx.fillStyle = "black";

    let currentAngle = (Math.PI * (performance.now() / 5000)) % (2 * Math.PI);
    for (let i = 0; i < game.juicers; i++) {
        let distance = longAxis + 10;

        if (juicerCurrent == i && !juicebutton.disabled) {
            distance = Math.min(Math.abs(distance - (performance.now() - juicerSwitchTime) * 0.25 * game.juicers), distance);
            if (distance < 40) juicebutton.className = "simactive";
            else juicebutton.className = "";
        }

        const x = Math.cos(currentAngle) * distance;
        const y = Math.sin(currentAngle) * distance;
        pCtx.fillRect(sourceX + x - 15, sourceY + y - 15, 30, 30);

        currentAngle += (2 * Math.PI) / game.juicers;
    }
}

function displayShopMultiplier(button) {
    for (let i = 0; i < shopMultiplierButtons.children.length; i++) {
        shopMultiplierButtons.children[i].className = "";
    }
    
    button.className = "selected";
}
