//=============================================================================
// Detrav Action Icons
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
 *   Detrav Action Icons
 * ----------------------------------------------------------------------------
 * This plugin will enable you to display an icon when the event is active
 *
 * For show the icon use comment with follow content
 * 
 *   <actionIcon: id>       // The code to use in a COMMENT within and event.
 *                          // id = the icon ID to use for the indicator.
 *
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS have not working yet
 * ----------------------------------------------------------------------------
 *
 *   D_AI_VISIBLE FALSE        // Hide action indicator
 *   D_AI_VISIBLE TRUE         // Show action indicator
 * 
 * by default  D_AI_VISIBLE is true
 *   
 */

// define my own global variable
var $Detrav = $Detrav || {};
$Detrav.actionIcon = $Detrav.actionIcon || {};
$Detrav.commands = $Detrav.actionIcon.commands || {};



(function () {


    if (!$Detrav.actionIcon.aliased) {
        var base_PluginCommand = Game_Interpreter.prototype.pluginCommand;

        // hate this system (c) Detrav
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            if ($Detrav.actionIcon.commands[command]) {
                $Detrav.actionIcon.commands[command](args);
                return;
            };
            base_PluginCommand.call(this, command, args);
        };
        $Detrav.actionIcon.aliased = true;
    };

    $Detrav.actionIcon.commands.D_AI_VISIBLE = function (arguments) {
        var status = eval(arguments[0].toLowerCase())
        // have to disable or eneble current actionIcon
    };

    // BEGIN Sprite_ActionIcon

    function Sprite_ActionIcon() {
        this.initialize.apply(this, arguments);
    }

    // make inheritace
    Sprite_ActionIcon.prototype = Object.create(Sprite.prototype);
    Sprite_ActionIcon.prototype.constructor = Sprite_ActionIcon;

    // constructor
    Sprite_ActionIcon.prototype.initialize = function (iconIndex) {
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
    Sprite_ActionIcon.prototype.setActionIcon = function (actionIcon) {
        this._iconIndex = actionIcon;
        this.changeBitmap();
    }

    // get icon number for this sprite
    Sprite_ActionIcon.prototype.getActionIcon = function (actionIcon) {
        return this._iconIndex;
    }

    // when bitmap is changes
    Sprite_ActionIcon.prototype.changeBitmap = function () {

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

    // update event for up down moving the action icon
    Sprite_ActionIcon.prototype.update = function () {
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

    // END Sprite_ActionIcon

    // BEGIN Sprite_Character with action icon

    // override set character for sprite character
    var base_Sprite_Character_SetCharacter = Sprite_Character.prototype.setCharacter;


    Sprite_Character.prototype.setCharacter = function (character) {
        base_Sprite_Character_SetCharacter.call(this, character);
        if (character.getActionIcon) {
            var actionIcon = character.getActionIcon();
            if (!this.actionIcon) {
                this.actionIcon = new Sprite_ActionIcon();
                this.addChild(this.actionIcon);
            }
            if (actionIcon > 0)
                this.actionIcon.setActionIcon(actionIcon);
        }
        else {
            if (this.actionIcon) {
                this.removeChild(this.actionIcon);
                this.actionIcon = null;
            }
        }
    };

    // override update method for sprite character
    var base_Sprite_Character_Update = Sprite_Character.prototype.update;

    Sprite_Character.prototype.update = function () {
        base_Sprite_Character_Update.call(this);
        //begin Sprite_ActionIcon
        if (this.actionIcon && this._character.getActionIcon) {
            if (this.actionIcon.getActionIcon() != this._character.getActionIcon())
            {
                this.actionIcon.setActionIcon(this._character.getActionIcon());
            }
        }
        //end Sprite_ActionIcon
    }

    // END Sprite_Character with action icon

    // BEGIN Game_Event with action icon

    // override clear page for game_event
    var base_Game_Event_ClearPageSettings = Game_Event.prototype.clearPageSettings;
    Game_Event.prototype.clearPageSettings = function () {
        base_Game_Event_ClearPageSettings.call(this);
        this._actionIcon = 0;
    };

    // override setup page for game_event
    var base_Game_Event_SetupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function () {
        base_Game_Event_SetupPageSettings.call(this);
        var page = this.page();
        var listCount = page.list.length;
        this._actionIcon = 0;
        for (var i = 0; i < listCount; i++) {
            if (page.list[i].code === 108) {
                var iconCheck = page.list[i].parameters[0].match(/<actionIcon: (.*)>/i);
                if (iconCheck) {
                    this._actionIcon = Number(iconCheck[1]);
                    break;
                };
            };
        }
    };

    // add new method for game event, that returns action icon
    Game_Event.prototype.getActionIcon = function () {
        return this._actionIcon;
    }
    // END Game_Event with action icon

})(); 
