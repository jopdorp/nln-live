var _global = this;
var updateLogic = false;
var direction = 1;
var enemyMoveSpeed = 5;
var enemyYChange = 0;


(function () {

// class variables
    var idCounter = 0;
	
// constructor
    function Enemy (_x, _y, _imgSrc, _imgSrcA, _imgSrcW)
    {
        this.id = idCounter++;
        this.x  = _x;
        this.y  = _y;
        this._time  = 0;
		
		this.imgSrc = _imgSrc;
		this.imgSrcA = _imgSrcA;
		this.imgSrcW = _imgSrcW;
		this.frame = 1;
		this.gameStarted = false;
		
		this.delay = 720;
		this._blinkTime = 500;
		this._currentBlink = 0;
		this._blinking = false;
		this._width = 20;
		this._height = 16;
		this._moveSpeed = 6;
		this._fire = false;
    }
    
    _global.Enemy = Enemy;
	
	Enemy.prototype.blink = function ()
	{
		this._blinking = true;
		this._currentBlink = 0;
	}
    
// public

    Enemy.prototype.update = function (timeDelta)
    {
		this._time += timeDelta;
		
		if(this._blinking == true) {
			this._currentBlink+=timeDelta;
			if(this._currentBlink >= this._blinkTime) {
				this._blinking = false;
				removeEnemy(this); } }
		
		if (this._time >= this.delay){
			if(gameStarted) {
				// Randomly shoot, based on delay so the the faster they get the more they fire.
				var fireTest = Math.floor(Math.random() * this.delay * 0.85);

				if (fireTest < (this.delay / 100)){
					this._fire = true;
				}
			}
			
			if (this.x + (this._width + 6) >= fallCanvas.width && direction == 1){
				updateLogic = true;
			}
			else if(this.x - 6 <= 0 && direction != 1){
				updateLogic = true;
			}
			
			this.frame = -this.frame;
			this.x += enemyMoveSpeed;
			this._time = 0;
		}
        
		this.y += enemyYChange;
    };
    
})();