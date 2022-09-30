import Express from "express";
import { readFile, readFileSync } from "fs";


const port = process.env.PORT || 9090;
const hostname = '127.0.0.1';

const app = Express();

class Game{
    constructor(name, year, URL){
        this.name= name;
        this.year = year;
        this.link =  URL;
    }
}


const getGames = (clb) => {
    readFile("./SteamGames.json", (err,data)=>{
        if(err){
            clb(err, null)
        }
        const list = JSON.parse(data);
        const games = list.map((el) => new Game(el.Game, el.Year, el.GameLink));
       clb(null, games)
    })
}

app.get('/game', (req,res)=>{

    getGames((err,data)=>{
        if(err){
            return res.status(404).send(err)
        }
        res.json(data)
    })

    // readFile("./SteamGames.json", (err,data)=>{
    //     if(err){
    //         return res.status(404).send(err)
    //     }
        
    //     const list = JSON.parse(data);
    //     const games = list.map((el) => new Game(el.Game, el.Year, el.GameLink));
    //     res.json(games)
    // })
});

app.get("/game/select/:year" , (req,res)=>{
    const year = +(req.params.year)
    getGames((err,data)=>{
        if(err){
            return res.status(404).send(err)
        }
        const games = data.filter((el) => el.year > year);
        res.status(200).json(games)
    })
})

app.get("/game/:name" , (req,res)=>{
    const name = req.params.name
    getGames((err,data)=>{
        if(err){
            return res.status(404).send(err)
        }
        const game = data.find((el) => el.name === name);
        res.status(200).json(game)
    })
})


app.listen(port, hostname, ()=>{
    console.log(`Server is running on http://${hostname}:${port}`);
})