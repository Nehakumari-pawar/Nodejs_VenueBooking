const express=require('express');
const app=express();
port=process.env.PORT;

require("../src/db/conn")
const usersRoute=require('./routers/user')
const usersdata=require("../src/models/users")
const venuedata=require("../src/models/venue")
const venueRoute=require("./routers/venueRoute")



app.use(express.json())
app.use(usersRoute);
app.use(venueRoute)


app.listen(port,()=>{
    console.log(`connection is live at portno ${port}`)
}
)