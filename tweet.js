let mongoose=require('mongoose')

// use mongoose to initialise schema 
let mongoSchema= mongoose.Schema

// use mongoSchema to create reference to the tweet collection 
let tweet = new mongoSchema({
    "message": String,
    "author":String,
    "likes":Number,
    "dislikes":Number,
    "videoID":String,
}, {
    collection:"tweet"
})
// param 1: response model, param 2: collection origin 


// export the model 
module.exports=mongoose.model("tweetmodel",tweet)