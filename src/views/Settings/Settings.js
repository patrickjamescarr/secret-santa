import { NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import * as firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";


const useStyles = makeStyles(styles);

function getUserOptions(users) {
    let options = [];
    if (users) {
        users.forEach(user => {
            options.push(<option key={user.id} value={user.id}>{user.data().displayName}</option>);
        });
    }
    return options;
}

const setUserReady = (user, partner) => {
    firebase.firestore().collection('users').doc(user.id).set({
        displayName: user.data().displayName,
        partner: partner,
        ready: true,
        recipient: ''
    }).then(() => {
        console.log('user updated!');
    });
}

export default function Settings(props) {
    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = React.useState();
    const [selectedPartner, setSelectedPartner] = React.useState('');

    React.useEffect(() => {

        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                props.history.push('/');
                return;
            }
            var usersRef = firebase.firestore().collection('users');
            usersRef.get().then(allUsers => {
                allUsers.forEach(doc => {
                    if (doc.id === user.uid) {
                        setCurrentUser(doc);
                        setSelectedPartner(doc.data().partner);

                        firebase.firestore().collection('users').doc(user.uid)
                            .onSnapshot(function (doc) {
                                setCurrentUser(doc);
                            });

                    } else {
                        setUsers(x => x.concat(doc));
                    }
                });
            });
        });


    }, []);

    setTimeout(function () {
        setCardAnimation("");
    }, 700);
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
                    backgroundColor: "#cc3333",
                    backgroundSize: "cover",
                    backgroundPosition: "top center"
                }}
            >
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]}>
                                <form className={classes.form}>
                                    <CardHeader color="primary" className={classes.cardHeader}>
                                        <h4>{currentUser ? <span>{currentUser.data().displayName}'s </span> : null}Settings</h4>
                                    </CardHeader>
                                    <CardBody style={{ marginBottom: 1 + 'em' }}>
                                        <p style={{ fontFamily: 'Roboto', marginTop: 1 + 'em' }}>You can select one person to be excluded as a potential recipient if you wish. To do so use the drop down below. If you don't see them in there, give them a nudge and tell them to get signed up!</p>
                                        <label style={{ marginRight: 1 + 'em' }}>Please exclude: </label>
                                        <NativeSelect
                                            disabled={currentUser && currentUser.data().ready}
                                            value={selectedPartner}
                                            onChange={event => {
                                                console.log(event.target.value);
                                                setSelectedPartner(event.target.value);
                                            }}
                                            name="pertnerSelect"
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'partner' }}
                                        >
                                            <option key='none' value='none'>Nobody :)</option>
                                            {getUserOptions(users)}

                                        </NativeSelect>
                                        <p style={{ fontFamily: 'Roboto', marginTop: 1 + 'em' }}>When you're happy with your settings click the 'I'm Ready!' button below to lock them in. Once you've done this you will no longer be able to make changes.</p>
                                    </CardBody>
                                    <CardFooter className={classes.cardFooter}>

                                        <Button disabled={currentUser && currentUser.data().ready} onClick={() => setUserReady(currentUser, selectedPartner)} simple style={{ color: '#fffff', backgroundColor: '#4caf50' }}>
                                            I'm Ready!
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
                <Footer whiteFont />
            </div>
        </div>
    );
}
