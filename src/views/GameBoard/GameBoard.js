
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/views/components.js";
import Footer from "components/Footer/Footer.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import * as firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";

const useStyles = makeStyles(styles);

export default function GameBoard(props) {
    const classes = useStyles();
    const { ...rest } = props;

    // const [cardAnimaton, setCardAnimation] = useState("cardHidden");

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    // const [selectedPartner, setSelectedPartner] = useState('');

    var matchedUsers = [];

    React.useEffect(() => {

        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                return;
            }
            var usersRef = firebase.firestore().collection('users');
            usersRef.get().then(allUsers => {
                allUsers.forEach(doc => {
                    if (doc.id === user.uid) {
                        setCurrentUser(doc)
                    }

                    console.log("updating users");
                    setUsers(x => x.concat(doc));

                });
            });
        });
    }, []);

    function generateCandidate() {
        return selectedUsers[Math.ceil(Math.random() * selectedUsers.length) - 1];
    }

    function generateMatches() {

        matchedUsers = [];

        var success = true;
        selectedUsers.forEach(userId => {
            success = success && findMatch(userId);
        });

        if (!success) {
            generateMatches();
        } else {

            users.forEach(user => {
                console.log(user);
                firebase.firestore().collection('users').doc(user.id).set({
                    displayName: user.data().displayName,
                    isAdmin: user.data().isAdmin ? user.data().isAdmin : false,
                    partner: user.data().partner,
                    ready: user.data().ready,
                    recipient: user.recipient ? user.recipient : ''
                }).then(() => {
                    console.log('user updated!');
                });
            });


        }


    }

    let findMatch = (userId) => {
        let candidate = generateCandidate();
        console.log('trying with ' + candidate);
        // console.log('v');
        let matchAttempts = [candidate];

        const user = users[users.findIndex(x => x.id === userId)];

        // console.log('Already Matched :');
        // console.log(matchedUsers.includes(candidate));

        // console.log('Is slef: ');
        // console.log(userId == candidate);

        // console.log('Is partner: ');
        // console.log(user.data().partner == candidate);


        while (matchedUsers.includes(candidate) || user.data().partner == candidate || userId == candidate) {
            // console.log('generating new candidate....');

            candidate = generateCandidate();

            if (!matchAttempts.includes(candidate)) {
                matchAttempts.push(candidate);
            }

            if (matchAttempts == selectedUsers.length || matchedUsers.length >= selectedUsers.length) {
                // console.log('cant work - trying agin....');
                return false;
            }
        }

        matchedUsers.push(candidate);

        user.recipient = candidate;


        setUsers(prevObjs => (prevObjs.map((o) => {
            //console.log(o);
            if (o.id === userId) {
                o.data().recipient = candidate;
                console.log(o);
                return o;
            }
            return o;
        })))

        // console.log(user.data().displayName + " matched with " + users[users.findIndex(x => x.id === candidate)].data().displayName);
        // console.log('-----------------------------------------------------------');
        return true;
    }

    // console.log(user.data().displayName + '\'s partner is ' + user.data().partner);
    // console.log('Is partner: ' + user.data().partner + ' === ' + candidate + '  ?? ');
    // console.log(user.data().partner == candidate);
    // console.log('-----------------------------------------------------------');
    // console.log('Is slef: ' + user.id + ' === ' + candidate + '  ?? ');
    // console.log(user.id == candidate);
    // console.log('-----------------------------------------------------------');


    function handleUserSelection(id) {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(x => x.filter((_, i) => i !== selectedUsers.indexOf(id)))
        }
        else {
            setSelectedUsers(x => x.concat(id));
        }
    }

    function getUserCheckboxes() {
        let checkboxes = [];
        if (users) {
            users.forEach(user => {
                var label = user.data().displayName + ' : ' + (user.data().ready ? 'Ready!' : 'Not ready');
                checkboxes.push(<div key={user.id}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                key={user.id}
                                disabled={!user.data().ready}
                                onChange={() => handleUserSelection(user.id)}
                                color="primary"
                            />
                        }
                        classes={{ label: classes.label, root: classes.labelRoot }}
                        label={label}

                    /></div>);
            });
        }
        return checkboxes;
    }

    function displayAdminArea() {
        if (currentUser && currentUser.data().isAdmin) {
            return (<div><div style={{ backgroundColor: 'white', borderRadius: 1 + 'em', padding: 1 + 'em' }}>{getUserCheckboxes()}</div>
                <Button onClick={() => generateMatches(currentUser)}>Generate Matches</Button></div>);
        }
    }

    function displayResults() {


        if (users && currentUser && currentUser.data().recipient) {
            var recipient = users[users.findIndex(x => x.id == currentUser.data().recipient)];
            if (recipient && recipient.data())
                return (
                    <div className={classes.brand} style={{ fontSize: 1.5 + 'em' }}>
                        <div><p>Woohooooooo!</p><p>You've got...</p> {recipient.data().displayName }</div>

                        <h1 className={classes.title}></h1>
                    </div>
                );
        }

        return (
            <div className={classes.brand}>
                <div>Waiting for results to be drawn. Please be patient!</div>
            </div>
        );
    }

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
            <Parallax>
                <div className={classes.container}>
                    {displayAdminArea()}
                    {displayResults()}
                </div>

            </Parallax>
            <Footer />
        </div>
    );
}
