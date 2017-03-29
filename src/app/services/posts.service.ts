import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {
  constructor(private http: Http) {
    console.log("PostsService Initialised");
  }

  // function to get the sleep data of the current day
  public getTodaysSleep() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    // get current day
    let now = new Date();
    let m = now.getMonth() + 1;

    let today = [
      now.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (now.getDate()>9 ? '' : '0') + now.getDate()]
      .join('/');

    params.set('startDate',today);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/sleeps/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

  // function to get the moves data of the current data
  public getTodaysMoves() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    // get current day
    let now = new Date();
    let m = now.getMonth() + 1;

    let today = [
      now.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (now.getDate()>9 ? '' : '0') + now.getDate()]
      .join('/');

    params.set('startDate',today);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/moves/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

  // function to get the moves data of the current data
  public getTodaysHR() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    // get current day
    let now = new Date();
    let m = now.getMonth() + 1;

    let today = [
      now.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (now.getDate()>9 ? '' : '0') + now.getDate()]
      .join('/');

    params.set('startDate',today);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/heartrate/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

  public getTodaysMood() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    // get current day
    let now = new Date();
    let m = now.getMonth() + 1;

    let today = [
      now.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (now.getDate()>9 ? '' : '0') + now.getDate()]
      .join('/');

    params.set('startDate',today);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/mood/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

}
