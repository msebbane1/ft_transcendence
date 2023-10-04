import { Controller, Get, Query } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauth2Service: OAuth2Service) {}

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    const accessToken = await this.oauth2Service.exchangeCodeForAccessToken(code);

    // Vous pouvez ajouter d'autres étapes de gestion ici
    // Stockez le jeton d'accès, authentifiez l'utilisateur, etc.

    return { access_token: accessToken };
  }
}

