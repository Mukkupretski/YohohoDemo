"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwordPos = exports.getSkinPos = exports.Swords = exports.Skins = void 0;
var Skins;
(function (Skins) {
    Skins[Skins["AMOGUS"] = 0] = "AMOGUS";
    Skins[Skins["NORMAL"] = 1] = "NORMAL";
    Skins[Skins["PYTHAGORAS"] = 2] = "PYTHAGORAS";
    Skins[Skins["PROCHARACTER"] = 3] = "PROCHARACTER";
    Skins[Skins["PIRATE"] = 4] = "PIRATE";
})(Skins || (exports.Skins = Skins = {}));
var Swords;
(function (Swords) {
    Swords[Swords["PYTHAGORAS"] = 0] = "PYTHAGORAS";
})(Swords || (exports.Swords = Swords = {}));
function getSkinPos(skin) {
    let pos;
    switch (skin) {
        case Skins.AMOGUS:
            pos = [0, 0];
        case Skins.NORMAL:
            pos = [1, 0];
        case Skins.PYTHAGORAS:
            pos = [2, 0];
        case Skins.PROCHARACTER:
            pos = [3, 0];
        case Skins.PIRATE:
            pos = [0, 1];
    }
    return pos;
}
exports.getSkinPos = getSkinPos;
function getSwordPos(sword) {
    let pos;
    switch (sword) {
        case Swords.PYTHAGORAS:
            pos = [0, 0];
    }
    return pos;
}
exports.getSwordPos = getSwordPos;
