import React from 'react'
import SessionStore from './SessionStore'
import Document from './Document';
import Preferences from './Preferences';


class RootStore {
  constructor(){
    this.session = new SessionStore(this);
    this.doc = new Document({});
    this.preferences = new Preferences();
  }
}
const storesContext = React.createContext(new RootStore());

export const useStores = () => React.useContext(storesContext);