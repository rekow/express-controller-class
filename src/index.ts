import 'reflect-metadata';
import express from 'express';

const sRoutes = Symbol('Routes');

interface ControllerClass extends NewableFunction {
  route: string;
  new(...args: any[]): any
}

type RouteConfig = {
  get: Record<string, string>,
  post: Record<string, string>,
  put: Record<string, string>,
  patch: Record<string, string>,
  delete: Record<string, string>
};

// Route method decorator factories
export function get(path = '/') {
  return function (
    target: ControllerClass['prototype'],
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor {
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {}) as RouteConfig;

    if (!routeHandlers.get) {
      routeHandlers.get = {};
    }
    routeHandlers.get[path] = propertyKey;

    Reflect.defineMetadata(sRoutes, target, routeHandlers);
    
    return descriptor;
  };
}

export function post(path = '/') {
  return function (
    target: ControllerClass['prototype'],
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor {
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {}) as RouteConfig;

    if (!routeHandlers.post) {
      routeHandlers.post = {};
    }
    routeHandlers.post[path] = propertyKey;

    Reflect.defineMetadata(sRoutes, target, routeHandlers);
    
    return descriptor;
  };
}

export function put(path = '/') {
  return function (
    target: ControllerClass['prototype'],
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor {
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {}) as RouteConfig;

    if (!routeHandlers.put) {
      routeHandlers.put = {};
    }
    routeHandlers.put[path] = propertyKey;

    Reflect.defineMetadata(sRoutes, target, routeHandlers);
    
    return descriptor;
  };
}

export function patch(path = '/') {
  return function (
    target: ControllerClass['prototype'],
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor {
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {}) as RouteConfig;

    if (!routeHandlers.patch) {
      routeHandlers.patch = {};
    }
    routeHandlers.patch[path] = propertyKey;

    Reflect.defineMetadata(sRoutes, target, routeHandlers);
    
    return descriptor;
  };
}

export function del(path = '/') {
  return function (
    target: ControllerClass['prototype'],
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor {
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, target) || {}) as RouteConfig;

    if (!routeHandlers.delete) {
      routeHandlers.delete = {};
    }
    routeHandlers.delete[path] = propertyKey;

    Reflect.defineMetadata(sRoutes, target, routeHandlers);
    
    return descriptor;
  };
}


// Controller class decorator factory
export function controller() {
  return function<T extends ControllerClass>(constructor: T): T {
    return constructor;
  };
}

export function initAppControllers(
  app: express.Application,
  controllers: ControllerClass[]
): express.Application {
  controllers.forEach(controllerCls => {
    const controller = new controllerCls();
    const router = express.Router();
    const routeHandlers = (Reflect.getOwnMetadata(sRoutes, controllerCls.prototype) || {}) as RouteConfig;

    for (const [method, handlers] of Object.entries(routeHandlers)) {
      for (const [path, handlerName] of Object.entries(handlers)) {
        router[method as keyof RouteConfig](
          path, 
          (req: express.Request, res: express.Response) => controller[handlerName](req, res)
        );
      }
    }

    app.use(controllerCls.route, router);
  });

  return app;
}
