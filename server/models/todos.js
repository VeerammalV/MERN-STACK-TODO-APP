const mongoose = require('mongoose');

const todosSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true
    },
    completed:{
        type: Boolean, 
        default: false
    }
}) ;

const TodoModel = mongoose.model("todos", todosSchema);
module.exports = TodoModel;

