// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <img className={styles.logo} src="../resources/images/dmvlogo.png" />
          <h2>Main Technician Window</h2>
          <p><Link to="/multiwindow">Multi-window Example</Link></p>
          <p><Link to="/counter">Counter Example</Link></p>

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
