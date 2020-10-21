# express-controller-class

Exposes `@get`, `@post`, `@put`, `@patch` and `@delete` method decorators and `@controller` class decorator
to mark up classes as Express route handlers.

By themselves, the decorators just register route metadata for later use - to expose your controllers to an
app, call the exposed util function `initAppControllers` with an existing express app and a list of controller
classes. The util will create singleton instances of each controller, create an Express Router for each distinct
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

  @get()
  async getAll(request, response) {
    // GET /users
    // Express route handler params, context is the current UserController
  }

  @get('/:userId')
  async getOne(request, response) {
    // GET /users/123
  }

  @post('/:userId')
  async update(request, response) {
    // POST /users/123
    // Request data is where it always is in Express, `request.body`
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
