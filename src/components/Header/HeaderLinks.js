
import { Icon } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import Button from "components/CustomButtons/Button.js";
import * as firebase from "firebase/app";
import "firebase/auth";
import React from "react";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const [currentUser, updateUser] = React.useState(firebase.auth().currentUser);

  const classes = useStyles();

  firebase.auth().onAuthStateChanged(user => updateUser(user));

  function signOut() {
    firebase.auth().signOut().then(
      () => {
        console.log('signed out');
        // currentUser = null;
        if(props.history) props.history.push('/');
      },
      () => {
        console.log('logout failed');
      });
  };

  return (
    <List className={classes.list}>
      {currentUser ?
        (<ListItem className={classes.listItem}>
          <Button
            href="/settings"
            className={classes.navLink}
            color="transparent"
          >
            <Icon className={classes.icons}>settings</Icon> Settings
        </Button>
        </ListItem>) : null}
      <ListItem className={classes.listItem}>
        <div>
          {!currentUser ? (
            <Button
              href={"/login-page"}
              color="transparent"
              className={classes.navLink}
            >
              Sign In
         </Button>
          ) : (
              <Button
                onClick={() => signOut()}
                color="transparent"
                className={classes.navLink}
              >
                Sign Out
       </Button>
            )}
        </div>

      </ListItem>


    </List>
  );
}
