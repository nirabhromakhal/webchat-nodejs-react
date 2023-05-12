const express = require("express");
const cors = require("cors");

const PORT = 8000;

const app = express();

//middlewares
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}))
app.options('*', cors())
app.use(express.json())

// initialize firebase admin
const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccount = require('./firebase-admin-service-account/web-chat-69695-a7eb5c7478e4.json');
const {getFirestore} = require("firebase-admin/firestore");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});

//initialize supabase postgres DB
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    'https://aytnolfzvuaonlnjuduf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dG5vbGZ6dnVhb25sbmp1ZHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4NjYzNjYsImV4cCI6MTk5OTQ0MjM2Nn0.HxIpBNEgBmyPwAoMGWVCIZCXLNoKKlN0fzpBwXRMMrI'
)


// endpoints ---->

app.post("/search", async (req, res) => {
    const email = req.body.email;

    const db = getFirestore()
    const snapshot = await db.collection('users')
        .where('email', ">=", email)
        .where('email', "<=", email + '\uf8ff')
        .get()

    const users = []
    snapshot.forEach(doc => {
        users.push(doc.data())
    })
    res.send(users)
});


app.post("/send", async (req, res) => {
    const data = req.body;
    data.datetime = new Date();

    const { error } = await supabase
        .from('messages')
        .insert(data)

    res.send()
});


app.post("/messages", async (req, res) => {
    const body = req.body;
    console.log(body)

    const { data, error } = await supabase
        .from('messages')
        .select()
        .in('from', [body.email1, body.email2])
        .in('to', [body.email1, body.email2])

    console.log(data, error)
    if (error === null)
        res.send(data)
    else
        res.send(error)
});


app.get("/health", () => {
    console.log("Running");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});