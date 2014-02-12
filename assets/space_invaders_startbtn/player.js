var _global = this;

(function () {

// class variables
    var idCounter = 0;
	
// constructor
    function Player (_x, _y, _imgSrc, _imgBlinkSrc)
    {
        this.id = idCounter; 
        this.x  = _x;
        this.y  = _y;
		this.imgSrc = _imgSrc;
		this.imgBlinkSrc = _imgBlinkSrc;
		this._blinking = false;
		this._blinkDelay = 500;
		this._currentBlink = 0;
		this._blinkAmount = 6;
		this._blinked = 0;
		this._frame = 1;
		
		this._width = 30;
		this._height = 16;
		this._speed = 5;
		this._lives = 2;
		this._score = 0;
    }
    
    _global.Player = Player;
    
// public

	Player.prototype.blink = function ()
	{
		this._blinking = true;
		this._blinked = 0;
		this._currentBlink = 0;
		this._frame = -this._frame;
	}

    Player.prototype.update = function (timeDelta)
    {
		this._time += timeDelta;
		
		if(this._blinking == true) {
			this._currentBlink+=timeDelta;
			if(this._currentBlink >= this._blinkDelay) {
				this._currentBlink = 0;
				this._blinked++;
				if(this._blinked == this._blinkAmount) {
					this._blinking = false;
					this._frame = 1; }
				else {
					this._frame = -this._frame; }
			}
		}
		
		if(gameStarted) {
			if (rightDown == true){
				if (this.x + (this._width + 6) <= fallCanvas.width){
					this.x += this._speed;
				}
			}
			
			if (leftDown == true){
				if (this.x - 6 >= 0){
					this.x -= this._speed;
				}
			}
		}
    };
    
})();