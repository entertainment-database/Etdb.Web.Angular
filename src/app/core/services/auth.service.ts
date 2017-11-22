import { ClientConfig } from '../models/client-config.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserLogin } from '../models/user-login.model';
import { IdentityToken } from '../models/identity-token.model';
import { IdentityUser } from '../models/identity-user.model';
import { ApiService } from '../../abstractions/api.service';
import { RegisterUser } from '../models/register-user.model';

@Injectable()
export class AuthService extends ApiService {
    public constructor(private http: HttpClient) {
        super();
    }

    public loginViaCredentials(login: UserLogin, config: ClientConfig): Observable<IdentityToken> {
        const formData = new FormData();

        const headers = new HttpHeaders()
            .set('Authorization', 'Basic ' + Base64.encode(config.clientName + ':' + config.secret))
            .set('Accept', 'application/json')
            .set('cache-control', 'no-cache');

        formData.append('grant_type', 'password');
        formData.append('username', login.userName);
        formData.append('password', login.password);
        formData.append('scope', 'UserService WebService openid offline_access');

        return this.http.post(environment.userserviceAuthUrl, formData, {
            headers: headers
        }).map((res: IdentityToken) => res);
    }

    public loginViaRefreshtoken(token: IdentityToken, config: ClientConfig): Observable<IdentityToken> {
        const formData = new FormData();

        const headers = new HttpHeaders()
            .set('Authorization', 'Basic ' + Base64.encode(config.clientName + ':' + config.secret))
            .set('Accept', 'application/json')
            .set('cache-control', 'no-cache');

        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', token.refresh_token);

        return this.http.post(environment.userserviceAuthUrl, formData, {
            headers: headers
        }).map((res: IdentityToken) => res);
    }

    public loadIdentityUser(): Observable<IdentityUser> {
        let headers = this.baseHeaders;
        headers = this.setAuthorizationHeader(headers);

        return this.http.get(environment.userserviceAuthProfileUrl, {
            headers: headers
        }).map((res: IdentityUser) => res);
    }

    public register(registerUser: RegisterUser): Observable<any> {
        const headers = this.baseHeaders;
        return this.http.post(environment.userserviceAdminUrl + 'users/registration',
            JSON.stringify(registerUser), {
                headers: headers
            });
    }
}
