import {useEffect} from "react";
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css"
import { GoogleAuthProvider } from "firebase/auth"
import firebaseApp from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

function Login() {

    useEffect(() => {
        // Initialize the FirebaseUI Widget using Firebase.
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(firebaseApp));

        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
                uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
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