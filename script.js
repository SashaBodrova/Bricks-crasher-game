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

let x = canvas.width / 2
let y = canvas.height - 30
let paddleX = (canvas.width - paddleWidth) / 2

let dx = 2
let dy = -2

let score = 0
let lives = 3

const ballRadius = 10

let bricks = []
for (let column = 0; column < brickColumnCount; column++) {
  bricks[column] = []
  for (let row = 0; row < brickRowCount; row++) {
    bricks[column][row] = {x: 0, y: 0, status: 1}
  }
}

function drawBricks() {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (bricks[column][row].status === 1) {
        let brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;

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
}

function drawBall() {
  ctx.beginPath()
  // (положение по оси х, положение по оси у, радиус)
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  // филлстайл хранит цвет
  ctx.fillStyle = '#0095DD'
  // филл - заливает хранимым цветом
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function collisionDetection() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      let brick = bricks[col][row]

      if (brick.status === 1 && x > brick.x && x < brick.x + brickWidth && y - ballRadius > brick.y && y - ballRadius < brick.y + brickHeight) {
        dy = -dy
        brick.status = 0
        score++
        if(score === brickRowCount * brickColumnCount) {
          alert('YOU ARE AMAZING')
          document.location.reload()
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Score: ' + score, 8, 20)
}

function drawLives() {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20)
}

function draw() {
  // сначала очищай предыдущий нарисоанный мяч
  ctx.clearRect(0, 0, canvas.width, canvas.height)


  // рисуй мяч заново
  drawBall()
  drawPaddle()
  drawBricks()

  collisionDetection()
  drawScore()
  drawLives()

  // меняй положение мяча
  x += dx
  y += dy

  // если положение по оси У < 0 или > высоты области рисования, то меняй направление по Y на противоположное
  if (y < ballRadius) {
    dy = -dy
  } else if (y > canvas.height - ballRadius) {
    // если ось Х шара больше оси Х левого края ракетки && ось Х шара меньше левого края ракетки + ширина ракетки
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      lives--
      if(!lives) {
        alert('GAME OVER')
        document.location.reload()
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  if (x < ballRadius || x > canvas.width - ballRadius) {
    dx = -dx
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  requestAnimationFrame(draw)
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true
  } else if (e.keyCode === 37) {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  }
}

function mouseMoveHandler(e) {
  let mouseX = e.clientX - canvas.offsetLeft
  if(mouseX > 0 && mouseX < canvas.width) {
    paddleX = mouseX - paddleWidth/2
  }
}

requestAnimationFrame(draw)