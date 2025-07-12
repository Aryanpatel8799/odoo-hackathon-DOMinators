import app from "./app.js";
import http from "http";
import ratingRoutes from './routes/rating.routes.js';
const server = http.createServer(app);

server.listen(process.env.PORT || 3000,()=>{
    console.log('server is running on port', process.env.PORT || 3000);
})

app.use('/api/ratings',ratingRoutes);