import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import * as firebase from "firebase/app";
import "firebase/auth";
import React from "react";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  // const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  // setTimeout(function () {
  //   setCardAnimation("");
  // }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="Sibling Secret Santa"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          // backgroundImage: "url(" + image + ")",
          backgroundColor: "#cc3333",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>

              <CustomTabs
                headerColor="primary"
                tabs={[
                  {
                    tabName: "Login",
                    tabContent: (
                      <div>
                        <CustomInput
                          labelText="Email..."
                          id="loginEmail"
                          name="loginEmail"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "email",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Email className={classes.inputIconsColor} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <CustomInput
                          labelText="Password"
                          id="loginPass"
                          name="loginPass"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "password",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  lock_outline
                            </Icon>
                              </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                        />
                      </div>
                    ),
                    tabFooter: (
                      <Button type="submit" simple color="primary" size="lg">
                        Login
                    </Button>
                    ),
                    handleSubmit: (event) => {
                      // console.log("submit fired");
                      event.preventDefault();
                      const data = new FormData(event.target);

                      const email = data.get('loginEmail');
                      const password = data.get('loginPass');

                      firebase.auth().signInWithEmailAndPassword(email, password).then(
                        cred => {
                          props.history.push('/');
                        },
                        rejected => {
                          console.log('rejected');
                          console.log(rejected);
                        }
                      ).catch(error => {
                        // console.log(error);
                      });
                    }
                  },
                  {
                    tabName: "Sign up",
                    tabContent: (
                      <div>
                        <CustomInput
                          labelText="First Name..."
                          id="first"
                          name="first"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            endAdornment: (
                              <InputAdornment position="end">
                                <People className={classes.inputIconsColor} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <CustomInput
                          labelText="Email..."
                          id="email"
                          name="email"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "email",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Email className={classes.inputIconsColor} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <CustomInput
                          labelText="Password"
                          id="pass"
                          name="pass"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "password",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  lock_outline
                            </Icon>
                              </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                        />
                      </div>
                    ),
                    tabFooter: (
                      <Button type="submit" simple color="primary" size="lg">
                        Sign up
                    </Button>
                    ),
                    handleSubmit: (event) => {
                      event.preventDefault();
                      const data = new FormData(event.target);

                      const name = data.get('first');
                      const email = data.get('email');
                      const password = data.get('pass');

                      firebase.auth().createUserWithEmailAndPassword(email, password).then(
                        cred => {
                          return cred.user.updateProfile({
                            displayName: name
                          }).then(() => {
                            return firebase.firestore().collection('users').doc(cred.user.uid).set({
                              displayName: name,
                              partner: '',
                              recipient: '',
                              ready: false
                            })

                          })
                        },
                        rejected => {
                          console.log(rejected);
                        }
                      ).then(() => {
                        props.history.push('/');
                      });
                    }
                  }
                ]}
              />
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
