import { HttpException, Middleware, NestMiddleware } from 'nest.js';
import { AuthService } from './auth.service';

@Middleware()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) { }

  public resolve() {
    return async (req, res, next) => {
      const user = await this.authService.validateToken(req.headers.token);
      if (!user) {
        throw new HttpException('Unauthorized', 401);
      }
      req.user = user;
      next();
    };
  }
}
