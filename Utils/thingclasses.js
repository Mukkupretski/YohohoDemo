"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrassPatch = exports.Coin = exports.Hut = exports.Treasure = exports.Skull = exports.Bush = exports.Tree = exports.Interactable = exports.Thing = void 0;
const constants_1 = require("./constants");
class Thing {
    constructor(imageSrc, width, height, x, y, rotation) {
        const elem = document.createElement("img");
        elem.src = imageSrc;
        elem.onload = () => {
            this.image = elem;
        };
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
    static isInscreen(player, canvas, obj) {
        return (Math.abs(player.x - obj.x) - obj.width / 2 <
            (player.size * canvas.width) / 2 &&
            Math.abs(player.y - obj.y) - obj.height / 2 <
                (player.size * canvas.height) / 2);
    }
    draw(player, context) {
        if (!Thing.isInscreen(player, context.canvas, this))
            return;
        context.save();
        context.rotate(((-2 * Math.PI) / 180) * this.rotation);
        Thing.doTranslate(player, context, this);
        if (this.image) {
            context.drawImage(this.image, -this.width / player.size / 2, -this.height / player.size / 2, this.width / player.size, this.height / player.size);
        }
        else {
            context.fillStyle = constants_1.NO_RENDER_COLOR;
            context.fillRect(-this.width / player.size / 2, -this.height / player.size / 2, this.width / player.size, this.height / player.size);
        }
        context.restore();
    }
    update(player, context) {
        this.draw(player, context);
    }
    static doTranslate(player, context, obj, size) {
        const scale = (size !== null && size !== void 0 ? size : 1) / player.size;
        //1. Put top corner to center
        //2. Put center of the object to center (the width of object is obj.width*scale so we divide that with 2 and same with height)
        //3. Move respectively to the own player's position (scaled by scale)
        //4. Now the object would be at correct place if scale was 1 but else the top corner is offset by width*(1-scale)/2 so we fix that (same with height)
        //5. The square is rendered at ((-width*scale)/2,(-height*scale)/2) for rotation so we fix that offset
        //Note that 2. and 5. cancel each other
        context.translate(
        //X
        context.canvas.width / 2 +
            (obj.width - obj.width * scale) / 2 +
            (obj.x - player.x) * scale, 
        //Y
        context.canvas.height / 2 +
            (obj.height - obj.height * scale) / 2 +
            (obj.y - player.y) * scale);
    }
}
exports.Thing = Thing;
class Interactable extends Thing {
    constructor(imageSrc, width, height, x, y, rotation) {
        super(imageSrc, width, height, x, y, rotation);
    }
    overlap(player) {
        return ((this.width / player.size + player.width) / 2 <
            Math.abs(this.x - player.x) / player.size &&
            (this.height / player.size + player.height) / 2 <
                Math.abs(this.y - player.y) / player.size);
    }
}
exports.Interactable = Interactable;
class Tree extends Thing {
    constructor(x, y, rotation) {
        super("../Images/tree.png", 384, 384, x, y, rotation);
    }
}
exports.Tree = Tree;
class Bush extends Thing {
    constructor(x, y, rotation) {
        super("../Images/bush.png", 128, 128, x, y, rotation);
    }
}
exports.Bush = Bush;
class Skull extends Thing {
    constructor(x, y, rotation) {
        super("../Images/skull.png", 256, 256, x, y, rotation);
    }
}
exports.Skull = Skull;
class Treasure extends Thing {
    constructor(x, y, rotation) {
        super("../Images/treasure.png", 256, 128, x, y, rotation);
    }
}
exports.Treasure = Treasure;
class Hut extends Interactable {
    constructor(x, y, rotation) {
        super("../Images/hut.png", x, y, 512, 512, rotation);
        const floorelem = document.createElement("img");
        floorelem.src = "../Images/hutfloor.png";
        floorelem.onload = () => {
            this.floorimg = floorelem;
        };
        const hutelem = document.createElement("img");
        hutelem.src = "../Images/hut.png";
        hutelem.onload = () => {
            this.hutimg = hutelem;
        };
    }
    update(player, context) {
        if (this.overlap(player)) {
            this.image = this.floorimg;
        }
        else {
            this.image = this.hutimg;
        }
        this.draw(player, context);
    }
}
exports.Hut = Hut;
class Coin extends Interactable {
    constructor(x, y, rotation) {
        super("../Images/coin.png", x, y, 32, 32, rotation);
        this.collected = false;
    }
    update(player, context) {
        if (this.overlap(player)) {
            this.collected = true;
        }
        if (!this.collected) {
            this.draw(player, context);
        }
    }
}
exports.Coin = Coin;
class GrassPatch {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    draw(player, context) {
        context.save();
        const x0 = context.canvas.width / 2 + (this.x - player.x) / player.size;
        const y0 = context.canvas.height / 2 + (this.y - player.y) / player.size;
        const r0 = this.r / player.size;
        const grd = context.createRadialGradient(x0, y0, 0, x0, y0, r0);
        grd.addColorStop(0, constants_1.MAP_COLOR);
        grd.addColorStop(1, constants_1.GRASSPATCH_CENTER);
        context.fillStyle = grd;
        context.beginPath();
        context.arc(x0, y0, r0, 0, 2 * Math.PI, false);
        context.fill();
        context.restore();
    }
    update(player, context) {
        if (!Thing.isInscreen(player, context.canvas, {
            x: this.x,
            y: this.y,
            width: this.r,
            height: this.r,
        })) {
            this.draw(player, context);
        }
    }
}
exports.GrassPatch = GrassPatch;
