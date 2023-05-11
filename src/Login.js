import {useEffect} from "react";
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css"
import { GoogleAuthProvider } from "firebase/auth"
import firebaseApp from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

function Login() {

    if (window.sessionStorage.getItem('user') !== null)
        window.location.href = "/";


    useEffect(() => {
        // Initialize the FirebaseUI Widget using Firebase.
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(firebaseApp));

        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    //store cookie and redirect
                    window.sessionStorage.setItem('user', JSON.stringify(authResult.user));
                    return true;
                },
                uiShown: function() {
                    document.getElementById('loader').style.display = 'none';
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: '/',
            signInOptions: [
                {
                    provider: GoogleAuthProvider.PROVIDER_ID,
                    scopes: [
                        'https://www.googleapis.com/auth/contacts.readonly'
                    ],
                    customParameters: {
                        // Forces account selection even when one account
                        // is available.
                        prompt: 'select_account'
                    }
                },
            ]
        };

        ui.start('#firebaseui-auth-container', uiConfig);
    }, [])


    return(
        <>
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </>
    )
}

export default Login;