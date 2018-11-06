const getter = require('pixel-getter');
const fs = require('fs');

const request = require('request').defaults({
    encoding: null
});
const sizeOf = require('image-size');

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

if (!process.argv[2]) {
    throw "Please pass image URL, node imagetotext.js https://domaim.tld/pathtoimage.file"
}

request.get(process.argv[2], function(error, response, body) {
    if (!error && response.statusCode == 200) {

        //Get its size
        var msize = sizeOf(new Buffer(body));

        //Get all of its pixels
        getter.get(new Buffer(body), (err, pixels) => {
            if (msize.width > 255 || msize.height > 255) {
                throw "Image To Big";
            }

            let output = dec2bin(msize.width) + dec2bin(msize.height);

            for (let i = 0; i < pixels[0].length; i += 1) {

                if (pixels[0][i].r > 0 || pixels[0][i].g > 0 || pixels[0][i].b > 0) {
                    output += "1"
                }
                else {
                    output += "0";
                }
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
