angular.module('beamng.apps')
.directive('myApp', ['StreamsManager', 'bngApi', function (StreamsManager, bngApi) {
  return {
	templateUrl: '/ui/modules/apps/Jukebox/app.html',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {   
	  var bug = document.getElementById("bug");
      var audio = document.getElementById("audio");	
	  var info = document.getElementById("info");
      
	  scope.hello = function () {
		  
	  };
	  scope.select = function () {
		var bugs = document.getElementById("bug").value;
		var sel  = document.getElementById("file-input").value;
		var src = sel.replace("C:\\fakepath\\", "modules/apps/Jukebox/musik/").replace("undefined", "");

        
        audio.src=src;
		audio.play();

		info.setAttribute("style", "color:white");
		info.textContent="Jukebox Spielt";
	  };
	  scope.pause = function () {
		  info.setAttribute("style", "color:white");
		  info.textContent="Jukebox Pausiert";
	  };
	  scope.play = function () {
		  info.setAttribute("style", "color:white");
		  info.textContent="Jukebox Spielt"; 
	  };
	  scope.ende = function () {
		  info.setAttribute("style", "");
		  info.textContent="Jukebox"; 
	  }
      
      scope.$on('streamsUpdate', function (event, streams) {
        /* Some code that uses the streams' values */
        
        var src_split = audio.src.split("/");
        var song_name = src_split[src_split.length - 1];
        
        var data = {
            name: song_name,
            current_time: audio.currentTime,
            duration: audio.duration
        };
        
        var json_data = JSON.stringify(data);
        
        //Gets vehicle name
        bngApi.activeObjectLua("v.config.model", function(name) {
			//Send data to Lua beamNavigator
            bngApi.activeObjectLua(
            "controller.getController('" + name + "_navi').setSongData('" 
            + json_data + "')");
		});	
        
      });
    }
  };
}])