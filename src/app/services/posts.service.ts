import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {
  constructor(private http: Http) {
    console.log("PostsService Initialised");
  }

  public getTodaysSleep() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/sleeps/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }
}
