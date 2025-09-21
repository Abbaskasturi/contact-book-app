const express = require("express"); 
const dbInitialize = require("./db"); 
const app = express(); 
const cors = require("cors");
app.use(express.json()); 
app.use(cors());


let db; 

const startServer = async () => {
    db= await dbInitialize(); 
    const contactTable = `
        CREATE TABLE IF NOT EXISTS contactsbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT,
            email TEXT, 
            phone TEXT
        )
    `; 
    await db.run(contactTable); 
    console.log("Contacts table created "); 
    app.post("/contacts", async (request, response) => {
        try{
        const {name, email, phone} = request.body; 
        const newContact = `
            INSERT INTO 
            contactsbook (name, email, phone)
            VALUES
            (
                ?,?,?
            )
        `; 
        await db.run(newContact, [name, email, phone]);
        response.status(201).send("contact added successfully"); 
        }catch(error){
           console.log("fail to insert contact", error.message); 
           response.status(500).send("fail to add the contact details"); 
        }
    }); 
    app.get('/contacts', async (request, response) => {
        const limit = parseInt(request.query.limit) || 10; 
        const offset = parseInt(request.query.offset) || 0; 
        try{
            const dbresults = `
            SELECT * FROM contactsbook
            LIMIT ? OFFSET ?
        `; 
        const query = await db.all(dbresults, [limit, offset]); 
        response.status(201).json({ contacts: query }); 
        }catch(error){
            response.status(500).send("fail to fetch the contacts details", error.message); 
        }

    })
    app.delete('/contacts/:id', async (request, response) => {
        const { id } = request.params; 
        try{
            const deleteQuery = `
                DELETE FROM contactsbook 
                WHERE id = ? 
            `; 
            const results = await db.run(deleteQuery, [id]); 
            response.status(201)
            response.send("Contact deleted successfully"); 
        }catch(error){
            response.status(500); 
            response.send("fail to delete the conatct", error.message); 
        }


    })
     app.listen(5000, () => {
        console.log("server is running at http://localhost:5000"); 
    });
}; 

startServer(); 