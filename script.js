const simulationCanvas = document.getElementById('simulationCanvas');
const scaleCanvas = document.getElementById('scaleCanvas');
const ctxSim = simulationCanvas.getContext('2d');
const ctxScale = scaleCanvas.getContext('2d');

const wavelengthInput = document.getElementById('wavelength');
const gratingDensityInput = document.getElementById('gratingDensity');
const screenDistanceInput = document.getElementById('screenDistance');

const wavelengthValue = document.getElementById('wavelengthValue');
const gratingDensityValue = document.getElementById('gratingDensityValue');
const screenDistanceValue = document.getElementById('screenDistanceValue');
const darkModeToggle = document.getElementById('darkModeToggle');

const decreaseGratingDensity = document.getElementById('decreaseGratingDensity');
const increaseGratingDensity = document.getElementById('increaseGratingDensity');

let wavelength = +wavelengthInput.value;
let gratingDensity = +gratingDensityInput.value;
let screenDistance = +screenDistanceInput.value;

function updateValues() {
  wavelengthValue.textContent = wavelength;
  gratingDensityValue.textContent = gratingDensity;
  screenDistanceValue.textContent = screenDistance;
}

function drawMainSimulation() {
  ctxSim.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);
  const width = simulationCanvas.width;
  const height = simulationCanvas.height;

  const wavelengthMeters = wavelength * 1e-9;
  const gratingSpacing = 1 / (gratingDensity * 1e3);

  const laserX = width / 6;
  const gratingX = width / 3;
  const screenX = (5 * width) / 6 - (85 - screenDistance) * 5; // Move screen dynamically
  const centerY = height / 2;

  ctxSim.strokeStyle = "red";
  ctxSim.lineWidth = 2;
  ctxSim.beginPath();
  ctxSim.moveTo(laserX, centerY);
  ctxSim.lineTo(gratingX, centerY);
  ctxSim.stroke();

  const scale = 150;
  const maxOrder = 10;
  for (let m = -maxOrder; m <= maxOrder; m++) {
    const angle = Math.asin(m * wavelengthMeters / gratingSpacing);
    if (!isNaN(angle)) {
      const beamY = centerY + Math.tan(angle) * (screenDistance * scale / 100);
      ctxSim.strokeStyle = `rgba(255, 0, 0, 0.3)`;
      ctxSim.lineWidth = 1;
      ctxSim.beginPath();
      ctxSim.moveTo(gratingX, centerY);
      ctxSim.lineTo(screenX, beamY);
      ctxSim.stroke();
      ctxSim.fillStyle = `rgb(${Math.min(255, wavelength - 400)}, ${Math.max(0, 700 - wavelength)}, 255)`;
      ctxSim.beginPath();
      ctxSim.arc(screenX, beamY, 5, 0, 2 * Math.PI);
      ctxSim.fill();
    }
  }

  // Draw screen
  ctxSim.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctxSim.fillRect(screenX - 2, 0, 4, height);
}

function drawScaleView() {
  ctxScale.clearRect(0, 0, scaleCanvas.width, scaleCanvas.height);
  const width = scaleCanvas.width;
  const height = scaleCanvas.height;

  const pixelsPerCm = width / 200;
  const centerX = width / 2;

  ctxScale.strokeStyle = "var(--text-color)";
  ctxScale.lineWidth = 1;
  ctxScale.beginPath();
  for (let i = 0; i <= 200; i++) {
    const x = i * pixelsPerCm;
    ctxScale.moveTo(x, height / 2 - 5);
    ctxScale.lineTo(x, height / 2 + 5);
    if (i % 10 === 0) {
      ctxScale.fillStyle = "var(--text-color)";
      ctxScale.fillText(`${i - 100} cm`, x - 10, height / 2 - 10);
    }
  }
  ctxScale.stroke();

  const scale = 150;
  const maxOrder = 10;
  const gratingSpacing = 1 / (gratingDensity * 1e3);
  for (let m = -maxOrder; m <= maxOrder; m++) {
    const angle = Math.asin(m * wavelength * 1e-9 / gratingSpacing);
    if (!isNaN(angle)) {
      const beamX = centerX + Math.tan(angle) * (screenDistance * scale / 100);
      ctxScale.beginPath();
      ctxScale.moveTo(beamX, height / 2 - 10);
      ctxScale.lineTo(beamX, height / 2 + 10);
      ctxScale.strokeStyle = `rgba(255, 0, 0, 0.5)`;
      ctxScale.stroke();
    }
  }
}

function switchTheme() {
  const currentTheme = document.body.dataset.theme;
  document.body.dataset.theme = currentTheme === "dark" ? "light" : "dark";
}

darkModeToggle.addEventListener('click', switchTheme);

wavelengthInput.addEventListener('input', () => {
  wavelength = +wavelengthInput.value;
  updateValues();
  drawMainSimulation();
});

gratingDensityInput.addEventListener('input', () => {
  gratingDensity = +gratingDensityInput.value;
  updateValues();
  drawMainSimulation();
});

screenDistanceInput.addEventListener('input', () => {
  screenDistance = +screenDistanceInput.value;
  updateValues();
  drawMainSimulation();
});

decreaseGratingDensity.addEventListener('click', () => {
  gratingDensity -= 10;
  gratingDensityInput.value = gratingDensity;
  updateValues();
  drawMainSimulation();
});

increaseGratingDensity.addEventListener('click', () => {
  gratingDensity += 10;
  gratingDensityInput.value = gratingDensity;
  updateValues();
  drawMainSimulation();
});

drawMainSimulation();
drawScaleView();
