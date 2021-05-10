angular.module('beamng.apps')
.directive('myApp', ['StreamsManager', function (StreamsManager) {
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
    }
  };
}])