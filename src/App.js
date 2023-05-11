import './App.css';
import {Box, InputAdornment, IconButton, OutlinedInput} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useState} from "react";
import colors from "./colors";

function App() {
    const user = window.sessionStorage.getItem('user')
    if (user === null)
        window.location.href = "/login";

    const [users, setUsers] = useState([
        {email: "a"},
        {email:"b"}
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
            text: "I am fine"
        }
    ])

    function openChat(email) {
        setRecipient(email);
    }

    function handleSearch(email) {

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
                            <IconButton onClick={() => handleSearch(searchEmail)} disabled={searchEmail === ""} sx={{
                                borderRadius: "50%",
                                '&:hover': {
                                    backgroundColor: colors.contrastLight
                                }
                            }}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>
            <Box>
                {users.map(user => {
                    return(
                        <Box padding="10px" onClick={() => {openChat(user.email)}} sx={{
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
                    if (message.from === user.email) return(
                        <Box padding="10px">{message.text}</Box>
                    )
                    return (
                        <Box padding="10px">{message.text}</Box>
                    )
                })}
            </Box>
            <Box height="76px" padding="10px" boxSizing="border-box">
                <OutlinedInput
                    id="search-box"
                    type="text"
                    name="search-box"
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Send a message"
                    borderRadius="20px"
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => sendMessage()} disabled={message === ""} sx={{
                                borderRadius: "50%",
                                '&:hover': {
                                    backgroundColor: colors.primary
                                }
                            }}>
                                <SearchIcon />
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
