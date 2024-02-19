'use client';
import React, { useState,useEffect } from 'react';
import axios from 'axios';

interface item {
   _id?:string;
    text:string;
    completed:boolean;
}

export const ToDoList = () => {
    const [todos, setTodos] = useState<item[]> ([]);
    const [input, setInput] = useState<string>("");
    const [editTodo, setEditTodo ] = useState('')
    const [editTodoId, setEditTodoId ] = useState<string | null>(null);
    const [showAddPlaceholder , setAddPlaceholder ] = useState(false);
    const [showUpdatePlaceholder, setUpdatePlaceholder] = useState(false);

    useEffect(()=>{
        axios.get('http://localhost:5000/get')
        .then(result => {
            setTodos(result.data)
        })
        .catch(err => console.log(err))
      },[])

    const handleAddTodo = () => {
        console.log(input)
        const newTodo: item = {
            text: input, completed: false
        }
        setTodos([...todos, newTodo]);
        console.log(newTodo);

        axios.post('http://localhost:5000/add', newTodo)
        .then(result => {
        console.log(result)
        setInput('');
        setEditTodoId(null);
        setEditTodo('');
        setUpdatePlaceholder(false);
        })
        .catch(err => console.log(err))
        }

    function handleEdit(text:string, id:string){
        setUpdatePlaceholder(!showUpdatePlaceholder);
        setAddPlaceholder(false);
        
        setEditTodoId(id);
        setEditTodo(text);
        console.log(text);
    };

    const handleStrikeout = (id: string) => {
       let notCompleted = false;
        setTodos(
            todos.map((todo) => {
                if (todo._id === id) {
                    return {...todo, completed: !todo.completed };
                }
                return todo;
            })
        );
        console.log(notCompleted, id)

        axios.put(`http://localhost:5000/update/${id}`, {completed: notCompleted})
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err)
        })
    };

    function handleUpdate(text:string){
        axios.put(`http://localhost:5000/update/${editTodoId}`, {text: editTodo})
        .then(result => {
            setTodos(todos.map(todo => (todo._id === editTodoId ? {...todo, text: editTodo} : todo )))
            console.log(result)
            console.log(editTodo)

            setEditTodoId(null);
            setEditTodo('');
        }).catch(err => console.log(err))
    }
    
    const handleDelete = (id:string) => {
         axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
            location.reload();
    };

        
    const handleSubmit = (e: { preventDefault: () => void; })=> {
            e.preventDefault();
            setInput('');
    };

    function handleAddPlaceholder(){
        setAddPlaceholder(!showAddPlaceholder);
    }

    function handleUpdatePlaceholder(){
        setUpdatePlaceholder(!showUpdatePlaceholder);
    }
  
    return(
    <>
    <div className='bg-blue-100 mx-auto w-[350px] mt-1 text-xl text-black leading-10'>
    <ul>
          {todos.map((todo) => (
            <li className='ml-8  p-0'
                data-key={todo._id} 
                onClick={()=> handleStrikeout(todo._id ?? "")}
                style={{textDecoration: todo.completed ? "line-through" : "none"}}>
                <table >
                    <tr>
                            <td >
                                    {todo.text}
                            </td>

                            <td className='p-6'>
                                <svg     
                                        className='fill-slate-500 mx-[180px] '
                                        onClick={()=>handleEdit(todo.text, todo._id ?? "")}
                                        xmlns="http://www.w3.org/2000/svg"  height="20" width="16"  viewBox="0 0 512 512">
                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
                                
                                </svg>
                            </td>

                            <td className='p-6'>
                                <svg    
                                        className="fill-slate-500 mx-[-215px] "
                                        onClick={()=>handleDelete(todo._id ?? "")}
                                        xmlns="http://www.w3.org/2000/svg" height="20" width="16" viewBox="0 0 448 512">
                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                </svg> 
                            </td> 
                    </tr>
                </table> 
            </li>      
          ))}    
    </ul>

    <div>
    <center><button
        onClick={handleAddPlaceholder}
        className="mx-50 mt-60 text-black bg-purple-400 w-32 rounded-full p-2"
    >+ New Task
    </button></center>
   
    {showUpdatePlaceholder && 
    <center><form onClick={handleSubmit}>
            <input 
            className=" bg-slate-300 w-[350px] text-center rounded-none text-xs p-2 text-black mt-70"
            type="text"
            placeholder="Update Task" 
            value={editTodo}
            onChange={(e) => setEditTodo(e.target.value)}
            onSubmit={(e) => setInput(e.currentTarget.value)}
            />
        
        <button  
            className="bg-slate-500 text-xs p-2 text-white"
            onChange={handleUpdatePlaceholder}
            onClick={() => handleUpdate(editTodo)} 
        >Update</button>
        
        </form> 
    </center>  }

    {showAddPlaceholder && 
    <center>
        <form onClick={handleSubmit}>
            <input 
            type='text' placeholder='Add Task'
            onChange={(e)=>setInput(e.currentTarget.value)}
            onSubmit={handleAddTodo}
            className=' bg-slate-300 w-[350px] text-center rounded-none text-xs p-2 text-black mt-70'
            />
            <button onClick={handleAddTodo} 
                onChange ={()=>setAddPlaceholder(false)}
                className="bg-slate-500 text-xs p-2 text-white" > 
                Add 
            </button>
            
        </form>
    </center>}

        </div>

    </div>
    </>
)};

