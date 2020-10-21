import 'reflect-metadata';
import express from 'express';

const sRoutes = Symbol('Routes');
const sMiddleware = Symbol('Middleware');

interface ControllerClass extends NewableFunction {
  route: string;
  new(): any
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

    Reflect.defineMetadata(sRoutes, routeHandlers, target);
    
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

    Reflect.defineMetadata(sRoutes, routeHandlers, target);
    
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

    Reflect.defineMetadata(sRoutes, routeHandlers, target);
    
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

    Reflect.defineMetadata(sRoutes, routeHandlers, target);
    
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

    Reflect.defineMetadata(sRoutes, routeHandlers, target);
    
    return descriptor;
  };
}

// Middleware method decorator factory
// Static methods will be installed as app-level middleware.
// Instance methods will be installed at the ControllerClass level.
export function middleware() {
  return function(
    target: ControllerClass['prototype'] | ControllerClass,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const middleware = (Reflect.getOwnMetadata(sMiddleware, target) || []) as
      (keyof ControllerClass | keyof ControllerClass['prototype'])[];

    middleware.push(propertyKey);
    
    Reflect.defineMetadata(sMiddleware, middleware, target);
    
    return descriptor;
  };
}


// Controller class decorator factory
export function controller() {
  return function<T extends ControllerClass>(constructor: T): T {
    return constructor;
  };
}

// Initializes an app with a set of route controller classes
export function initAppControllers(
  app: express.Router,
  controllers: ControllerClass[]
): express.Router {
  controllers.forEach(controllerCls => {
    const router = express.Router();

    // Handle global middleware
    const globalMiddleware = (
      Reflect.getOwnMetadata(sMiddleware, controllerCls) || []) as (keyof typeof controllerCls)[];
    
    globalMiddleware.forEach(handler => {
      app.use((req, res, next) => controllerCls[handler](req, res, next));
    });

    // Controller-level middleware
    const controller = new controllerCls();
    const middleware = (Reflect.getOwnMetadata(sMiddleware, controllerCls.prototype) || []) as
      (keyof typeof controllerCls.prototype)[];

    middleware.forEach(handler => {
      router.use((req, res, next) => controller[handler](req, res, next));
    });

    // Register controller routes
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
