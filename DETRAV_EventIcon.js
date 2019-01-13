//=============================================================================
// Detrav Event Icons
// by Detrav (Witaly Ezepchuk / Vitaliy Ezepchuk)
// Date: 01/07/2019

//=============================================================================



/*:
 * @plugindesc Display icon for available event
 * @author Detrav        // your name goes here
 *
 * //@param xxxxx      //name of a parameter you want the user to edit
 * //@desc yyyyy       //short description of the parameter
 * //@default zzzzz    // set default value for the parameter
 
 * @help
 *   Detrav Event Icons
 * ----------------------------------------------------------------------------
 * This plugin will enable you to display an icon when the event is active
 *
 * For show the icon use comment with follow content
 * 
 *   <eventIcon: id>       // The code to use in a COMMENT within and event.
 *                          // id = the icon ID to use for the indicator.
 *
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS have not working yet
 * ----------------------------------------------------------------------------
 *
 *   D_AI_VISIBLE FALSE        // Hide event indicator
 *   D_AI_VISIBLE TRUE         // Show event indicator
 * 
 * by default  D_AI_VISIBLE is true
 *   
 */

// define my own global variable
var $Detrav = $Detrav || {};
$Detrav.eventIcon = $Detrav.eventIcon || {};
$Detrav.commands = $Detrav.eventIcon.commands || {};



(function () {


    if (!$Detrav.eventIcon.aliased) {
        var base_PluginCommand = Game_Interpreter.prototype.pluginCommand;

        // hate this system (c) Detrav
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            if ($Detrav.eventIcon.commands[command]) {
                $Detrav.eventIcon.commands[command](args);
                return;
            };
            base_PluginCommand.call(this, command, args);
        };
        $Detrav.eventIcon.aliased = true;
    };

    $Detrav.eventIcon.commands.D_AI_VISIBLE = function (arguments) {
        var status = eval(arguments[0].toLowerCase())
        // have to disable or eneble current eventIcon
    };

    // BEGIN Sprite_EventIcon

    function Sprite_EventIcon() {
        this.initialize.apply(this, arguments);
    }

    // make inheritace
    Sprite_EventIcon.prototype = Object.create(Sprite.prototype);
    Sprite_EventIcon.prototype.constructor = Sprite_EventIcon;

    // constructor
    Sprite_EventIcon.prototype.initialize = function (iconIndex) {
        Sprite.prototype.initialize.call(this);
        this._iconIndex = iconIndex;
        this._tileWidth = $gameMap.tileWidth();
        this._tileHeight = $gameMap.tileHeight();
        this._offsetX = -(Window_Base._iconWidth / 2);
        this.x = this._offsetX;
        this._offsetY = -$gameMap.tileHeight() + 10;
        this.anchor.y = 1;
        this._float = 0.1;
        this.mod = 0.2;
        this.changeBitmap();
    }

    // set icon number for this sprite
    Sprite_EventIcon.prototype.setEventIcon = function (eventIcon) {
        this._iconIndex = eventIcon;
        this.changeBitmap();
    }

    // get icon number for this sprite
    Sprite_EventIcon.prototype.getEventIcon = function (eventIcon) {
        return this._iconIndex;
    }

    // when bitmap is changes
    Sprite_EventIcon.prototype.changeBitmap = function () {

        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = this._iconIndex % 16 * pw;
        var sy = Math.floor(this._iconIndex / 16) * ph;

        this.bitmap = new Bitmap(pw, ph);
        if (this._iconIndex > 0) {
            var bitmap = ImageManager.loadSystem('IconSet');
            this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
        }
    };

    // update event for up down moving the event icon
    Sprite_EventIcon.prototype.update = function () {
        Sprite.prototype.update.call(this);

        if (this._iconIndex > 0) {

            
            this.y = this._offsetY + this._float;

            this.scale.y = Math.min(this.scale.y + 0.1, 1);

            this._float += this.mod;
            if (this._float < -0.1) {
                this.mod = Math.min(this.mod + 0.01, 0.2);
            } else if (this._float >= 0.1) {
                this.mod = Math.max(this.mod + -0.01, -0.2);
            };
        }
    };

    // END Sprite_EventIcon

    // BEGIN Sprite_Character with event icon

    // override set character for sprite character
    var base_Sprite_Character_SetCharacter = Sprite_Character.prototype.setCharacter;


    Sprite_Character.prototype.setCharacter = function (character) {
        base_Sprite_Character_SetCharacter.call(this, character);
        if (character.getEventIcon) {
            var eventIcon = character.getEventIcon();
            if (!this.eventIcon) {
                this.eventIcon = new Sprite_EventIcon();
                this.addChild(this.eventIcon);
            }
            if (eventIcon > 0)
                this.eventIcon.setEventIcon(eventIcon);
        }
        else {
            if (this.eventIcon) {
                this.removeChild(this.eventIcon);
                this.eventIcon = null;
            }
        }
    };

    // override update method for sprite character
    var base_Sprite_Character_Update = Sprite_Character.prototype.update;

    Sprite_Character.prototype.update = function () {
        base_Sprite_Character_Update.call(this);
        //begin Sprite_EventIcon
        if (this.eventIcon && this._character.getEventIcon) {
            if (this.eventIcon.getEventIcon() != this._character.getEventIcon())
            {
                this.eventIcon.setEventIcon(this._character.getEventIcon());
            }
        }
        //end Sprite_EventIcon
    }

    // END Sprite_Character with event icon

    // BEGIN Game_Event with event icon

    // override clear page for game_event
    var base_Game_Event_ClearPageSettings = Game_Event.prototype.clearPageSettings;
    Game_Event.prototype.clearPageSettings = function () {
        base_Game_Event_ClearPageSettings.call(this);
        this._eventIcon = 0;
    };

    // override setup page for game_event
    var base_Game_Event_SetupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function () {
        base_Game_Event_SetupPageSettings.call(this);
        var page = this.page();
        var listCount = page.list.length;
        this._eventIcon = 0;
        for (var i = 0; i < listCount; i++) {
            if (page.list[i].code === 108) {
                var iconCheck = page.list[i].parameters[0].match(/<eventIcon: (.*)>/i);
                if (iconCheck) {
                    this._eventIcon = Number(iconCheck[1]);
                    break;
                };
            };
        }
    };

    // add new method for game event, that returns event icon
    Game_Event.prototype.getEventIcon = function () {
        return this._eventIcon;
    }
    // END Game_Event with event icon

})(); 
