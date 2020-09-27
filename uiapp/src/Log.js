// import debug from 'debug';

// const BASE = 'atmyplace';

// if (process.env.NODE_ENV !== 'production') {
//   localStorage.setItem('debug', `${BASE}:*`);
// }

// const COLOURS = {
//   trace: 'lightblue',
//   info: 'blue',
//   warn: 'pink',
//   error: 'red'
// }; 

// class Log {
//   constructor(source) {
//     this.source = source;
//   }

//   generateMessage(level, message, source) {
//     // Set the prefix which will cause debug to enable the message
//     const namespace = `${BASE}:${level}`;
//     const createDebug = debug(namespace);
    
//     // Set the colour of the message based on the level
//     createDebug.color = COLOURS[level];
    
//     if(source) { createDebug(source, message); }
//     else { createDebug(message); }
//   }
  
//   trace(message, source) {
//     return this.generateMessage('trace', message, source||this.source);
//   }
  
//   info(message, source) {
//     return this.generateMessage('info', message, source||this.source);
//   }
  
//   warn(message, source) {
//     return this.generateMessage('warn', message, source||this.source);
//   }
  
//   error(message, source) {
//     return this.generateMessage('error', message, source||this.source);
//   }
// }

// export default Log;

if (process.env.NODE_ENV !== 'production') {
  window.loglevel=5;
}

export default class Log {
  prefix=''
  constructor(prefix) {
    this.prefix = 'wcs:'+prefix;
  }

  trace(message) {
    if ((window.loglevel||1)>4)
    console.trace(`${this.prefix} ${message}`);
  }
  debug(message) {
    if ((window.loglevel||1)>3)
    console.debug(`${this.prefix} ${message}`);
  }
  info(message) {
    if ((window.loglevel||1)>2)
    console.info(`${this.prefix} ${message}`);
  }
  warn(message) {
    if ((window.loglevel||1)>1)
    console.warn(`${this.prefix} ${message}`);
  }
  error(message) {
    console.error(`${this.prefix} ${message}`);
  }
}