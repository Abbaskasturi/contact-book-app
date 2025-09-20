
const path= require("path"); 
const {open} = require("sqlite"); 
const sqlite3 = require("sqlite3"); 


const dbPath = path.join(__dirname, 'contacts.db'); 

const dbInitialize = async () => {
    try{
       const db= await open({
            filename: dbPath, 
            driver: sqlite3.Database,
        });
       console.log("Database connected"); 
       return db; 
    }catch(error){
        console.log(`DB ERROR: ${error.message}`); 
        process.exit(1); 
    }
}

module.exports = dbInitialize; 