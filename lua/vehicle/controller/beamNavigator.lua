-- This Source Code Form is subject to the terms of the bCDDL, v. 1.1.
-- If a copy of the bCDDL was not distributed with this
-- file, You can obtain one at http://beamng.com/bCDDL-1.1.txt

local M = {}
M.type = "auxiliary"
M.relevantDevice = nil

local htmlTexture = require("htmlTexture")

local screenMaterialName = nil
local htmlFilePath = nil
local textureWidth = 0
local textureHeight = 0
local textureFPS = 0
local updateTimer = 0
local updateFPS = 30
local invFPS = 1 / updateFPS
local gpsData = {x = 0, y = 0, rotation = 0, zoom = 1}
local songData = {name = "test", current_time = 0, duration = 1, paused = true}
local ytpinstalled = false

local function file_exists(name)
  local f=io.open(name,"r")
  if f~=nil then io.close(f) return true else return false end
end

local function init(jbeamData)
  --ytpinstalled = file_exists("local://local/modules/apps/Video/luft.html")
  --console.log("YouTube Player installed: " + ytpinstalled)
  -- if(ytpinstalled) {
  --  screenMaterialName = jbeamData.screenMaterialName or "@screen_gps"
  --  htmlFilePath = jbeamData.htmlFilePath or "local://local/vehicles/vivace/default_navi_screen.html"
  -- textureWidth = jbeamData.textureWidth or 256
  --  textureHeight = jbeamData.textureHeight or 128
  --  textureFPS = jbeamData.textureFPS or 30
  
  --  htmlTexture.create(screenMaterialName, htmlFilePath, textureWidth, textureHeight, textureFPS, "automatic")
  --  obj:queueGameEngineLua(string.format("extensions.ui_uinavi.requestVehicleDashboardMap(%q)", screenMaterialName))
  --}else{
  screenMaterialName = jbeamData.screenMaterialName or "@screen_gps"
  htmlFilePath = jbeamData.htmlFilePath or "local://local/vehicles/common/navi_screen.html"
  textureWidth = jbeamData.textureWidth or 256
  textureHeight = jbeamData.textureHeight or 128
  textureFPS = jbeamData.textureFPS or 30

  htmlTexture.create(screenMaterialName, htmlFilePath, textureWidth, textureHeight, textureFPS, "automatic")
  obj:queueGameEngineLua(string.format("extensions.ui_uinavi.requestVehicleDashboardMap(%q)", screenMaterialName))
  --}
end

local function setSongData(data)
    songData = jsonDecode(data)
end

local function toggleMusicPlayerUI()
    htmlTexture.call(screenMaterialName, "music_player.toggleMusicPlayerUI")
end

local function updateGFX(dt)
  updateTimer = updateTimer + dt
  if updateTimer > invFPS and playerInfo.anyPlayerSeated then
    updateTimer = 0
    local pos = obj:getPosition()
    local rotation = math.deg(obj:getDirection()) + 180
    local speed = electrics.values.airspeed * 3.6
    local zoom = math.min(150 + speed * 1.5, 250)

    gpsData.x = pos.x
    gpsData.y = pos.y
    gpsData.rotation = rotation
    gpsData.zoom = zoom
    htmlTexture.call(screenMaterialName, "map.updateData", gpsData)
    htmlTexture.call(screenMaterialName, "music_player.updateSongData", songData)
  end
end

M.init = init
M.setSongData = setSongData
M.toggleMusicPlayerUI = toggleMusicPlayerUI
M.reset = nop -- this is needed so that we do not call init when reseting
M.updateGFX = updateGFX

return M
