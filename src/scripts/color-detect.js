let Promise = require("promise");
let _ = require("lodash");
let Color = require("color");

class colorDetect {
    constructor() {
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.body = document.getElementsByTagName("body")[0];
        this.addCanvas();
    }

    getColor(imageURL = null, count = 6) {
        this.image = new Image();
        return new Promise((resolve, reject) => {
            if (typeof (imageURL) != "string") {
                reject("source image problem!");
            }
            this.image.src = imageURL;
            this.image.onerror = () => {
                reject("source image problem!");
            };
            this.image.onload = () => {
                this.canvas.width = this.image.width;
                this.canvas.height = this.image.height;
                this.context = this.canvas.getContext("2d");
                this.context.drawImage(this.image, 0, 0);
                this.getPixelsColor(resolve, count, { w: this.canvas.width, h: this.canvas.height });
            };
        });
    }

    getPixelsColor(resolve, count, canvasSize) {
        let colors = {};
        let keep = {
            x: 0,
            y: 0
        };
        let boxSize = 20;
        let out = {
            size: canvasSize,
            colors: []
        };
        for (let _x = 0; _x < Math.floor(this.image.width / boxSize); _x++) {
            keep.x += boxSize;
            keep.y = 0;
            for (let _y = 0; _y < Math.floor(this.image.height / boxSize); _y++) {
                keep.y += boxSize;
                let pixel = this.context.getImageData(keep.x, keep.y, 1, 1).data;
                if (pixel[3] > 127) {
                    let hslColor = Color.rgb(_.slice(pixel, 0, 3)).hsl().color;
                    let render = {
                        lightness: this.checkLightness(hslColor[2]),
                        saturation: this.checkSaturation(hslColor[1]),
                        hue: hslColor[0]
                    };
                    render.hue = this.checkHue(render);
                    let colorStepName = render.hue + "_" + render.saturation + "_" + render.lightness;
                    if (colorStepName != "0_100_0" && colorStepName != "0_0_100" && colorStepName != "0_100_100") {
                        if (!_.has(colors, colorStepName)) {
                            colors[colorStepName] = [colorStepName];
                        }
                        colors[colorStepName].push([pixel[0], pixel[1], pixel[2], keep.x, keep.y]);
                    }
                }
            }
        }
        colors = _.slice(_.reverse(_.sortBy(colors, (o) => {
            return o.length;
        })), 0, count);
        _.forEach(colors, (value) => {
            let colorStepName = "";
            let selectRandom = value[_.random(1, value.length - 1)];
            let colorAvg = {
                r: 0,
                g: 0,
                b: 0
            };
            _.forEach(value, (_value) => {
                if (colorStepName == "") {
                    colorStepName = _value;
                } else {
                    colorAvg.r += _value[0];
                    colorAvg.g += _value[1];
                    colorAvg.b += _value[2];
                }
            });
            out.colors.push({
                color: [
                    // r
                    Math.floor(colorAvg.r / value.length),
                    // g
                    Math.floor(colorAvg.g / value.length),
                    // b
                    Math.floor(colorAvg.b / value.length)
                ],
                pos: {
                    x: selectRandom[3],
                    y: selectRandom[4]
                }
            });
        });
        resolve(out);
    }

    checkHue(render) {
        if (render.lightness > 10 && render.lightness < 90 && render.saturation >= 50) {
            if (render.hue <= 15) {
                return 1;
            } else if (render.hue <= 25) {
                return 2;
            } else if (render.hue <= 35) {
                return 3;
            } else if (render.hue <= 45) {
                return 4;
            } else if (render.hue <= 65) {
                return 5;
            } else if (render.hue <= 70) {
                return 6;
            } else if (render.hue <= 145) {
                return 7;
            } else if (render.hue <= 160) {
                return 8;
            } else if (render.hue <= 185) {
                return 9;
            } else if (render.hue <= 215) {
                return 10;
            } else if (render.hue <= 245) {
                return 11;
            } else if (render.hue <= 260) {
                return 12;
            } else if (render.hue <= 275) {
                return 13;
            } else if (render.hue <= 295) {
                return 14;
            } else if (render.hue <= 315) {
                return 15;
            } else if (render.hue <= 330) {
                return 16;
            } else if (render.hue < 345) {
                return 17;
            } else {
                return 1;
            }
        }
        return 0;
    }

    checkSaturation(input) {
        if (input <= 20) {
            return 0;
        } else if (input <= 35) {
            return 50;
        }
        return 100;
    }

    checkLightness(input) {
        if (input <= 10) {
            return 0;
        } else if (input <= 35) {
            return 25;
        } else if (input < 85) {
            return 50;
        } else if (input < 90) {
            return 75;
        }
        return 100;
    }

    addCanvas() {
        this.canvas.id = "color-detect-canvas-id";
        this.canvas.style.position = "absolute";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.width = 0;
        this.canvas.style.height = 0;
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.style.opacity = 0;
        this.body.appendChild(this.canvas);
    }
}


module.exports = new colorDetect();