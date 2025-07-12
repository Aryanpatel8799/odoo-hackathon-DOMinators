import express from "express"
import cors from "cors"
import connectToDb from "./db/connectToDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js"
import swapRouter from "./routes/swap.routes.js"
import adminRouter from "./routes/admin.routes.js"
import apiError from "./utils/apiError.js"
const app = express()

//db connection

//Middlewares
app.use(cors({
    origin:["http://localhost:5173","*","https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?as=rE6MGNLyO6vbK87UlddBDDdBVGJg7x2dYqVmCj0WsHI&client_id=1049761690648-j4f0iotno6epi3etm1v7u4s3q67loc6b.apps.googleusercontent.com&scope=openid%20email%20profile&response_type=id_token&gsiwebsdk=gis_attributes&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_mode=form_post&origin=http%3A%2F%2Flocalhost%3A5173&display=popup&prompt=select_account&gis_params=ChVodHRwOi8vbG9jYWxob3N0OjUxNzMSFWh0dHA6Ly9sb2NhbGhvc3Q6NTE3MxgHKityRTZNR05MeU82dmJLODdVbGRkQkREZEJWR0pnN3gyZFlxVm1DajBXc0hJMkkxMDQ5NzYxNjkwNjQ4LWo0ZjBpb3RubzZlcGkzZXRtMXY3dTRzM3E2N2xvYzZiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tOAFCQDU4ZjcwZjUzZjlmYWFlMWI0MTgwZjQyMzM2YjliNGVhOWY3ZWIzOTI4MTYyODA1MWQzYzM0YTJiZTFiOWE5MmU&service=lso&o2v=1&flowName=GeneralOAuthFlow","http://localhost:4028"],
    credentials: true  
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
app.use('/api/v1/user',userRouter)
app.use('/api/v1/swap',swapRouter)
app.use('/api/v1/admin',adminRouter)

//error handling middleware
app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.message=err.message || "Something went wrong"
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:process.env.NODE_ENV === "development" ? err.stack : {}
    })
})

export default app