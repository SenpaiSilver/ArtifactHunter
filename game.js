function Game() {
	var Game = this;
	this.Bounds = {x: 5, y: 5};
	this.Items = {
		"Unset": [0, -1, function(id) {}],
		"Anomaly": [0, 0, function(id) {Game.Lose(id.data);}],
		"Nothing": [25, 1, function(id) {Game.Nothing(id.data);}],
		"Artifact": [0, 2, function(id) {Game.NextLevel(id.data);}]
	};
	this.Points;
	this.Level;
	this.Map;
	
	this.Reset = function(pts) {
		var artifact_pos = {
			x: Math.floor((new Date().getTime() + Math.random() * 1000) % this.Bounds.x),
			y: Math.floor((new Date().getTime() - Math.random() * 1000) % this.Bounds.y)
		}
		this.Map = {};
		this.Points = (typeof(pts) !== 'undefined' ? pts : 0);
		this.Level = (typeof(pts) !== 'undefined' ? this.Level + 1 : 1);
		
		$(".popup").hide();
		$("#points").text("[Level " + this.Level + "] " + this.Points + "pts");
		$("#gameWindow").html("");
		for (var y = 0; y < this.Bounds.y; ++y) {
			var anomalies = 0;
			for (var x = 0; x < this.Bounds.x; ++x) {
				var fieldid = 'field-' + x + '-' + y
				
				$("#gameWindow").append('<div class="field" id="' + fieldid + '">?</div>');
				if (y === artifact_pos.y && x === artifact_pos.x)
				{
					this.Map[fieldid] = this.Items["Artifact"];
					$("#"+fieldid).click(fieldid, this.Items["Artifact"][2]);
				}
				else if (Math.floor((new Date().getTime() + Math.random() * 1000) % 10) > 5)
				{
					this.Map[fieldid] = this.Items["Anomaly"];
					$("#"+fieldid).click(fieldid, this.Items["Anomaly"][2]);
					anomalies += 1;
				}
				else
				{
					this.Map[fieldid] = this.Items["Nothing"];
					$("#"+fieldid).click(fieldid, this.Items["Nothing"][2]);
				}
			}
			$("#gameWindow").append('<div class="field-info" id="field-info-y-' + y + '">' + anomalies + '</div><hr />');
		}
		for (var x = 0; x < this.Bounds.x; ++x) {
			var anomalies = 0;
			for (var y = 0; y < this.Bounds.y; ++y)
				if (this.Map['field-' + x + '-' + y][1] === this.Items["Anomaly"][1])
					anomalies++;
			$("#gameWindow").append('<div class="field-info" id="field-info-x-' + x + '">' + anomalies + '</div>');
		}
		$("#gameWindow").append('<div class="field-info" id="field-reset">R</div>');
		$("#gameWindow").append('<hr />');
		$("#field-reset").click(function() {Game.Reset()});
	}
	
	this.Nothing = function(id) {
		$("#" + id).text("OK");
		$("#" + id).css({background: "#00FF00"});
		$("#" + id).unbind("click");
		$("#points").text("Level [" + this.Level + "] " + (this.Points += 10) + "pts");
	}
	this.NextLevel = function(id) {
		$("#" + id).text("@");
		$("#" + id).css({background: "#0000FF"});
		$("#points").text("Level " + this.Level + " " + (this.Points += 100) + "pts");
		for (var y = 0; y < this.Bounds.y; ++y)
			for (var x = 0; x < this.Bounds.y; ++x) {
				var fieldid = 'field-' + x + '-' + y
				$("#" + fieldid).unbind("click");
				if (fieldid != id)
					$("#" + fieldid).css({background: "#C0C0C0"});
			}
		window.setTimeout(function() {Game.Reset(Game.Points);}, 1000);
	}
	
	this.Lose = function(id) {
		$("#" + id).text("X");
		$("#" + id).css({background: "#FF0000"});
		for (var y = 0; y < this.Bounds.y; ++y)
			for (var x = 0; x < this.Bounds.y; ++x) {
				var fieldid = 'field-' + x + '-' + y
				$("#" + fieldid).unbind("click");
				if (fieldid != id)
					$("#" + fieldid).css({background: "#C0C0C0"});
			}
		$("#sharing").append('<a href="https://twitter.com/intent/tweet?button_hashtag=ArtifactHunt&text=I%20have%20scored%20{:points:}pts%20at%20%23ArtifactHunt%20(http%3A%2F%2Fartifacthunter.senpaisilver.com%2F)" class="twitter-hashtag-button" data-related="SenpaiSilver" data-url="http://artifacthunter.senpaisilver.com/">Twitter</a>'.replace('{:points:}', this.Points));
	}
	
	this.Reset();
	$(document).keydown(function(e) {
		if (e.key == 'r')
			Game.Reset();
	});
}