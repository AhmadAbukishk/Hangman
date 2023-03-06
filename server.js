const express = require('express');
const bodyParser = require('body-parser');
const  fs = require('fs');
const mongoose = require('mongoose');
const { NormalModule } = require('webpack');

const app = express();

//mongoDB
const uri = 'mongodb+srv://Ahmad_Abukishk:3K2y5kjBIMw6zLSb@atlascluster.qpxnltf.mongodb.net/HangmanUsers';
mongoose.connect(uri);

const HangmanUsersSchema = new mongoose.Schema(
    {
        Name: String,
        Email: String, 
        Password:  String
    }
)


const UserGames = new mongoose.Schema(
    {
        User: String,
        Score: Number,
        Words: Number
    }
)

const User = mongoose.model('User', HangmanUsersSchema);
const Game = mongoose.model('Game', UserGames);



// for ejs
app.use(express.static("./public"));
app.set("view engine", "ejs");

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));


const letter = [['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['h', 'i', 'j', 'k', 'l', 'm', 'n'], ['o', 'p', 'q', 'r', 's', 't', 'u'], ['v', 'w', 'x', 'y', 'z']];
let logedUser = {
    logged: false,
    email: ''
};

// game route
app.get("/", (req, res)=>{
    if(logedUser.logged === false) res.redirect("/login")
    res.render("Menu")    
})

app.get("/game", (req, res)=>{
    res.render("game",  {letters: letter})
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.get("/standings", (req, res)=> {
    Game.find().sort({Score: -1}).sort({Words: -1}).limit(5).exec((err, games)=> {
        console.log(games);
        res.render("standings", {games: games});
    });

})

app.post("/", (req, res)=>{
    let page = req.body.button;
    res.redirect("/" + page);
})


app.post("/login", (req, res)=>{

    const email = req.body.email;
    const pass = req.body.password;
    
    User.findOne({Email: email}, (err, user)=>{
        
        if(!err){
            if(user !== null && user.Password === pass) {
                logedUser.logged = true;
                logedUser.email = user.Email
                res.redirect('/')
            } else {
                res.redirect("/login")
            }

        } else {
            console.log('something went wrong');
        }
    })
})


app.post("/register", (req, res)=> {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;

    User.findOne({Email: email}, (err, user)=>{
        if(!err){
            if(user === null){
                const  newUser = new User( 
                    {
                        Name: name,
                        Email: email,
                        Password: pass
                    }
                )

                newUser.save();
                res.redirect("/login");
            } else {
                res.redirect("/register")
            }
        }
    })
})

app.post("/toRegister", (req, res)=> {
    res.redirect("/register");
})


app.post("/finish", (req, res)=>{
    const score = req.body.score;
    const words = req.body.words;

    User.findOne({Email: logedUser.email}, (err, user)=>{
        if(!err){ 
            console.log(user)
            const game = new Game(
                {
                    User: user.Email,
                    Score: score,
                    Words: words
                }
            )
            console.log(game);
            game.save();
            res.redirect("/");
        }
    })

    

})

app.post("")


// creating a server
app.listen(3000, ()=>{
    console.log("Server on");
})