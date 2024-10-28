const visualizer = document.getElementById('visualizer');
const avgSoundDisplay = document.getElementById('avgSound');
const highestSoundDisplay = document.getElementById('highestSound');
const soundHistoryList = document.getElementById('soundHistory');

let audioContext, analyser, dataArray, highestSound = 0, soundHistory = [], avgSound = 0;

function startDecibelMeter() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      updateMeter();
    })
    .catch(err => {
      console.error('Error accessing microphone:', err);
    });
}

function updateMeter() {
  analyser.getByteFrequencyData(dataArray);

  const sum = dataArray.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / dataArray.length);
  avgSound = ((avgSound * 9) + avg) / 10;
  highestSound = Math.max(highestSound, avg);

  avgSoundDisplay.innerText = `${Math.round(avgSound)} dB`;
  highestSoundDisplay.innerText = `${highestSound} dB`;

  addToHistory(avg);
  visualizeSound(avg);
  requestAnimationFrame(updateMeter);
}

function addToHistory(level) {
  if (soundHistory.length > 0) soundHistory.shift();
  soundHistory.push(level);

  soundHistoryList.innerHTML = '';
  soundHistory.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `Sound ${index + 1}: ${item} dB`;
    // soundHistoryList.appendChild(li);
  });
}

function visualizeSound(level) {
    let color;
  
    // Set color based on sound level
    if (level < 34) {
      color = '#1abc9c';  // Low level (Teal)
    } else if (level < 67) {
      color = '#3498db';  // Normal level (Sky Blue)
    } else {
      color = '#e74c3c';  // High level (Crimson)
    }
  
    // Apply gradient with chosen color
    visualizer.style.background = `linear-gradient(90deg, ${color} ${level}%, #39ff14 100%)`;
  }
  
  
