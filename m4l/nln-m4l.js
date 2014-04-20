inlets = 3;
outlets = 2;

var live_set_api;
var instruments = {};
var performances = [];
var performance_instruments = [];
var working_id = 0;

var instrument = function(t){
	var self = this;
	this.index;
	this.name;
	this.callback;
	this.playing;
	this.fired;
	this.clips = 0;
		
	if(live_set_api){
		live_set_api.call("create_midi_track", -1);
		this.index = (live_set_api.get("tracks").length / 2 - 1);
		this.name = t;
		
		var api = 	new LiveAPI(function(){
						this.set("name", t);
					}, "live_set tracks " + this.index);
					
					
		this.callback = function(args){
			if(args[0] != "id" && args[1] >= 0){
				args[0] == "fired_slot_index" ? args[0] = "fired" : args[0] = "played";
				send_msg(args[0], self.name, args[1]);
			}
		}
		
		this.playing = new LiveAPI(this.callback, "live_set tracks " + this.index);
		this.playing.property = "playing_slot_index";
		
		this.fired = new LiveAPI(this.callback, "live_set tracks " + this.index);
		this.fired.property = "fired_slot_index";
	}
	
	this.create_clip = function(){
		
		var clip_slot_api = new LiveAPI(null, "live_set tracks " + this.index + " clip_slots " + this.clips);
		clip_slot_api.call("create_clip", 1);
		
		var clip_api = new LiveAPI(null, "live_set tracks " + this.index + " clip_slots " + this.clips + " clip");
		clip_api.set("looping", 0);
		
		this.clips++;
	}
}	
	
function send_msg(){
	var msg = {
		action: arguments[0],
		trackName: arguments[1],
		index: arguments[2],
		messageId: Math.random()
	}
	
	outlet(0,
		"/" + msg.action,
		"{\"trackName\":\""+msg.trackName+
		"\",\"index\":"+msg.index+
		",\"messageId\":"+msg.messageId+
		",\"performanceId\":\""+ working_id +
		"\"}"
	);
}

function anything(){
	if(inlet == 1){
		if(messagename == "/performances"){
			performances = JSON.parse(arguments[0]);
			outlet(1, "clear");
			for(var i = 0; i < performances.length; i++){
				outlet(1, ["append", performances[i].title]);
			}
		}
		else if(messagename == "/instruments"){
			var i = JSON.parse(arguments[0]);
			
			for(var n in i){
				performance_instruments.push([n, i[n]]);
			}
			
			create_live_set();
		}
	}
}

function msg_int(n){
	if(inlet == 2 && performances[n]){
		clear_live_set(
			function(){
				outlet(0, ["/getInstruments", "{\"pieceId\":\""+performances[n].piece+"\"}"]);
				working_id = performances[n].id;
			}
		);
	}
}

function create_live_set(){	
	var tsk = new Task(
		function(){
			
			var track_name;
			
			// if there is something to create
			if(performance_instruments[0]){
				track_name = performance_instruments[0][0];
			}
			else{
				tsk.cancel();
				live_set_api.call("delete_track", 0);
				return;
			}
			
			// check if track exists; if not, create new track
			if(!instruments[track_name]){
				post(track_name);
				instruments[track_name] = new instrument(track_name);
			}
			// if it does, create clips;
			else if(live_set_api.get("scenes").length / 2 < performance_instruments[0][1]){
				live_set_api.call("create_scene", -1);
			}
			else if(performance_instruments[0][1]){
				instruments[track_name].create_clip();
				performance_instruments[0][1]--;
			}
			else{
				performance_instruments.shift();
			}
			
		}, this);
		
	tsk.interval = 20;
	tsk.repeat();
}

function clear_live_set(callback){
	var tsk = new Task(
		function(){
			if(live_set_api.get("tracks").length > 2){
				live_set_api.call("delete_track", 0);
			}
			else if(live_set_api.get("scenes").length > 2){
				live_set_api.call("delete_scene", 0);
			}
			else{
				var track = new LiveAPI(null, "live_set tracks 0");
				track.set("name", "Empty");

				var scene = new LiveAPI(null, "live_set scenes 0");
				scene.set("name", "0");
				
				var clip = new LiveAPI(null, "live_set tracks 0 clip_slots 0");
				if(clip.get("clip")[1]){
					clip.call("delete_clip");
				}
				
				instruments = {};
				
				tsk.cancel();
				
				if(callback){
					callback();
				}
				
			}
		}, this);
	tsk.interval = 100;
	tsk.repeat();
}

function init(){
	if(!live_set_api){
		live_set_api = 	new LiveAPI(null, "live_set");
	}
	clear_live_set();
}

function reset(){
	performance_instruments.length = 0;
	instruments = {};
}