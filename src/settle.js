"use strict";
module.exports =
    function(Promise, PromiseArray) {
var ASSERT = require("./assert.js");
var PromiseInspection = Promise.PromiseInspection;
var util = require("./util.js");

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    ASSERT(typeof index === "number");
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
    }
};

//override
SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    ASSERT(!this._isResolved());
    ASSERT(typeof index === "number");
    var ret = new PromiseInspection();
    ret._bitField = IS_FULFILLED;
    ret._settledValue = value;
    this._promiseResolved(index, ret);
};
//override
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    ASSERT(!this._isResolved());
    ASSERT(typeof index === "number");
    var ret = new PromiseInspection();
    ret._bitField = IS_REJECTED;
    ret._settledValue = reason;
    this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return new SettledPromiseArray(this).promise();
};
};
