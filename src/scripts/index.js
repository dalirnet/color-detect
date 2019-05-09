// import
let colorDetect = require("./color-detect");
let _ = require("lodash");

// var
let frame = document.getElementById("frame");
let input = document.getElementById("file");
let image = document.getElementById("img");

// event
input.addEventListener("change", (e) => {
    let files = e.target.files;
    let overlayEl = document.getElementsByClassName("overlay");
    _.forEach(overlayEl, () => {
        overlayEl[0].parentNode.removeChild(overlayEl[0]);
    });
    if (files[0].type.match("image.*")) {
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (evt) => {
            if (evt.target.readyState == FileReader.DONE) {
                frame.classList.add("active");
                image.src = evt.target.result;
                colorDetect.getColor(evt.target.result).then((data) => {
                    let framePos = frame.getBoundingClientRect();
                    let imagePos = image.getBoundingClientRect();
                    let index = 1;
                    let newPos = {
                        left: (imagePos.x - framePos.x),
                        top: (imagePos.y - framePos.y)
                    };
                    _.forEach(data.colors, (value) => {
                        let overlay = document.createElement("span");
                        let thisPos = {
                            left: newPos.left + ((value.pos.x * imagePos.width) / data.size.w),
                            top: newPos.top + ((value.pos.y * imagePos.height) / data.size.h),
                        };
                        overlay.className = "overlay _" + index;
                        overlay.style.left = (thisPos.left - 11) + "px";
                        overlay.style.top = (thisPos.top - 11) + "px";
                        overlay.style.background = "rgb(" + _.join(value.color, ",") + ")";
                        frame.appendChild(overlay);
                        index++;
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
    else {
        image.src = image.getAttribute("data-src");
        frame.classList.remove("active");
    }
});
