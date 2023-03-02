const express = require('express');
const bodyParser = require('body-parser');
const  fs = require('fs');

const app = express();

// for ejs
app.use(express.static("./public"));
app.use(bodyParser.json())
app.set("view engine", "ejs");

const letter = [['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['h', 'i', 'j', 'k', 'l', 'm', 'n'], ['o', 'p', 'q', 'r', 's', 't', 'u'], ['v', 'w', 'x', 'y', 'z']];
 

// game route
app.get("/", (req, res)=>{
    res.render("game", {letters: letter})
    // fs.readFile("./words.json", "utf8", (err, data)=>{        
    //     if(!err){
    //         const words = JSON.parse(data);
        
    //         console.log(words);
    //     }
    // });
    
    
})

app.post("/", (req, res)=>{
    const jsonData = JSON.parse("words.json");
    console.log(jsonData.words[3]);


})

// creating a server
app.listen(3000, ()=>{
    console.log("Server on");
})