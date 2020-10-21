# express-controller-class

Exposes `@get`, `@post`, `@put`, `@patch` and `@delete` method decorators and `@controller` class decorator
to mark up classes as Express route handlers.

Also exposes `@middleware` method decorators to export methods as Express middleware - decorate a static method
to export app-level middleware, or an instance method to register middleware for any route in that controller.

By themselves, the decorators just register route metadata for later use - to expose your controllers to an
app, call the exposed util function `initAppControllers` with an existing express app and a list of controller
classes (see example below).

The util will create singleton instances of each controller, create an Express Router for each distinct
`route` those controllers define, and register its decorated methods as handlers on the router. The util then
calls `app.use()` with each of those Routers before returning the initialized app.

Controller classes are instantiated by the util and should not expose a constructor that requires parameters. Any
properties on a controller class must be initialized with a default value, or `initAppControllers` will error.

## Why?

There's already a few of these libs out there, but all have strong opinions re: architecture or code style.

This lib just gives you exactly what you want - minimally-intrusive Express route controllers. The rest is up to you!

## Example usage

```ts
import { controller, get, post } from 'express-controller-class';

@controller()
export class UserController {
  static route: '/users' // Base route for this controller.

  @middleware()
  static checkSession(request, response, next) {
    // App-level middleware - runs on every app request. `this` is the UserController class
  }

  @middleware()
  async checkPermissions(request, response, next) {
    // Controller-level middleware - runs on any route defined in this class
    // For example, to check whether the requester has permission to view or update other users
  }

  @get()
  async getAll(request: express.Request, response: express.Response) {
    // GET /users
    // Express route handler params are the same as they always are
  }

  @get('/:userId')
  async getOne(request, response) {
    // GET /users/123
    // Params are in the same place, `request.params`
  }

  @post('/:userId')
  async update(request, response) {
    // POST /users/123
    // Request data is where it always is, `request.body`
  }
}
```

```ts
import { initAppControllers } from 'express-controller-class';
import { UserController } from './user-controller';

const app = express();

initAppControllers(app,
[
  UserController
]);
```
