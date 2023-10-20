const { ipcRenderer } = require('electron')
// var Oscilloscope = require('oscilloscope')

// INIT
let isPlaying = false
let audioQueue = []
let audioToPlay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
let currentPlayingId = 0

// Canvas
let audioContext = new AudioContext()
const canvas = document.getElementById('oscilloscopeCanvas')
canvas.width = 800
canvas.height = 300
let ctx = canvas.getContext('2d')

document.addEventListener('DOMContentLoaded', function () {
  // Initially initialize the WebSocket
  let mediaRecorder
  let audioChunks = []

  async function initMediaRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
      // Send audio data to app main process
      if (event.data instanceof Blob) {
        const reader = new FileReader()
        reader.onload = function () {
          const arrayBuffer = this.result
          ipcRenderer.send('audio-blob', arrayBuffer)
        }
        reader.readAsArrayBuffer(event.data)
      } else {
        ipcRenderer.send('audio-blob', event.data)
      }
    }
  }

  initMediaRecorder()

  // Logic for keydown and keyup
  document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && mediaRecorder.state !== 'recording') {
      const recordIndicator = document.getElementById('record-indicator')
      recordIndicator.classList.add('recording')
      recordIndicator.textContent = 'REC •'

      mediaRecorder.start()
    }
  })

  document.addEventListener('keyup', function (event) {
    if (event.code === 'Space' && mediaRecorder.state === 'recording') {
      const recordIndicator = document.getElementById('record-indicator')
      recordIndicator.classList.remove('recording')
      recordIndicator.textContent = 'REC •'

      mediaRecorder.stop()
    }
  })
})

ipcRenderer.on('ws-status', (event, status) => {
  if (status === 'disconnected') {
    document.body.style.backgroundColor = '#888' // Gris pour indiquer une déconnexion
    const errorMessage = document.getElementById('error-message')
    errorMessage.style.display = 'block' // Affichez le message d'erreur
  } else if (status === 'connected') {
    document.body.style.backgroundColor = '#111' // Background color during connection
    const errorMessage = document.getElementById('error-message')
    errorMessage.style.display = 'none' // Hiding error message
  }
  // Add more states here, e.g.: error
})

ipcRenderer.on('play-audio', (event, dataFromMain) => {
  const arrayBuffer = toArrayBuffer(dataFromMain.audioBuffer)

  audioContext.decodeAudioData(
    arrayBuffer,
    (decodedAudioBuffer) => {
      const audioInfo = {
        id: audioQueue.length,
        order: dataFromMain.id,
        phrase: dataFromMain.phrase,
        buffer: decodedAudioBuffer,
      }
      console.log(
        'INCOMING --------------\n',
        'phrase: ',
        audioInfo.phrase,
        '\n ordre: ',
        audioInfo.order,
        '\n--------------\n'
      )
      audioQueue.push(audioInfo)
      playNextBuffer()
    },
    (error) => {
      console.error('Error decoding audio data:', error)
    }
  )
})

function playNextBuffer() {
  if (isPlaying) return

  const nextBufferInfo = audioQueue.find(
    (audio) => audio.order === currentPlayingId
  )

  if (typeof nextBufferInfo === 'undefined') return

  if (!audioToPlay[0] == nextBufferInfo.order) return

  if (nextBufferInfo) {
    audioToPlay.shift()
    isPlaying = true
    console.log('VA ETRE JOUE: ', nextBufferInfo.id, ' ----------------\n')
    playBuffer(nextBufferInfo.buffer)
    currentPlayingId++
  }
}

function playBuffer(decodedAudioBuffer) {
  let source = audioContext.createBufferSource()
  source.buffer = decodedAudioBuffer

  ctx.fillStyle = 'rgba(255, 182, 193, 0.5)'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 7

  let analyser = audioContext.createAnalyser()
  analyser.fftSize = 2048
  source.connect(analyser)

  const dataArray = new Uint8Array(analyser.frequencyBinCount)

  const sampleRate = audioContext.sampleRate
  const binSize = sampleRate / analyser.fftSize

  const lowerFrequency = 0
  const upperFrequency = 400

  const startBin = Math.floor(lowerFrequency / binSize)
  const endBin = Math.floor(upperFrequency / binSize)

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(canvas.width, canvas.height) / 4

  const relevantDataLength = endBin - startBin + 1
  const steps = relevantDataLength
  const stepAngle = (2 * Math.PI) / steps

  function animate() {
    analyser.getByteFrequencyData(dataArray)
    const relevantData = dataArray.slice(startBin, endBin + 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()

    for (let i = 0; i < relevantData.length; i++) {
      let value = relevantData[i]
      let barHeight = (value / 255) * radius
      const angleOffset = Math.PI
      let x1 =
        centerX + (radius + barHeight) * Math.cos(i * stepAngle - angleOffset)
      let y1 =
        centerY + (radius + barHeight) * Math.sin(i * stepAngle - angleOffset)

      let x2 =
        centerX + (radius + barHeight) * Math.cos(-i * stepAngle - angleOffset)
      let y2 =
        centerY + (radius + barHeight) * Math.sin(-i * stepAngle - angleOffset)

      if (i === 0) {
        ctx.moveTo(x1, y1)
      } else {
        ctx.lineTo(x1, y1)
      }

      ctx.lineTo(x2, y2)
    }

    ctx.closePath()
    ctx.stroke()

    requestAnimationFrame(animate)
  }

  animate()

  source.onended = () => {
    isPlaying = false
    playNextBuffer()
  }

  source.connect(audioContext.destination)
  isPlaying = true
  source.start()
}

// UTILS

const toArrayBuffer = (buffer) => {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
}

function drawStaticCircle() {
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(canvas.width, canvas.height) / 4

  const sampleRate = audioContext.sampleRate
  const binSize = sampleRate / 2048
  const lowerFrequency = 0
  const upperFrequency = 400
  const startBin = Math.floor(lowerFrequency / binSize)
  const endBin = Math.floor(upperFrequency / binSize)
  const relevantDataLength = endBin - startBin + 1
  const steps = relevantDataLength
  const stepAngle = (2 * Math.PI) / steps

  // Cette valeur est à titre d'exemple. Vous pouvez la changer comme vous le souhaitez.
  const staticBarHeight = radius * 0.5
  const angleOffset = Math.PI

  ctx.fillStyle = 'rgba(255, 182, 193, 0.5)'
  ctx.strokeStyle = 'white' // #0a88e3
  ctx.lineWidth = 7

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()

  for (let i = 0; i < steps; i++) {
    let x1 =
      centerX +
      (radius + staticBarHeight) * Math.cos(i * stepAngle - angleOffset)
    let y1 =
      centerY +
      (radius + staticBarHeight) * Math.sin(i * stepAngle - angleOffset)

    let x2 =
      centerX +
      (radius + staticBarHeight) * Math.cos(-i * stepAngle - angleOffset)
    let y2 =
      centerY +
      (radius + staticBarHeight) * Math.sin(-i * stepAngle - angleOffset)

    if (i === 0) {
      ctx.moveTo(x1, y1)
    } else {
      ctx.lineTo(x1, y1)
    }

    ctx.lineTo(x2, y2)
  }

  ctx.closePath()
  ctx.stroke()
}

// Appeler la fonction pour dessiner le cercle par défaut
drawStaticCircle()
