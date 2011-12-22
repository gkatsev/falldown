var canvas;
var intervalId;
var ctx;
var dx = 15;
var dy = 5;
var lines;
var score = 0;
var paused = false;

var ball =
{
  x: 250,
  y: 25,
  r: 15,
  collided: false,
  color: "black",

  reset: function ()
  {
    this.x = 250;
    this.y = 25;
    this.r = 15;
    this.collided = false;
  },

  move_down: function ()
  {
    this.collide();

    if (this.collided) {
      this.y -= 2;
    }
    else {
      if (!this.at_bottom()) {
        this.y += dy;
      }
    }
  },

  move_side: function (side)
  {
    var temp = side(this.x, dx);
    if (temp < 490 && temp > 10) {
      this.x = temp;
    }
    this.collide();
  },

  is_dead: function ()
  {
    if (this.y < 17) {
      return true;
    }
    else {
      return false;
    }
  },

  at_bottom: function ()
  {
    if (this.y > 565) {
      return true;
    }
    else {
      return false;
    }
  },

  draw: function ()
  {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },

  collide: function () 
  {
    for (var i = 0; i < lines.length; i = i + 1) {
      var temp = this.y - lines[i].y;
      if (temp >= -15 && temp <= 15 /* && this.x <= lines[i].shole && this.x >= lines[i].ehole */)
      {
        if (this.x >= lines[i].shole && this.x <= lines[i].ehole) {
          this.collided = false;
        }
        else {
          this.collided = true;
        }
      }
    }
  }
};

function drawLine(x1, y1, x2, y2, color)
{
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}

function lineMaker(height)
{
  return {
    x: 0,
    y: height,
    color: "black",
    hole_width: 50,
    rand: Math.random(),
    at_top: false,

    init: function init()
    {
      this.shole = this.rand * (500 - this.hole_width);
      this.ehole = this.shole + this.hole_width;
    },

    move: function move()
    {
      this.y -= 2;
      if (this.y <= 0) {
        this.at_top = true;
      }
    },

    draw: function draw()
    {
      drawLine(this.x, this.y, this.shole, this.y, this.color);
      drawLine(this.ehole, this.y, 500, this.y, this.color);
    }
  };
}

function update()
{
  if (!ball.is_dead() && !paused) {
    ctx.clearRect(0, 0, 500, 600);
    for (var i = 0; i < lines.length; i = i + 1) {
      lines[i].move();
      lines[i].draw();
      if (lines[i].at_top) {
        var temp = lines[i];
        lines[i] = lineMaker(600);
        lines[i].init();
      }
    }
    ball.move_down();
    ball.draw();
    ctx.save();
    ctx.translate(10, 20);
    score += 10;
    //ctx.fillText("Score: " + score, 10, 10);
    ctx.mozDrawText("Score: " + score);
    ctx.restore();
  }
}

function initLines()
{
  lines = [];
  lines[lines.length] = lineMaker(750);
  lines[lines.length] = lineMaker(900);
  lines[lines.length] = lineMaker(1050);
  lines[lines.length] = lineMaker(1200);

  for (var i = 0; i < lines.length; i = i + 1) {
    lines[i].init();
  }
}

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(evt)
{
  if (evt.keyCode === 39 || evt.keyCode === 68) {
    ball.move_side(function (x, y) {
        return x + y;
      });
  }
  else if (evt.keyCode === 37 || evt.keyCode === 65) {
    ball.move_side(function (x, y) {
        return x - y;
      });
  }
  else if (evt.keyCode === 32 || evt.keyCode === 80) {
    paused = !paused;
  }
  else if (evt.keyCode === 82 || evt.keyCode === 8) {
    ctx.clearRect(0, 0, 500, 600);
    ball.reset();
    score = 0;
    initLines();
    paused = false;
  }
}

$(document).keydown(onKeyDown);
function init()
{
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 500, 600);
  intervalId = setInterval(update, 0.0001);
  initLines();

  return intervalId;
}

$(document).ready(function ()
{
  init();
  update();
});

