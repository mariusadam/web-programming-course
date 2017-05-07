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

/**
 *
 * @param {span} div
 * @param {string} imgUrl
 * @constructor
 */
function Tile(div, imgUrl) {
    this.div = div;
    this.imgUrl = imgUrl;
    this.piece = null;
}

Tile.PIECES_TILE_SHADDOW = 'inset 0 0 80px #222255';
Tile.CORRECT_TILE_SHADDOW = 'inset 0 0 80px #1d553f';
Tile.INCORRECT_TILE_SHADDOW = 'inset 0 0 80px #55070f';

/**
 * Draws the pices into current td element
 *
 * @param {Piece} piece
 */
Tile.prototype.draw = function (piece) {
    var tileCss;
    if (piece !== null || piece instanceof Piece) {
        tileCss = {
            background: this.imgUrl,
            backgroundPosition: piece.toBgPosition()
        };
    } else {
        tileCss = {
            background: '',
            backgroundPosition: ''
        };
    }
    $(this.div).css(tileCss);
    this.piece = piece;
};

/**
 * Removes focus from the current tile
 */
Tile.prototype.fade = function () {
    $(this.div).css({
        opacity: '',
        transform: ''
    });
};

/**
 * Selectes the current tile by applying some effects
 */
Tile.prototype.select = function () {
    $(this.div).css({
        opacity: '0.6',
        transform: 'scale(0.925)'
    });
};

Tile.prototype.setIsPiece = function () {
    $(this.div).css(
        'box-shadow', Tile.PIECES_TILE_SHADDOW
    );
};

Tile.prototype.setIsCorrect = function () {
    $(this.div).css(
        'box-shadow', Tile.CORRECT_TILE_SHADDOW
    );
};

Tile.prototype.setIsInCorrect = function () {
    $(this.div).css(
        'box-shadow', Tile.INCORRECT_TILE_SHADDOW
    );
};

/**
 *
 * @param {number} sx
 * @param {number} sy
 * @constructor
 */
function Piece(sx, sy) {
    var _sx = sx;
    var _sy = sy;

    this.getX = function () {
        return _sx;
    };

    this.getY = function () {
        return _sy;
    };
}

/**
 *
 * @returns {string}
 */
Piece.prototype.toBgPosition = function () {
    return -this.getX() + 'px ' + -this.getY() + 'px';
};

/**
 *
 * @param {Piece} other
 */
Piece.prototype.equals = function (other) {
    return other != undefined
        && other != null
        && this.getX() === other.getX()
        && this.getY() === other.getY();
};

/**
 *
 * @param {number} difficulty
 * @param {string} imagePath
 * @constructor
 */
