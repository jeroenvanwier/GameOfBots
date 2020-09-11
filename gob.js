function createBoard(width, height) {
    board = {
        width: width,
        height: height,
        bots: []
    };
    for (x = 0; x < board.width; x++) {
        board.bots[x] = [];
        for (y = 0; y < board.height; y++) {
            board.bots[x][y] = 0;
        }
    }
    return board;
}

function drawBoard(board) {
    var canvas = document.getElementById("board");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var context = canvas.getContext("2d");
    context.fillStyle = "#999999";
    for (x = 0; x <= board.width; x++) {
        context.fillRect(15*x,0,3,15*board.height);
    }
    for (y = 0; y <= board.height; y++) {
        context.fillRect(0,15*y,15*board.width,3);
    }
    context.fillStyle = "#000000";
    for (x = 0; x < board.width; x++) {
        for (y = 0; y < board.height; y++) {
            if (board.bots[x][y] == 1) {
                context.fillRect(3 + 15*x, 3 + 15*y, 12, 12);
            }
        }
    }
}

function clickBoard(board, x, y) {
    var tileX = parseInt(x / 15),
        tileY = parseInt(y / 15);
    if (tileX < board.width && tileY < board.height) {
        board.bots[tileX][tileY] = 1;
    }
    drawBoard(board);
}

function tickBoard(board) {
    var oldBoard = [];
    for (x = 0; x < board.width; x++) {
        oldBoard[x] = [];
        for (y = 0; y < board.height; y++) {
            oldBoard[x][y] = board.bots[x][y];
        }
    }
    for (x = 0; x < board.width; x++) {
        for (y = 0; y < board.height; y++) {
            numNieghbours = 0;
            for (xx = -1; xx < 2; xx++) {
                for (yy = -1; yy < 2; yy++) {
                    if(x + xx > 0 && x + xx < board.width && y + yy > 0 && y + yy < board.height && (xx != 0 || yy != 0)) {
                        if(oldBoard[x + xx][y + yy] != 0) {
                            numNieghbours++;
                        }
                    }
                }
            }
            if (oldBoard[x][y] == 0 && numNieghbours == 3) {
                board.bots[x][y] = 1;
            } else if (oldBoard[x][y] == 1 && (numNieghbours > 3 || numNieghbours < 2)) {
                board.bots[x][y] = 0;
            }
        }
    }
    drawBoard(board);
}

function page2canvas(x, y) {
    var canvas = document.getElementById("board"),
        canLeft = canvas.offsetLeft,
        canTop = canvas.offsetTop,
        context = canvas.getContext("2d"),
        trueX = event.pageX - canLeft,
        trueY = event.pageY - canTop,
        coords = {x: trueX, y:trueY};
    return coords;
}

function main() {
    var canvas = document.getElementById("board"),
        resetButton = document.getElementById("reset_button"),
        tickButton = document.getElementById("tick_button"),
        startButton = document.getElementById("start_button"),
        board = createBoard(50,100),
        down = false,
        paused = true;
    drawBoard(board);
    canvas.addEventListener("mousedown", function(event) {
        var coords = page2canvas(event.pageX, event.pageY);
        clickBoard(board, coords.x, coords.y);
        down = true;
    });
    
    canvas.addEventListener("mousemove", function(event) {
        if (down) {
            var coords = page2canvas(event.pageX, event.pageY);
            clickBoard(board, coords.x, coords.y);
        }
    });
    
    canvas.addEventListener("mouseup", function(event) {
        down = false;
    });
    
    resetButton.addEventListener("click", function(event) {
        board = createBoard(board.width, board.height);
        drawBoard(board);
    });
    
    tickButton.addEventListener("click", function(event) {
        tickBoard(board);
    });
    
    startButton.addEventListener("click", function(event) {
        paused = !paused;
        if (paused) {
            startButton.innerHTML = "start";
        } else {
            startButton.innerHTML = "pause";
        }
    });
    
    window.setInterval(function () {
        if (!paused) {
            tickBoard(board);
        }
    }, 100)
}