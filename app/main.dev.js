/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, screen, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import path from 'path';

let mainWindow = null;
let customerWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function findDisplays () {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  const secondaryDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  const touchscreenDisplay = displays.find((display) => {
    return display.touchSupport == 'available';
  });
  return {
    primaryDisplay,
    secondaryDisplay,
    touchscreenDisplay
  };
}

app.on('ready', async () => {
  // if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  //   await installExtensions();
  // }
  await installExtensions();

  console.log(findDisplays());
  const { primaryDisplay, secondaryDisplay, touchscreenDisplay } = findDisplays();
  const customerDisplay = touchscreenDisplay || secondaryDisplay;

  screen.on('display-added', (e, newDisplay) => {
    alert('display-added id: ' + newDisplay.id);
  });
  screen.on('display-removed', (e, oldDisplay) => {
    alert('display-removed id: ' + oldDisplay.id);
  });
  screen.on('display-metrics-changed', (e, display, changedMetrics) => {
    alert('display-metrics-changed:\n' + changedMetrics.join('\n'));
  });

  const resizeToFitDisplay = function (window, display) {
    const {x, y, width, height} = display.workArea;
    window.setBounds({x, y, width, height});
  }

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1024,
    minHeight: 728,
    frame: true,
    center: true,
    title: 'Delight :: Technician Window'
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.once('ready-to-show', () => {
    console.log('mainWindow ready-to-show event')
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (customerWindow) customerWindow.close();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const createCustomerWindow = function () {
    customerWindow = new BrowserWindow({
      title: 'Delight :: Customer Window',
      show: false,
      minWidth: 640,
      minHeight: 480,
      frame: false,
      center: true,
      resizable: false,
      minimizable: false,
      movable: false,
      closable: true
    });
    customerWindow.loadURL(`https://stateofca.github.io/dmv-mock-phoebe/`);
  }
  createCustomerWindow();
  customerWindow.webContents.on('did-finish-load', () => {
    console.log('customerWindow did-finish-load event');
    if (!customerWindow) {
      throw new Error('"customerWindow" is not defined');
    }
    resizeToFitDisplay(customerWindow, customerDisplay);
    // customerWindow.webContents.openDevTools()
  });
  customerWindow.once('ready-to-show', () => {
    console.log('customerWindow ready-to-show event');
  });
  customerWindow.on('closed', () => {
    console.warn('customerWindow close event');
    createCustomerWindow();
  });

  ipcMain.on('show-customer-window', () => {
    console.log('show-customer-window');
    if (!customerWindow.isVisible()) {
      customerWindow.show();
      customerWindow.focus();
    }
  });

  ipcMain.on('hide-customer-window', () => {
    console.log('hide-customer-window');
    customerWindow.hide();
  });

});
