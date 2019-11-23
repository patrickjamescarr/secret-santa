
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/views/components.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import * as firebase from "firebase/app";
import "firebase/auth";
import React from "react";


const useStyles = makeStyles(styles);

export default function Components(props) {
  const [currentUser, updateUser] = React.useState(firebase.auth().currentUser);
  const classes = useStyles();
  const { ...rest } = props;

  firebase.auth().onAuthStateChanged(user => updateUser(user));

  return (
    <div>
      <Header
        brand="Sibling Secret Santa"
        rightLinks={<HeaderLinks {...props} />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax image={require("assets/img/bg3.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                {currentUser ? <div><p>Hi {currentUser.displayName}!</p><p>Welcome to...</p> </div> : <p></p>}

                <h1 className={classes.title}>Sibling Secret Santa.</h1>
                <h3 className={classes.subtitle}>
                  <br />
                  {currentUser ? <Button color="transparent" className={classes.navLink} onClick={() => props.history.push('/game-board')}>Begin</Button> : null}

                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <Footer />
    </div >
  );
}
