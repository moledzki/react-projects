"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupRedisClient(req, res, next) {
    if (req.context === undefined) {
        req.context = {};
    }
    req.context.date = new Date();
    req.context.foo = "Test";
    console.log("Context created: " + JSON.stringify(req.context));
    let cleanup = () => {
        console.log("context to clean!" + JSON.stringify(req.context));
    };
    res.on("finish", cleanup);
    res.on("error", cleanup);
    next();
}
exports.setupRedisClient = setupRedisClient;
//# sourceMappingURL=RequestLifecycle.js.map