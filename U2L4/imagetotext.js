const getter = require('pixel-getter');
const fs = require('fs');

const request = require('request').defaults({
    encoding: null
});
const sizeOf = require('image-size');

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? `0${hex}` : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}


request.get("https://www.gravatar.com/avatar/d19dff679ad6338d7c604eb64327a1ea?s=255", function(error, response, body) {
    if (!error && response.statusCode == 200) {

        //Get its size
        var msize = sizeOf(new Buffer(body));

        //Get all of its pixels
        getter.get(new Buffer(body), (err, pixels) => {
            if (msize.width > 255 || msize.height > 255) {
                throw "Image To Big";
            }

            let output = componentToHex(msize.width) + componentToHex(msize.height) + "18";

            for (let i = 0; i < pixels[0].length; i += 1) {
                output += rgbToHex(pixels[0][i].r, pixels[0][i].g, pixels[0][i].b);
            }


            fs.writeFile('output.txt', output, function(err) {
                if (err)
                    return console.log(err);
                console.log('Logged to output.txt');
            });


        });
    }
    else { console.log("Whoops", err) }
});
