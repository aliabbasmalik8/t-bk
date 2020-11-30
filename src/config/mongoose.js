import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/test2', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).catch(error => console.log(error))
