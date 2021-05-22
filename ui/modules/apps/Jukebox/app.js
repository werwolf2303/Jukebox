angular.module('beamng.apps')
.directive('myApp', ['StreamsManager', 'bngApi', function (StreamsManager, bngApi) {
    return {
        templateUrl: '/ui/modules/apps/Jukebox/app.html',
        replace: true,
        restrict: 'EA',
        link: function (scope, element, attrs) {   
            var bug = document.getElementById("bug");
            var audio = document.getElementById("audio");	
            var playlist_container = document.getElementById("playlist-container");
            
            var music_folder_dir = "mods/unpacked/BeamNG-Jukebox/ui/modules/apps/Jukebox/musik/";

            var song_button_selected = null;
            
            scope.hello = function () {
                
            };
            scope.openMusicFolder = function () {   
                bngApi.engineLua('Engine.Platform.exploreFolder("' + music_folder_dir + '")');
                
            };
            function playSong(clicked_song_button) {
                var playlist = playlist_container.childNodes;
                
                playlist.forEach(function (song_button, index) {
                    song_button.style.backgroundColor = "white";  
                });
            
                clicked_song_button.style.backgroundColor = "lightgray";
            
                song_button_selected = clicked_song_button;
            
                audio.src = clicked_song_button.song_dir;
                audio.load();
                audio.play();
            }
            
            function songButtonClicked(evt) {  
                playSong(evt.currentTarget);
            }
            
            scope.updatePlaylist = function () {
                bngApi.engineLua('jsonEncode(FS:findFiles("' + music_folder_dir + '", "*", 0, false, true))', function(data) {
                    var playlist_parsed = JSON.parse(data);
                    var new_playlist = [];

                    while (playlist_container.firstChild) {
                        playlist_container.removeChild(playlist_container.firstChild);
                    }
                    
                    for (var id = 0; id < playlist_parsed.length; id++) {
                        var song_data = playlist_parsed[id];
                        
                        var song_path = song_data.replace("/mods/unpacked/BeamNG-Jukebox/ui/", "");
                        var path_split = song_path.split("/");
                        var song_name = path_split[path_split.length - 1];
                        
                        new_playlist[song_name] = {
                            song_dir: song_path
                        };  
                        
                        var song_button = document.createElement("button");
                        song_button.className = "music-button";
                        song_button.textContent = song_name;
                        song_button.button_id = id;
                        song_button.song_dir = song_path;
                        
                        song_button.addEventListener("click", songButtonClicked, false);
                        
                        playlist_container.appendChild(song_button);                  
                    }
                    
                    song_button_selected = playlist_container.firstChild;
                    
                    if (song_button_selected !== null) {
                        song_button_selected.style.backgroundColor = "lightgray";
                
                        audio.src = song_button_selected.song_dir;    
                        audio.load();
                    }
                });
            }
            scope.pause = function () {
            };
            scope.play = function () {
            };
            scope.ende = function () {
                var next_song_button = song_button_selected.nextSibling;
                
                if (next_song_button !== null) {
                    playSong(next_song_button);
                }
                else{
                    //Go back to first song if end of playlist
                    
                    playSong(playlist_container.firstElementChild);
                }
            };
            
            scope.$on('streamsUpdate', function (event, streams) {
                /* Some code that uses the streams' values */
                //console.log(audio.src);
                var src_split = audio.src.split("/");
                var song_name = decodeURI(src_split[src_split.length - 1]);

                var data = {
                    name: song_name,
                    current_time: audio.currentTime,
                    duration: audio.duration,
                    paused: audio.paused
                };
                
                var json_data = JSON.stringify(data);
                
                //Send data to Lua beamNavigator controller
                bngApi.activeObjectLua(
                "for _, beamNav in pairs(controller.getControllersByType('beamNavigator')) do beamNav.setSongData('" + json_data + "') end"
                );
            });
            
            //Init
            scope.updatePlaylist();  
        }
    };
}])            