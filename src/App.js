import './App.css';
import {Box, InputAdornment, IconButton, OutlinedInput} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useState} from "react";
import colors from "./colors";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import firebaseApp from "./FirebaseConfig";

function App() {
    let user = window.sessionStorage.getItem('user')
    if (user === null)
        window.location.href = "/login";
    else
        user = JSON.parse(user)

    //store user in Firestore
    const firestore = getFirestore(firebaseApp)
    const storeUserInFireStore = async () => {
        const userObj = {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber || null,
            photoURL: user.photoURL || null,
            uid: user.uid
        }
        await setDoc(doc(firestore, 'users', user.uid), userObj)
    }
    storeUserInFireStore().then()

    const [users, setUsers] = useState([
        {email: "a"},
        {email: "b"}
    ]);
    const [searchEmail, setSearchEmail] = useState("");

    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");
    const [messageHistory, setmessageHistory] = useState([
        {
            from: "nirabhromakhal@gmail.com",
            to: "a",
            text: "hi"
        },
        {
            to: "nirabhromakhal@gmail.com",
            from: "a",
            text: "I am fine aaaaaaaaaaaaaaaaaaaa kasdk laksd adksla la olakdak dlaksdla dlaksdlak dkdaokdpkadpk oakdpkapd akdpakdk padkpa pakdpakd pakd"
        }
    ])

    const backendUrl = "http://localhost:8000"

    function openChat(email) {
        console.log(email)
        setRecipient(email);
    }

    async function handleSearch(email) {
        try {
            const matchedUsers = await fetch(backendUrl + "/search", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            })

            console.log(matchedUsers)
        } catch (e) {
            setUsers([])
        }
    }

    function sendMessage() {

    }

    return (
        <Box display="flex" flexDirection="row" width="100vw" height="100vh">
            <Box display="flex" flexDirection="column" width="30%" height="100%">
                <Box padding="10px">
                    <OutlinedInput
                        id="search-box"
                        type="text"
                        name="search-box"
                        size="small"
                        onChange={event => setSearchEmail(event.target.value)}
                        placeholder="Search for an user email"
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleSearch(searchEmail)} disabled={searchEmail === ""}
                                            sx={{
                                                borderRadius: "50%",
                                                '&:hover': {
                                                    backgroundColor: colors.contrastLight
                                                }
                                            }}>
                                    <SearchIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Box>
                <Box>
                    {users.map(user => {
                        return (
                            <Box padding="10px" onClick={() => {
                                openChat(user.email)
                            }} sx={{
                                '&:hover': {
                                    backgroundColor: colors.contrastLight
                                }
                            }}>{user.email}</Box>
                        )
                    })}
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" width="70%" height="100%" backgroundColor={colors.primaryLight}>
                <Box display="flex" flexDirection="column" height="calc(100% - 76px)">
                    {messageHistory.map(message => {
                        console.log(recipient)
                        if (message.from === user.email) return (
                            <Box sx={{
                                margin: "10px",
                                padding: "10px",
                                width: "fit-content",
                                maxWidth: "65%",
                                borderRadius: "21px",
                                backgroundColor: 'white'
                            }}>{message.text}</Box>
                        )
                        if (message.from === recipient) return (
                            <Box sx={{
                                margin: "10px",
                                padding: "10px",
                                width: "fit-content",
                                maxWidth: "65%",
                                borderRadius: "21px",
                                backgroundColor: 'lightyellow',
                                alignSelf: "end",
                            }}>{message.text}</Box>
                        )
                        return null
                    })}
                </Box>
                <Box height="76px" padding="10px" boxSizing="border-box">
                    <OutlinedInput
                        id="message-box"
                        type="text"
                        name="message-box"
                        onChange={event => setMessage(event.target.value)}
                        placeholder="Send a message"
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => sendMessage()} disabled={message === ""} sx={{
                                    borderRadius: "50%",
                                    '&:hover': {
                                        backgroundColor: colors.primary
                                    }
                                }}>
                                    <SearchIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default App;
