import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public ApiIP: string = "http://18.188.189.121";
    public ApiPort: string = "3000";
    public Server: string = this.ApiIP+":"+this.ApiPort;
    public ApiUrl: string = "/api/";
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}