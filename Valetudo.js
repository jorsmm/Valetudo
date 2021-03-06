const fs = require("fs");
const Vacuum = require("./miio/Vacuum");
const Webserver = require("./webserver/WebServer");


const Valetudo = function() {
    this.address = process.env.VAC_ADDRESS ? process.env.VAC_ADDRESS : "127.0.0.1";

    if(process.env.VAC_TOKEN) {
        this.tokenProvider = function() {
            return Buffer.from(process.env.VAC_TOKEN, "hex");
        }
    } else {
        this.tokenProvider = Valetudo.NATIVE_TOKEN_PROVIDER;
    }

    this.webPort = process.env.VAC_WEBPORT ? parseInt(process.env.VAC_WEBPORT) : 80;

    this.vacuum = new Vacuum({
        ip: this.address,
        tokenProvider: this.tokenProvider
    });

    this.webserver = new Webserver({
        vacuum: this.vacuum,
        port: this.webPort
    })
};


Valetudo.NATIVE_TOKEN_PROVIDER = function() {
    const token = fs.readFileSync("/mnt/data/miio/device.token");
    if(token && token.length >= 16) {
        return token.slice(0,16);
    } else {
        throw new Error("Unable to fetch token")
    }
};

module.exports = Valetudo;