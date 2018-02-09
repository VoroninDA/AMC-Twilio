(function (AMCTracer) {

    var E = 1;
    var W = 2;
    var I = 3;
    var D = 4;
    var X = 5;

    var logLevel = I;

    AMCTracer.Error = function () { return E; }
    AMCTracer.Warning = function () { return W; }
    AMCTracer.Info = function () { return I; }
    AMCTracer.Debug = function () { return D; }
    AMCTracer.XDebug = function () { return X; }
    //Temporary Fix
    AMCTracer.AMCTracerLog = function (lvl, msg) {
        if (lvl === 1)
            console.log(msg);
    }    
}(window.AMCTracer = window.AMCTracer || {}));