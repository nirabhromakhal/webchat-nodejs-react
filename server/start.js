const express = require("express");
const cors = require("cors");

const PORT = 8000;

const app = express();

//middlewares
app.use(cors())
app.use(express.json())

// initialize firebase admin
const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccount = require('./firebase-admin-service-account/web-chat-69695-a7eb5c7478e4.json');
const {getFirestore} = require("firebase-admin/firestore");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});


// endpoints ---->

app.post("/search", async (req, res) => {
    const email = req.body.email;

    const db = getFirestore()
    const snapshot = await db.collection('users')
        .where('email', ">=", email)
        .where('email', "<=", email + '\uf8ff')
        .get()

    const emails = []
    snapshot.forEach(doc => {
        emails.push(doc.data().email)
    })
    res.send({emails: emails})
});

app.get("/hello", () => {
    console.log("Hello")
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});