import { observable} from 'mobx'
import Logger from '../Log';

const log = new Logger('Preferences');


export default class Preferences {
  @observable leftDrawerWidth = 240;
  @observable rightDrawerWidth = 350;

  @observable nodeWidth=125;
  @observable nodeHeaderHeight=38;
  @observable nodeFieldHeight=20;
  
  
  @observable snapWidth=1;

  @observable canvasScale=1;
  @observable canvasWidth=1920;
  @observable canvasHeight=1080;

  @observable showGrid=true;
  @observable gridColor='#eee';
  @observable gridWidth=50;

  constructor() {}
}