// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './WindowTest.css';
import { ipcRenderer } from 'electron';

export default class WindowTest extends Component {
  render() {
    const showCustomerWindow = (e) => {
      ipcRenderer.send('show-customer-window');
    };
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.container} data-tid="container">
          <img className={styles.logo} src="../resources/images/dmvlogo.png" />
          <h2>Technician Window</h2>
          <p><button onClick={showCustomerWindow}>Confirm Address</button></p>
        </div>
      </div>
    );
  }
}
