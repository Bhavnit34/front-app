import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {
  constructor(private http: Http) {
    console.log("PostsService Initialised");
  }

  // function to get the requested data of the current day
  public getTodaysAttr(attr) {
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
      (now.getDate() > 9 ? '' : '0') + now.getDate()]
      .join('/');

    params.set('startDate', today);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/' + attr + '/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }


  // function to retrieve the latest stats figures
  public getTodaysStats() {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', '1');

    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/stats/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

  public getAttrForDay(attr, date, limit) {
    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
    params.set('limit', limit);

    let d = new Date(date);
    let m = d.getMonth() + 1;
    let startDate = [
      d.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (d.getDate() > 9 ? '' : '0') + d.getDate()]
      .join('/');

    params.set('startDate', startDate);
    params.set('endDate', startDate);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/' + attr + '/BRx5p_mMpSn-RjknXdn3dA', options)
      .map(res => res.json());
  }

  public getAttrForLatestWeek(attr, username) {
    let token = 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP';
    let user = 'BRx5p_mMpSn-RjknXdn3dA';
    let danUser = 'BRx5p_mMpSnKSKC3Fz2aqw';
    let danToken = 'u1r_4oEFjcGXMeBUkvDdikHZjwblB7qMPAxB0JJSceafi4xZAqlZmKvq7UPSdXGUnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP';
    if (username == "dan") {
      token = danToken;
      user = danUser;
    }

    let headers = new Headers({'Accept': 'application/json'});

    let params: URLSearchParams = new URLSearchParams();

    params.set('token', token);

    // start date
    let d = new Date();
    d.setDate(d.getDate() - 7);
    let m = d.getMonth() + 1;
    let startDate = [
      d.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (d.getDate() > 9 ? '' : '0') + d.getDate()]
      .join('/');

    // end date
    d = new Date();
    d.setDate(d.getDate() - 1);
    m = d.getMonth() + 1;
    let endDate = [
      d.getFullYear(),
      (m > 9 ? '' : '0') + m, // add leading zero if below 9
      (d.getDate() > 9 ? '' : '0') + d.getDate()]
      .join('/');

    params.set('startDate', startDate);
    params.set('endDate', endDate);
    let options = new RequestOptions({headers: headers});
    options.search = params;
    return this.http
      .get('http://52.208.153.178:3000/api/' + attr + '/' + user, options)
      .map(res => res.json());
  }


    public getStats(username) {
      let headers = new Headers({'Accept': 'application/json'});
      let token = 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP';
      let user = 'BRx5p_mMpSn-RjknXdn3dA';
      let danUser = 'BRx5p_mMpSnKSKC3Fz2aqw';
      let danToken = 'u1r_4oEFjcGXMeBUkvDdikHZjwblB7qMPAxB0JJSceafi4xZAqlZmKvq7UPSdXGUnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP';

      if (username == "dan") {
        token = danToken;
        user = danUser;
      }

      let params: URLSearchParams = new URLSearchParams();

      params.set('token', token);
      params.set('limit', '1');

      let options = new RequestOptions({headers: headers});
      options.search = params;
       return this.http
        .get('http://52.208.153.178:3000/api/stats/' + user, options)
        .map(res => res.json());
    }

    public getAllRowsForAttr(attr) {
      let headers = new Headers({'Accept': 'application/json'});
      let params: URLSearchParams = new URLSearchParams();

      params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
      params.set('userId','BRx5p_mMpSn-RjknXdn3dA');
      params.set('attribute', attr);

      let options = new RequestOptions({headers: headers});
      options.search = params;
      return this.http
        .get('http://52.208.153.178:3000/api/jawbone/getAllData', options)
        .map(res => res.json());
    }

    public getRowCountForAttr(attr) {
      let headers = new Headers({'Accept': 'application/json'});
      let params: URLSearchParams = new URLSearchParams();

      params.set('token', 'u1r_4oEFjcERitMMWaygT0HZjwblB7qMPAxB0JJSceafi4xZAqlZmNJuJ6MD-KTmnHGv14YiRz_SZK_iqV7QIVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP');
      params.set('userId','BRx5p_mMpSn-RjknXdn3dA');
      params.set('attribute', attr);

      let options = new RequestOptions({headers: headers});
      options.search = params;
      return this.http
        .get('http://52.208.153.178:3000/api/jawbone/getRowCount', options)
        .map(res => res.json());
    }


}



