// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './CustomerWindow.css';
import { ipcRenderer } from 'electron';

export default class customerWindow extends Component {
  render() {
    const confirm = (e) => {
      ipcRenderer.send('hide-customer-window');
    };
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <img className={styles.logo} src="../resources/images/dmvlogo.png" />
          <h2>Please confirm your address</h2>
          <div>
            <textarea>
              505 Rhode Island Ave NW
              Washington, DC 20001
            </textarea>
            <p>
              <button className={styles.correct} onClick={confirm}>Correct</button>
              <button className={styles.incorrect} onClick={confirm}>Incorrect</button>
            </p>
          </div>
          <small>
            We are using node {process.versions.node},
            Chromium {process.versions.chrome},
            and Electron {process.versions.electron}.
          </small>
        </div>
      </div>
    );
  }
}
