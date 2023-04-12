let express = require('express')
let mongoose=require('mongoose')
let tweet=require('./tweet')
let cors=require('cors')

// create express app 
let app =express()

// configure cors 
// cors parameter - IPs allowed 
app.use(cors())

// configure express to use req & res in json format 
app.use(express.json())

// define connection string - database connection 
let conString="mongodb+srv://MongoUser:MongoPassword@softwareengineeringb9.flwmo8v.mongodb.net/softwareb9"
// open the connection to mongodb database 
mongoose.connect(conString)
// get reference to connection 
let db = mongoose.connection
// verify if connection was successful 
db.once("open",()=>{
    console.log('connected to mongodb database')
})

// endpoint  -> http://localhost:8888
app.get("/",(request, response) => {
    console.log("Incoming request");
    // tells you who sent request 
    console.log(request.url);
    // send back response
    response.json({
        "message":"GET request received for / endpoint"
    })
})

// endpoint  -> http://localhost:8888/welcome
app.get("/welcome",(request, response) => {
    console.log("Incoming request");
    // tells you who sent request 
    console.log(request.url);
    // send back response
    response.json({
        "message":"GET request received for /welcome endpoint"
    })
})

app.post("/welcome",(req, res)=>{
    console.log("Outgoing response");
    console.log(req.url);
    console.log(req.body);
    // send response
    res.json({
        "message":"POST request received for /welcome endpoint",
        "received":req.body
    })
})

// api to interact with mongodb 

// get list of tweets from db 
app.get('/tweets/all',(req,res)=>{
    console.log('getting all tweets')
    tweet.find({})
        .then((data)=>{
            console.log(data)
            res.json(data)
        })
        .catch((error)=>{
            console.log(error)
            res.json(error)
        })
})

// create tweet to database
app.post("/tweets/new",(req,res)=>{
    console.log('new tweet posted to db')
    console.log(req.body)
    // transfer values from request body to New Tweet 
    let newTweet=new tweet()
    newTweet.message=req.body.message
    newTweet.author=req.body.author
    newTweet.likes=req.body.likes
    newTweet.dislikes=req.body.dislikes
    newTweet.videoID=req.body.videoID
    // save newTweet in DB 
    newTweet.save()
        .then((data)=>{
            res.json(data)
            console.log('tweet saved!')
        })
        .catch((error)=>{
            res.json(error)
            console.log('something went wrong')
        })
})

// get tweet by ID 
app.get("/tweets/:id",(req,res)=>{
    console.log('getting tweet ID from DB')
    console.log(req.params.id);
    tweet.findById(req.params.id)
        .then((data)=>{
            res.json(data)
        })
        .catch((error)=>{
            res.json(error)
        })
})

// delete tweet by ID
app.delete("/tweets/delete/:id",(req,res)=>{
    console.log('getting delete request')
    console.log(req.params.id)
    tweet.findByIdAndDelete(req.params.id)
        .then((data)=>{
            console.log(data)
            console.log('delete successful')
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
            console.log('delete unsuccessful')
            res.json(err)
        })
})

// find tweet by ID and increase likes
app.put("/tweets/likes/:id", (req, res)=>{
    console.log('find tweet by ID and + like ')
    console.log(req.params.id)
    // find tweet by ID 
    tweet.findById(req.params.id)
        .then((data)=>{
            console.log(data)
            // res.json(data)
            // increase likes by 1
            console.log('updating...')
            tweet.findByIdAndUpdate(req.params.id,
                                    {"likes":data.likes+1},
                                    {new:true})
                .then((dataU)=>{
                    console.log(dataU)
                    console.log('like+1')
                    res.json(dataU)
                })
                .catch((err)=>{
                    console.log(err)
                    res.json(err)
                })
        })
        .catch((error)=>{
            console.log(error)
            res.json(error)
        })
})

app.put("/tweets/dislikes/:id", (req, res)=>{
    console.log('find tweet by ID and + dislikes')
    console.log(req.params.id)
    // find tweet by ID 
    tweet.findById(req.params.id)
        .then((data)=>{
            console.log(data)
            // res.json(data)
            // increase dislikes by 1
            console.log('updating...')
            tweet.findByIdAndUpdate(req.params.id,
                                    {"dislikes":data.dislikes+1},
                                    {new:true})
                .then((dataU)=>{
                    console.log(dataU)
                    console.log('dislikes+1')
                    res.json(dataU)
                })
                .catch((err)=>{
                    console.log(err)
                    res.json(err)
                })
        })
        .catch((error)=>{
            console.log(error)
            res.json(error)
        })
})

// define a port for API to run in 
let PORT = 8888
app.listen(PORT, ()=>{
    console.log(`Listening on port:${PORT}`);
})  