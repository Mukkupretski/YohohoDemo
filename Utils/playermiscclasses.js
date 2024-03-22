"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sword = exports.PlayerHeader = void 0;
const enums_1 = require("./enums");
const thingclasses_1 = require("./thingclasses");
const constants_1 = require("./constants");
class PlayerHeader {
    constructor(owner) {
        this.owner = owner;
    }
    draw(player, context) {
        const scale = this.owner.size / player.size;
        context.save();
        thingclasses_1.Thing.doTranslate(player, context, this.owner, this.owner.size);
        //How heights are calculated:
        //Player: 128px, gap: 10px, healthbar: 32px, gap: 10px,
        //And scaled by player width
        context.strokeStyle = "none";
        context.fillStyle = "red";
        context.fillRect(-96 * scale, (-this.owner.width / 2 - 10 - 32) * scale, 192 * scale, 32 * scale);
        context.fillStyle = "green";
        context.fillRect(-96 * scale, (-this.owner.width / 2 - 10 - 32) * scale, (this.owner.health / (this.owner.size * 100)) * 192 * scale, 32 * scale);
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillStyle = constants_1.NO_RENDER_COLOR;
        context.font = `${Math.round(32 * scale)}px Arial`;
        context.fillText(player.name, 0, (-this.owner.width / 2 - 10 - 32 - 10) * scale);
        context.restore();
    }
    update(player, context) {
        this.draw(player, context);
    }
}
exports.PlayerHeader = PlayerHeader;
class Sword {
    constructor(owner) {
        this.angle = 30;
        this.direction = "static";
        this.owner = owner;
        const handel = document.createElement("img");
        handel.src = "../Images/handsheet.png";
        handel.onload = () => {
            this.handimg = handel;
        };
        const swordel = document.createElement("img");
        swordel.src = "../Images/swordsheet.png";
        swordel.onload = () => {
            this.swordimg = swordel;
        };
    }
    swing() {
        switch (this.angle) {
            case 30:
                this.direction = "right";
            case 150:
                this.direction = "left";
        }
    }
    draw(player, context) {
        const scale = this.owner.size / player.size;
        context.save();
        context.rotate(((this.angle - this.owner.rotation) / 180) * Math.PI);
        thingclasses_1.Thing.doTranslate(player, context, this.owner, this.owner.size);
        context.fillStyle = constants_1.NO_RENDER_COLOR;
        if (this.handimg) {
            const skinpos = (0, enums_1.getSkinPos)(this.owner.skin);
            context.drawImage(this.handimg, skinpos[0] * 64, skinpos[1] * 64, 64, 64, (-this.owner.width - 32) * scale, -32 * scale, 64 * scale, 64 * scale);
        }
        else {
            context.fillRect((-this.owner.width - 32) * scale, -32 * scale, 64 * scale, 64 * scale);
        }
        if (this.swordimg) {
            const skinpos = (0, enums_1.getSwordPos)(this.owner.swordskin);
            context.drawImage(this.swordimg, skinpos[0] * 256, skinpos[1] * 128, 256, 64, (-this.owner.width - 128) * scale, -32 * scale, 256 * scale, 64 * scale);
            context.globalAlpha = player.swordopacity;
            context.drawImage(this.swordimg, skinpos[0] * 256, skinpos[1] * 128 + 64, 256, 64, (-this.owner.width - 128) * scale, -32 * scale, 256 * scale, 64 * scale);
        }
        else {
            context.fillRect((-this.owner.width - 128) * scale, -32 * scale, 256 * scale, 64 * scale);
        }
        context.restore();
    }
    update(player, context) {
        if (this.direction !== "static") {
            if (this.angle >= 150) {
                this.direction = "static";
                this.angle = 150;
            }
            else if (this.angle <= 30) {
                this.direction = "static";
                this.angle = 30;
            }
            else {
                this.angle += (this.direction === "right" ? 1 : -1) * 15;
            }
        }
        this.draw(player, context);
    }
}
exports.Sword = Sword;
