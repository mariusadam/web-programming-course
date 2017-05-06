Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function shuffleArray(o) {
    for (var j, x, i = o.length - 1; i; i--) {
        j = parseInt(Math.random() * i);
        x = o[i];
        o[i] = o[j];
        o[j] = x;
    }
    return o;
}

function Puzzle(dif) {
    var _difficulty = dif;
    var _puzzleTable;
    var _piecesTable;
    var _img;
    var _imgUrl;
    var _remainingPieces;
    var _selectedPieces;
    var _correctPieces;
    var _puzzleTiles;
    var _piecesTiles;
    var _puzzleWidth;
    var _puzzleHeight;
    var _pieceWidth;
    var _pieceHeight;
    var _selectedTile;
    var _targetTile;
    var _shuffled;

    this.init = function (){
        _img = new Image();
        _img.addEventListener('load', onImage, false);
        _img.src = "img/mke2.png";
    };

    function onImage(e) {
        _pieceWidth = Math.floor(_img.width / _difficulty);
        _pieceHeight = Math.floor(_img.height / _difficulty);
        _puzzleWidth = _pieceWidth * _difficulty;
        _puzzleHeight = _pieceHeight * _difficulty;
        setTables();
        initPuzzle();
    }

    function setTables() {
        _puzzleTable = document.getElementById('puzzle-table');
        _puzzleTable.style.width = _puzzleWidth + 'px';
        _puzzleTable.style.height = _puzzleHeight + 'px';
        _puzzleTable.style.border = "1px solid black";

        _piecesTable = document.getElementById('pieces-table');
        _piecesTable.style.width = _puzzleWidth + 'px';
        _piecesTable.style.height = _puzzleHeight + 'px';
        _piecesTable.style.border = "1px solid black";
    }

    function drawPieces(pieces, tiles) {
        var i;
        for (i = 0; i < pieces.length; i++) {
            var td = tiles[i];
            var piece = pieces[i];
            drawPiece(td, piece);
        }

        while (i < tiles.length) {
            tiles[i].style.background = null;
            tiles[i].piece = null;
            i++;
        }
    }

    function drawPiece(tile, piece) {
        if (piece !== null) {
            tile.style.background = _imgUrl;
            tile.style.backgroundPosition = -piece.sx + 'px ' + -piece.sy + 'px';
        } else {
            tile.style.background = null;
            tile.style.backgroundPosition = null;
        }
        tile.piece = piece;
    }

    function initPuzzle() {
        _remainingPieces = [];
        _selectedPieces = [];
        _correctPieces = [];
        _puzzleTiles = [];
        _piecesTiles = [];
        _selectedTile = null;
        _targetTile = null;
        _imgUrl = "url('img/mke2.png')";
        _shuffled = false;
        drawCells(_puzzleTable, onPuzzleClick, _puzzleTiles);
        drawCells(_piecesTable, onPiecesClick, _piecesTiles);
        buildPieces();
        drawPieces(_remainingPieces, _puzzleTiles);
    }

    function drawCells(tbl, tdEvent, tiles) {
        eraseTable(tbl);
        tbl.style.width = _puzzleWidth;
        tbl.style.height = _puzzleHeight;
        tbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');
        for (var i = 0; i < _difficulty; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < _difficulty; j++) {
                var td = document.createElement('td');
                td.style.width = _pieceWidth + 'px';
                td.style.height = _pieceHeight + 'px';
                // td.onmousedown = tdEvent;
                tiles.push(td);
                tr.appendChild(td)
            }
            tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
    }

    function buildPieces() {
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (i = 0; i < _difficulty * _difficulty; i++) {
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            _correctPieces[i] = piece;
            _remainingPieces.push(piece);
            xPos += _pieceWidth;
            if (xPos >= _puzzleWidth) {
                xPos = 0;
                yPos += _pieceHeight;
            }
        }
        _puzzleTable.onmousedown = shufflePuzzle;
    }

    function eraseTable(tbl) {
        var tb = tbl.getElementsByTagName("tbody");
        if (tb.length > 0) {
            tbl.removeChild(tb[0]);
        }
    }

    function shufflePuzzle() {
        if (_shuffled) {
            _puzzleTable.onmousedown = null;
            return;
        }
        shuffleArray(_remainingPieces);
        drawPieces([], _puzzleTiles);
        drawPieces(_remainingPieces, _piecesTiles);
        _shuffled = true;
    }

    function onPiecesClick(e) {
        if (_selectedTile !== null) {
            _selectedTile.style.opacity = null;
            _selectedTile.style.transform = null;
        }
        // toggle effect
        if (_selectedTile === e.currentTarget) {
            _selectedTile = null;
            return;
        }

        _selectedTile = e.currentTarget;
        if (_selectedTile !== null) {
            _selectedTile.style.opacity = 0.6;
            _selectedTile.style.transform = 'scale(1.025 )';
        }
    }

    function onPuzzleClick(e) {
        var targetPiece;
        _targetTile = e.currentTarget;

        if (_selectedTile === null || _selectedTile.piece === null) {
            if (_shuffled) {
                targetPiece = _targetTile.piece;
                if (targetPiece !== null) {
                    _remainingPieces.push(targetPiece);
                    _selectedPieces.remove(targetPiece);
                }
                for (var i = 0; i < _piecesTiles.length; i++) {
                    if (_piecesTiles[i].piece === null) {
                        drawPiece(_piecesTiles[i], targetPiece);
                        break;
                    }
                }
                _targetTile.style.transform = null;
                _targetTile.style.opacity = null;
                drawPiece(_targetTile, null);
            }
            return;
        }
        targetPiece = _targetTile.piece;

        if (targetPiece !== null) {
            _remainingPieces.push(targetPiece);
            _selectedPieces.remove(targetPiece);
        }

        var selectedPiece = _selectedTile.piece;
        _remainingPieces.remove(selectedPiece);
        _selectedPieces.push(selectedPiece);

        drawPiece(_targetTile, selectedPiece);
        drawPiece(_selectedTile, targetPiece);
        _selectedTile.style.transform = null;
        _selectedTile.style.opacity = null;
        _selectedTile = null;
        resetPuzzleAndCheckWin();
    }

    function resetPuzzleAndCheckWin() {
        var gameWin = true;
        var i;
        var piece;
        for (i = 0; i < _puzzleTiles.length; i++) {
            piece = _puzzleTiles[i].piece;
            if (piece === null || piece !== _correctPieces[i]) {
                gameWin = false;
            }
        }
        if (gameWin) {
            setTimeout(gameOver, 500);
        }
    }

    function gameOver() {
        alert('Game over! Try again.');
        initPuzzle();
    }
}

$(document).ready(
    function() {
        var puzzle = new Puzzle(3);
        puzzle.init();

        $("#pieces-table").on("drsag", "td", function(e) {

        });

    }
);
