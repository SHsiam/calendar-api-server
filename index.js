const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.Port || 3000
const {google} = require('googleapis')

const REFRESH_TOKEN="1//0g92l4ofgCJflCgYIARAAGBASNwF-L9Ir8qmGj9812yRj8rLSaDRPSB6ewhek9rQ_NWrhmdSN1LjCltpEGqpMBA24fG3CbW-r7MA"
const GOOGLE_CLIENT_ID='632642552532-vgm8vdur0ql3nbt52d2qfn0ajaqrkqdd.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET='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'

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:5173'
)

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/create-tokens',async(req,res,next)=>{
    try{
        const {code}= req.body
        const {tokens}=await oauth2Client.getToken(code)
        res.send(tokens)
    }catch(e){
        next(e)
    }
})

app.post('/create-event',async(req,res,next)=>{
    try{
        const {summary,description,location,startDateTime,endDateTime}=req.body
        console.log(summary,description,location,startDateTime,endDateTime);

        oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

        const calender=google.calendar('v3')
        const response= await calender.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody:{
                summary:summary,
                description: description,
                location: location,
                // colorId: '7',
                start:{
                    dateTime: new Date(startDateTime),
                },
                end: {
                    dateTime: new Date(endDateTime),
                }
            }
        })
        res.send(response)
    }catch(e){
        next(e)
    }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})