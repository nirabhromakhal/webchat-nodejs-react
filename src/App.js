import './App.css';
import {Box, InputAdornment, IconButton, OutlinedInput, CircularProgress} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useState} from "react";
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
    // storeUserInFireStore()

    const [users, setUsers] = useState(null);
    const [searchEmail, setSearchEmail] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchMessage, setSearchMessage] = useState("Please search for an user email")

    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([])

    const backendUrl = "https://webchat-nodejs-react-production.up.railway.app"

    const getMessageHistory = () => {
        if (recipient === "") return
        try {
            fetch(backendUrl + "/messages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email1: user.email,
                    email2: recipient,
                }),
            }).then(response => {
                response.json().then(json => {
                    console.log(json)
                    setMessageHistory(json)
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    function openChat(email) {
        setRecipient(email);
    }

    function handleSearch(email) {
        setSearching(true)
        try {
            fetch(backendUrl + "/search", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            }).then(response => {
                response.json().then(json => {
                    setUsers(json.filter(userObj => {
                        return userObj.email !== user.email
                    }))
                })
            })
        } catch (e) {
            setSearchMessage("Error: " + e)
            setUsers(null)
        }
        setSearching(false)
    }

    function sendMessage() {
        try {
            fetch(backendUrl + "/send", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: user.email,
                    to: recipient,
                    message: message
                }),
            }).then(response => {
                setMessage("")
                getMessageHistory()
            })
        } catch (e) {
            console.log(e)
        }
    }

    function signOut() {
        //remove cookie and redirect to login
        window.sessionStorage.removeItem('user')
        window.location.href = "/login"
    }

    useEffect(() => {
        setInterval(() => {getMessageHistory()}, 2000)
    }, [])

    useEffect(() => {
        getMessageHistory()
    }, [recipient])

    return (
        <Box display="flex" flexDirection="column" width="100vw" height="100vh">
            <Box display="flex" flexDirection="row" width="100vw" height="64px" sx={{
                backgroundColor: colors.primary
            }}>
                <Box display="flex" alignItems="center" padding="10px">
                    <div style={{color: "white", fontSize: "20px", fontWeight: "bold"}}>
                        {recipient === "" ? "Select an user to chat with" : "Chatting with " + recipient}
                    </div>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="end" padding="10px" flexGrow={1}>
                    <div style={{color: "white", fontSize: "16px", marginRight: "10px"}}>{user.email}</div>
                    <IconButton onClick={signOut}
                                sx={{
                                    borderRadius: "50%",
                                    '&:hover': {
                                        backgroundColor: colors.contrastLight
                                    }
                                }}>
                        <PowerSettingsNewIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" width="100vw" height="calc(100% - 64px)">
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
                    {searching && <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                        <CircularProgress />
                    </Box>}
                    {!searching  &&  users === null  &&
                        <Box display="flex" justifyContent="center" alignItems="center" padding="20px" flexGrow={1}>
                            <div style={{textAlign: "center"}}>{searchMessage}</div>
                        </Box>
                    }
                    {!searching  &&  users !== null  &&  users.length === 0  &&
                        <Box display="flex" justifyContent="center" alignItems="center" padding="20px" flexGrow={1}>
                            <div style={{textAlign: "center"}}>Did not find any users signed into our app with given email substring</div>
                        </Box>
                    }
                    {!searching  &&  users !== null  &&  users.length !== 0  &&  <Box display="flex" flexGrow={1} sx={{overflowY: "auto"}}>
                        {users.map(user => {
                            return (
                                <Box padding="10px" width="100%" height="fit-content" onClick={() => {
                                    openChat(user.email)
                                }} sx={{
                                    backgroundColor: recipient === user.email ? colors.contrastLight : "white",
                                    '&:hover': {
                                        backgroundColor: colors.contrastLight
                                    }
                                }}>{user.email}</Box>
                            )
                        })}
                    </Box>}
                </Box>
                <Box display="flex" flexDirection="column" width="70%" height="100%" backgroundColor={colors.primaryLight}>
                    <Box display="flex" flexDirection="column" height="calc(100% - 76px)" sx={{overflowY: "auto"}}>
                        {messageHistory.map(message => {
                            if (message.from === recipient) return (
                                <Box sx={{
                                    margin: "10px",
                                    padding: "10px",
                                    width: "fit-content",
                                    maxWidth: "65%",
                                    borderRadius: "21px",
                                    backgroundColor: 'white'
                                }}>{message.message}</Box>
                            )
                            if (message.from === user.email) return (
                                <Box sx={{
                                    margin: "10px",
                                    padding: "10px",
                                    width: "fit-content",
                                    maxWidth: "65%",
                                    borderRadius: "21px",
                                    backgroundColor: 'lightyellow',
                                    alignSelf: "end",
                                }}>{message.message}</Box>
                            )
                            return null
                        })}
                    </Box>
                    <Box height="76px" padding="10px" boxSizing="border-box">
                        <OutlinedInput
                            id="message-box"
                            type="text"
                            name="message-box"
                            value={message}
                            onChange={event => setMessage(event.target.value)}
                            placeholder="Send a message"
                            fullWidth
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => sendMessage()} disabled={message === "" || recipient === ""} sx={{
                                        borderRadius: "50%",
                                        '&:hover': {
                                            backgroundColor: colors.primary
                                        }
                                    }}>
                                        <SendIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default App;
