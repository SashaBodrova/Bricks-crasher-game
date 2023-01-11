// система координат начинается с верхнего левого угла

const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')
const paddleHeight = 10
const paddleWidth = 75
const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

let rightPressed = false
let leftPressed = false

let x = canvas.width/2
let y = canvas.height-30
let paddleX = (canvas.width-paddleWidth)/2

let dx = 2
let dy = -2

const ballRadius = 10

let bricks = []
for(let column = 0; column < brickColumnCount; column++) {
  bricks[column] = []
  for(let row = 0; row < brickRowCount; row++) {
    bricks[column][row] = { x: 0, y: 0 }
  }
}

function drawBricks() {
  for(let column = 0; column < brickColumnCount; column++) {
    for(let row = 0; row < brickRowCount; row++) {
      let brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
      let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;

      bricks[column][row].x = brickX
      bricks[column][row].y = brickY
      ctx.beginPath()
      ctx.rect(brickX, brickY, brickWidth, brickHeight)
      ctx.fillStyle = '#0095DD'
      ctx.fill()
      ctx.closePath()
    }
  }
}

function drawBall() {
  ctx.beginPath()
  // (положение по оси х, положение по оси у, радиус)
  ctx.arc(x, y, ballRadius, 0, Math.PI*2)
  // филлстайл хранит цвет
  ctx.fillStyle = '#0095DD'
  // филл - заливает хранимым цветом
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function draw() {
  // сначала очищай предыдущий нарисоанный мяч
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // рисуй мяч заново
  drawBall()
  drawPaddle()
  drawBricks()

  // меняй положение мяча
  x += dx
  y += dy

  // если положение по оси У < 0 или > высоты области рисования, то меняй направление по Y на противоположное
  if(y < ballRadius) {
    dy = -dy
  } else if(y > canvas.height-ballRadius) {
    // если ось Х шара больше оси Х левого края ракетки && ось Х шара меньше левого края ракетки + ширина ракетки
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      console.log(bricks)
      console.log(x, paddleX)
      alert('GAME OVER')
      document.location.reload()

    }
  }
  if(x < ballRadius || x > canvas.width-ballRadius) {
    dx = -dx
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7
  } else if(leftPressed && paddleX > 0) {
    paddleX -= 7
  }


}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler(e) {
  if(e.keyCode === 39) {
    rightPressed = true
  } else if(e.keyCode === 37) {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if(e.keyCode === 39) {
    rightPressed = false
  } else if(e.keyCode === 37) {
    leftPressed = false
  }
}


let interval = setInterval(draw, 10)