function Puzzle(difficulty, imagePath) {
    /**
     *
     * @type {number}
     * @private
     */
    var _difficulty = difficulty;
    /**
     * @type {table}
     * @private
     */
    var _puzzleTable;
    /**
     * @type {table}
     * @private
     */
    var _piecesTable;
    /**
     * @type {Image}
     * @private
     */
    var _img;
    /**
     * @type {string}
     * @private
     */
    var _imgUrl;
    /**
     * @type {Piece[]}
     * @private
     */
    var _remainingPieces;
    /**
     * @type {Piece[]}
     * @private
     */
    var _selectedPieces;
    /**
     * @type {Piece[]}
     * @private
     */
    var _orderedPieces;
    /**
     * @type {Tile[]}
     * @private
     */
    var _puzzleTiles;
    /**
     * @type {Tile[]}
     * @private
     */
    var _piecesTiles;
    /**
     * @type {number}
     * @private
     */
    var _puzzleWidth;
    /**
     * @type {number}
     * @private
     */
    var _puzzleHeight;
    /**
     * @type {number}
     * @private
     */
    var _pieceWidth;
    /**
     * @type {number}
     * @private
     */
    var _pieceHeight;
    /**
     * @type {Tile}
     * @private
     */
    var _selectedTile;
    /**
     * @type {Tile}
     * @private
     */
    var _targetTile;
    /**
     * @type {boolean}
     * @private
     */
    var _shuffled;


    /**
     * Loads the image and adds and event listener to load
     */
    this.init = function () {
        _img = new Image();
        _img.addEventListener('load', onImage, false);
        _img.src = imagePath;
    };

    /**
     *
     * @param {Event} e
     */
    function onImage(e) {
        _pieceWidth = Math.floor(_img.width / _difficulty);
        _pieceHeight = Math.floor(_img.height / _difficulty);
        _puzzleWidth = _pieceWidth * _difficulty;
        _puzzleHeight = _pieceHeight * _difficulty;
        setTables();
        initPuzzle();
    }

    /**
     * Sets the puzzle and pieces tables
     */
    function setTables() {
        _puzzleTable = $('#puzzle-table').click(shufflePuzzle);
        _piecesTable = $('#pieces-table');
    }

    /**
     * Initializes all the internal variable that represent the puzzle state
     */
    function initPuzzle() {
        _remainingPieces = [];
        _selectedPieces = [];
        _orderedPieces = [];
        _selectedTile = null;
        _targetTile = null;
        _imgUrl = "url('" + imagePath + "')";
        _shuffled = false;
        _puzzleTiles = drawCells(_puzzleTable, onPuzzleClick);
        _piecesTiles = drawCells(_piecesTable, onPiecesClick);
        buildPieces();
        drawPieces(_orderedPieces, _puzzleTiles);
    }

    /**
     * Initializes the table with empty cells and
     * returns created tiles to the tiles array
     *
     * @param {table} tbl
     * @param divClickHandler The event handler on td click
     * @returns {Tile[]}
     */
    function drawCells(tbl, divClickHandler) {
        var tiles = [];
        var tbody = $(document.createElement('tbody'));
        $(tbl)
            .empty()
            .css({
                width: _puzzleWidth + 'px',
                height: _puzzleHeight + 'px',
                border: '1px solid black'
            })
            .attr('border', 1)
            .append(tbody);

        for (var i = 0; i < _difficulty; i++) {
            var tr = $(document.createElement('tr'));
            for (var j = 0; j < _difficulty; j++) {
                var innerDiv = $(document.createElement('div'))
                    .attr('draggable', true)
                    .css({
                        width: _pieceWidth + 'px',
                        height: _pieceHeight + 'px'
                    })
                    .click(divClickHandler);

                tiles.push(new Tile(innerDiv[0], _imgUrl));
                tr.append(
                    $(document.createElement('td'))
                        .attr('droppable', true)
                        .append(innerDiv)
                );
            }
            tbody.append(tr);
        }

        return tiles;
    }

    /**
     * Splits the image in multiple squares and stores the coordinates in
     * {Pieces} objects
     */
    function buildPieces() {
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (i = 0; i < _difficulty * _difficulty; i++) {
            piece = new Piece(xPos, yPos);
            _orderedPieces.push(piece);
            xPos += _pieceWidth;
            if (xPos >= _puzzleWidth) {
                xPos = 0;
                yPos += _pieceHeight;
            }
        }
    }

    /**
     * Draws the pieces into the given tiles
     * If the number of pieces is lower than the number of tiles
     * then the remaining tiles will be empty
     *
     * @param {Piece[]} pieces
     * @param {Tile[]} tiles
     */
    function drawPieces(pieces, tiles) {
        var i;
        for (i = 0; i < pieces.length; i++) {
            tiles[i].draw(pieces[i]);
        }

        while (i < tiles.length) {
            tiles[i].draw(null);
            i++;
        }
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function shufflePuzzle(e) {
        $(_puzzleTable).off('click');
        _remainingPieces = _orderedPieces.slice();
        shuffleArray(_remainingPieces);
        drawPieces([], _puzzleTiles);
        drawPieces(_remainingPieces, _piecesTiles);
        _piecesTiles.forEach(function (item, index) {
            item.setIsPiece();
        });
        _shuffled = true;
        e.stopPropagation();
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function onPiecesClick(e) {
        if (_selectedTile !== null) {
            _selectedTile.fade();
        }
        var currentTile = findTileByDiv(e.currentTarget, _piecesTiles);
        var previousTile = _selectedTile;
        _selectedTile = currentTile;

        if (_selectedTile !== null) {
            _selectedTile.select();

            if (previousTile === _selectedTile) {
                _selectedTile.fade();
                _selectedTile = null;
            }
        }
    }

    /**
     *
     * @param {td | EventTarget} clickedDiv
     * @param {Tile[]} tiles
     */
    function findTileByDiv(clickedDiv, tiles) {
        var tile = null;
        tiles.forEach(function (item, index) {
            if (item.div === clickedDiv) {
                tile = item;
            }
        });
        return tile;
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function onPuzzleClick(e) {
        var targetPiece;
        _targetTile = findTileByDiv(e.target, _puzzleTiles);

        if (_selectedTile === null || _selectedTile.piece === null) {
            targetPiece = _targetTile.piece;
            if (targetPiece !== null) {
                _remainingPieces.push(targetPiece);
                _selectedPieces.remove(targetPiece);
            }
            for (var i = 0; i < _piecesTiles.length; i++) {
                if (_piecesTiles[i].piece === null) {
                    _piecesTiles[i].draw(targetPiece);
                    break;
                }
            }
            _targetTile.draw(null);
            _targetTile.fade();
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

        _targetTile.draw(selectedPiece);
        _selectedTile.draw(targetPiece);
        _selectedTile.fade();
        _selectedTile = null;
        resetPuzzleAndCheckWin();
    }

    function resetPuzzleAndCheckWin() {
        var gameWin = true;
        var i;
        var piece;
        for (i = 0; i < _puzzleTiles.length; i++) {
            piece = _puzzleTiles[i].piece;
            if (!_orderedPieces[i].equals(piece)) {
                gameWin = false;
                _puzzleTiles[i].setIsInCorrect();
            } else {
                _puzzleTiles[i].setIsCorrect();
            }
        }
        if (gameWin) {
            setTimeout(gameOver, 500);
        }
    }

    function gameOver() {
        alert('Game over! Try again.');
        onImage(null);
    }
}

$(document).ready(
    function () {
        var puzzle = new Puzzle(3, 'img/mke2.png');
        puzzle.init();
    }
);
