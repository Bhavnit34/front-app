import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UploadService {
  /**
   * @param Observable<number>
   */
  private progress$: Observable<number>;

  /**
   * @type {number}
   */
  private progress: number = 0;

  private progressObserver: any;
  constructor () {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer
    }).share();
  }

  public uploadFile(file:File) {
      let xhr:XMLHttpRequest = new XMLHttpRequest();


      xhr.open('POST', "localhost:4200/assets/", true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      let formData = new FormData();
      formData.append("file", file, "test.png");
      xhr.send(formData);
  }
}
