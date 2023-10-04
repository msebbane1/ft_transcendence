import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OAuth2Service {
  constructor(private readonly configService: ConfigService) {}

  async exchangeCodeForAccessToken(code: string) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');
    const apiUrl = this.configService.get<string>('API_42');

    const response = await axios.post(`${apiUrl}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    return response.data.access_token;
  }
}

