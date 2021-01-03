const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const bookRouter = require('./routers/bookRouter');
const costumerRouter = require('./routers/costumerRouter');
const port = process.env.PORT;
const app = express();
require('./db/mongoose');

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(bookRouter);
app.use(costumerRouter);



app.listen(port,()=>{
    console.log('Server is connected. port: ',port);
});