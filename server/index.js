const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const excelJS = require('exceljs');
const { jsPDF } = require("jspdf");

const TodoModel = require('./models/todos');

const app = express();
app.use(express.json());
app.use(cors());

const port = 5000;
app.use("/api", TodoModel);

//Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/TodoList');

// Get data 
app.get('/get', (req,res)=>{
    const newTodo = req.body;

    console.log(req.body);
    console.log('get')
    TodoModel.find(newTodo)
    .then(result => res.json(result))
    .catch(err => res.json(err));
  })

//Post or Create data
app.post('/add', (req,res)=>{
    const newTodo = req.body;

    console.log(req.body)
    console.log('added')
    TodoModel.create(newTodo)
    .then(result => res.json(result))
    .catch(err => res.json(err));
  })

//Delete data
app.delete('/delete/:id', (req,res)=>{
      const newTodo = req.params.id;

      console.log(req.params.id)
      console.log('deleted')
      TodoModel.findByIdAndDelete(newTodo)
      .then(result => res.json(result))
      .catch(err => res.json(err));
    })

//Update data
app.put('/update/:id', (req,res)=>{
  const id = req.params.id;
  const newTodo = req.body;
  const completed = req.body;

  console.log(req.params.id)
  console.log('updated')
  TodoModel.findByIdAndUpdate( {_id: id}, newTodo, completed, {new:true})
  .then(result =>  res.json(result))
  .catch(err => res.json(err));
})

//Export json data to Excel file
app.get('/export', async (req,res) => {
  try{
    const newTodo = await TodoModel.find();
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Todos')

    worksheet.columns = [
      {header: "Task" , key:"task", width:25},
      {header: "Completed", key:"completed", width: 10}
     ]

    newTodo.forEach(t=>{
      worksheet.addRow({
        task: t.text,
        completed: t.completed
        });  
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=todos.xlsx');

    workbook.xlsx.write(res);

  } catch(error) {
    console.error(error, 'Error'); 
  }
})

//Export json data into pdf file
app.get("/exportpdf", async (req,res) => {
  const newTodo = await TodoModel.find();
  
  const doc = new jsPDF();
  newTodo.forEach((t,i)=>{

    console.log(t)
    doc.text(50, 10 + (i*10),
  
    "task:" + t.text +
    "completed:" + t.completed

    );
  });

const pdfBuffer = doc.output();
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=todos.pdf');
res.send(pdfBuffer);
});
  
app.listen(port,()=>{
  console.log("Listening to port 5000");
})
