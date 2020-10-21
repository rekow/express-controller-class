"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAppControllers = exports.controller = exports.del = exports.patch = exports.put = exports.post = exports.get = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const express_1 = tslib_1.__importDefault(require("express"));
const sRoutes = Symbol('Routes');
// Route method decorator factories
function get(path = '/') {
    return function (target, propertyKey, descriptor) {
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {});
        if (!routeHandlers.get) {
            routeHandlers.get = {};
        }
        routeHandlers.get[path] = propertyKey;
        Reflect.defineMetadata(sRoutes, target, routeHandlers);
        return descriptor;
    };
}
exports.get = get;
function post(path = '/') {
    return function (target, propertyKey, descriptor) {
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {});
        if (!routeHandlers.post) {
            routeHandlers.post = {};
        }
        routeHandlers.post[path] = propertyKey;
        Reflect.defineMetadata(sRoutes, target, routeHandlers);
        return descriptor;
    };
}
exports.post = post;
function put(path = '/') {
    return function (target, propertyKey, descriptor) {
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {});
        if (!routeHandlers.put) {
            routeHandlers.put = {};
        }
        routeHandlers.put[path] = propertyKey;
        Reflect.defineMetadata(sRoutes, target, routeHandlers);
        return descriptor;
    };
}
exports.put = put;
function patch(path = '/') {
    return function (target, propertyKey, descriptor) {
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {});
        if (!routeHandlers.patch) {
            routeHandlers.patch = {};
        }
        routeHandlers.patch[path] = propertyKey;
        Reflect.defineMetadata(sRoutes, target, routeHandlers);
        return descriptor;
    };
}
exports.patch = patch;
function del(path = '/') {
    return function (target, propertyKey, descriptor) {
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {});
        if (!routeHandlers.delete) {
            routeHandlers.delete = {};
        }
        routeHandlers.delete[path] = propertyKey;
        Reflect.defineMetadata(sRoutes, target, routeHandlers);
        return descriptor;
    };
}
exports.del = del;
// Controller class decorator factory
function controller() {
    return function (constructor) {
        return constructor;
    };
}
exports.controller = controller;
function initAppControllers(app, controllers) {
    controllers.forEach(controllerCls => {
        const controller = new controllerCls();
        const router = express_1.default.Router();
        const routeHandlers = (Reflect.getOwnMetadata(sRoutes, controllerCls.prototype) || {});
        for (const [method, handlers] of Object.entries(routeHandlers)) {
            for (const [path, handlerName] of Object.entries(handlers)) {
                router[method](path, (req, res) => controller[handlerName](req, res));
            }
        }
        app.use(controllerCls.route, router);
    });
    return app;
}
exports.initAppControllers = initAppControllers;
//# sourceMappingURL=index.js.map