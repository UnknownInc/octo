
import { observable, action } from 'mobx';
import UserService from '../services/userservice';
import Logger from '../Log';


const log = new Logger('User');
export default class User {
  constructor(data, session) {
    this.merge(data);
    this.session=session;
  }

  @observable
  displayName=''

  @observable
  email
  
  @observable
  photoURL
  
  @observable
  shortDescription
  
  @observable
  uid

  @action
  merge(data) {
    if (data) {
      this.uid = data.uid;
      this.email = data.email
      this.displayName = data.displayName;
      this.photoURL = data.photoURL;
      this.shortDescription = data.shortDescription;
    }
  }

  @action 
  async get() {
    log.info('get');
    const data  = await UserService.get(this.uid);
    this.merge(data);
    return this;
  }

  @action
  async update(values) {
    log.info('update');
    const data  = await UserService.update(this.uid, values);
    this.merge(data);
    return this;
  }
}