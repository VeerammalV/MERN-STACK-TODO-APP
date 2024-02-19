import { ToDoList } from '@/components/ToDoList';

export default function App() {
  return (
    <>
   <title>To do list</title>
   <main>      
        <div className="w-[350px] h-8 mt-14 mx-auto items-center bg-purple-400 p-6">
          <h2 className=' text-black text-center text-2xl mt-[-12px]'>To Do List</h2>
        </div>     
   </main>
   <ToDoList />
   </>  
  )
}


