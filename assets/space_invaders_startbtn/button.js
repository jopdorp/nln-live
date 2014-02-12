var _global = this;

(function () {

// class variables
    var idCounter = 0;
	
// constructor
    function StartButton (_x, _y, _sizeX, _sizeY, _imgSrc)
    {
        this.id = idCounter++; 
        this.x  = _x;
        this.y  = _y;
		this.imgSrc = _imgSrc;
		
		this._width = _sizeX;
		this._height = _sizeY;
    }
	
	_global.StartButton = StartButton;
})();