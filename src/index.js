import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import GameBoard from "views/GameBoard/GameBoard.js";
import Settings from "views/Settings/Settings";

// font
import './assets/fonts/DancingScript-Regular.ttf'
import './assets/fonts/DancingScript-Bold.ttf'

// Firebase
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

var hist = createBrowserHistory();

// Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyAlqCuu5SX-IKg2zKoFjejAZWIjenz0A-k",
  authDomain: "secret-santa-6d765.firebaseapp.com",
  databaseURL: "https://secret-santa-6d765.firebaseio.com",
  projectId: "secret-santa-6d765",
  storageBucket: "secret-santa-6d765.appspot.com",
  messagingSenderId: "1058483715482",
  appId: "1:1058483715482:web:7b4bf2318bd41f8fe7ce23",
  measurementId: "G-DNJFGB07RT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// firestore constants
// const auth = firebase.auth();
// const db = firebase.firestore();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/settings" component={Settings} />
      <Route path="/game-board" component={GameBoard} />
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/" component={Components} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
