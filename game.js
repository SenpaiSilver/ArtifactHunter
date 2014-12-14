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
	this.Map;
	
	this.Reset = function(pts = 0) {
		var artifact_pos = {
			x: Math.floor((new Date().getTime() + Math.random() * 1000) % this.Bounds.x),
			y: Math.floor((new Date().getTime() - Math.random() * 1000) % this.Bounds.y)
		}
		console.log(artifact_pos);
		this.Map = {};
		this.Points = pts;
		
		$("#points").text(this.Points);
		$("#gameWindow").html("");
		for (var y = 0; y < this.Bounds.y; ++y) {
			var anomalies = 0;
			for (var x = 0; x < this.Bounds.x; ++x) {
				var fieldid = 'field-' + x + '-' + y
				
				$("#gameWindow").append('<div class="field" id="' + fieldid + '">?</div>');
				if (y == artifact_pos.y && x == artifact_pos.x)
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
				if (this.Map['field-' + x + '-' + y][1] == this.Items["Anomaly"][1])
					anomalies++;
			$("#gameWindow").append('<div class="field-info" id="field-info-x-' + x + '">' + anomalies + '</div>');
		}
		$("#gameWindow").append('<hr />');
	}
	
	this.Nothing = function(id) {
	console.log(id);
		$("#" + id).text("OK");
		$("#" + id).unbind("click");
		$("#points").text(Game.Points += 10);
	}
	this.NextLevel = function(id) {
		$("#points").text(Game.Points += 100);
		alert("You stumbled upon the artifact!");
		this.Reset(this.Points);
	}
	
	this.Lose = function(id) {
		//$("#"+id).text("X");
		alert("You lose.");
		this.Reset();
	}
	
	this.Reset();
}