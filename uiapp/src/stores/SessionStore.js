import { observable, action, computed } from 'mobx'
import { v4 as uuidv4} from 'uuid';
import {auth} from '../services/firebase';
import User from './user';
import Logger from '../Log';


const log = new Logger('SessionStore');

const socketClusterClient = require("socketcluster-client");

const _SESSIONID = uuidv4();

export default class SessionStore {

  @observable
  idToken = null

  @observable
  isBusy = false;

  @observable
  connectionState='offline';
  
  @observable
  user=null;

  @computed
  get isAuthenticated() {
    return this.idToken!==null
  }

  @computed
  get authorization () {
    const apiAuth = {"Authorization": `Bearer ${this.idToken}`};
    return apiAuth;
  }

  get SESSIONID () {
    return _SESSIONID;
  }

  @action
  setIdToken(token){
    this.idToken = token
    window.localStorage.setItem('idToken', this.idToken);
    window.apiAuth = this.authorization;
  }

  constructor () {
    log.trace('ctor');
    auth().onAuthStateChanged(this.refreshToken.bind(this));
    let options;
    if (process.env.NODE_ENV!=='production') {
      options={
        hostname: 'localhost',
        port: 8000,
        autoConnect: false
      }
    } else {
      options={
        autoConnect: false
      };
    }
    window.socket = socketClusterClient.create(options);
    (async () => {
      for await (let data of window.socket.listener('error')) {
        console.error(`socket error: ${JSON.stringify(data)}`);
        if (data.error && data.error.code===1006) {
          this.connectionState='offline';
        }
      }
      console.warn('socket "error" listener was closed.');
      this.connectionState='offline';
    })();

    (async () => {
      for await (let _data of window.socket.listener('connecting')) {
        this.connectionState='connecting';
        console.info(`socket connecting...`);
      }
      console.warn('socket "connecting" listener was closed.');
      this.connectionState='offline';
    })();

    (async () => {
      for await (let data of window.socket.listener('connect')) {
        this.connectionState='online';
        console.info(`socket connected: ${JSON.stringify(data)}`);
        this.register();
      }
      console.warn('socket "connect" listener was closed.');
      this.connectionState='offline';
    })();


    window.socket.connect();
  }


  @action
  async login(email, password) {
    console.log('AppStore::login');
    try {
      this.isBusy = true;
      
      await auth().setPersistence(auth.Auth.Persistence.LOCAL);
      await auth().signInWithEmailAndPassword(email, password);

      this.user = new User();
      this.setIdToken(await auth().currentUser.getIdToken());
      await this.user.get();

    } catch (e) {
      console.error('login error', e);
      this.idToken=null;
    }
    finally {
      this.isBusy = false;
    }
  }

  @action
  logout() {
    console.log('AppStore::logout');
    this.idToken = null;
    window.localStorage.setItem('idToken',null);
    auth().signOut()
      .then(()=>{
        console.log('logged out.')
      })
      .catch(console.error);
  }

  @action 
  refreshToken(usr) {
    console.log('AppStore::refreshToken');
    let refresh = false;
    const session = this;

    (function poll(){
      var dt = new Date();
      var timeout = 55*60*1000;
      console.log(docCookies.getItem('firebaseAccessTimer') - dt.getTime());
      if (docCookies.getItem('firebaseAccessTimer') - dt.getTime() < 0) {
        refresh = true;
      }

      if (usr) {
        console.log('user signed-in');
        if (refresh) {console.log('refresing accessToken');}
        session.isBusy = true;
        usr.getIdToken(refresh).then(async (accessToken) => {
          session.user = new User({uid:usr.uid});
          session.setIdToken(accessToken);
          session.user.get();
          session.register();
          session.isBusy = false;

          if (accessToken === docCookies.getItem('firebaseAccessToken')) {
            window.setTimeout(poll, docCookies.getItem('firebaseAccessTimer') - dt.getTime());
          } else {
            document.cookie = "firebaseAccessToken=" + accessToken + '; path=/';
            document.cookie = "firebaseAccessTimer=" + (dt.getTime() + timeout) + '; path=/';
            window.setTimeout(poll, timeout);
          }
          if (document.getElementById("firebaseAccessToken")) {
            document.getElementById("firebaseAccessToken").value = accessToken;
          }
        });

      } else {
        console.log('user signed-out');
        session.idToken = null;
        session.user = null;
        window.apiAuth = null;
        window.localStorage.setItem('idToken',null);
        document.cookie = 'firebaseAccessTimer=0; path=/';
        // window.location.href = '/login?signInSuccessUrl=' + encodeURIComponent(window.location.pathname);
      }
    })();
  }

  @action
  register() {
    if (!this.isAuthenticated) return;
    if (!window.socket) return;
    console.log('AppStore::register');

    ( async () => {
      try {
        // Invoke a custom 'login' procedure (RPC) on our server socket
        // then wait for the socket to be authenticated.
        await Promise.all([
          window.socket.invoke('login', this.idToken),
          window.socket.listener('authenticate').once(),
        ]);
      } catch (error) {
        console.error('Failed to login', error)
        return;
      }
    })();
  }
}


const docCookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};