import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';


function App () {
  const [isCompleteScreen, setIsCompleteScreen] = useState (false);
  const [allTasks, setTasks] = useState ([]);
  const [newTitle, setNewTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTasks, setcompletedTasks] = useState ([]);
  const [currentEdit,setCurrentEdit] = useState("");
  const [currentEditedItem,setCurrentEditedItem] = useState("");

  const handleAddTask = () => {
    let newTaskItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTaskArr = [...allTasks];
    updatedTaskArr.push (newTaskItem);
    setTasks (updatedTaskArr);
    localStorage.setItem ('taskmanagerlist', JSON.stringify (updatedTaskArr));
  };

  const handleDeleteTask = index => {
    let reducedTask = [...allTasks];
    reducedTask.splice (index);

    localStorage.setItem ('taskmanagerlist', JSON.stringify (reducedTask));
    setTasks (reducedTask);
  };

  const handleComplete = index => {
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTasks[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTasks];
    updatedCompletedArr.push (filteredItem);
    setcompletedTasks (updatedCompletedArr);
    handleDeleteTask (index);
    localStorage.setItem (
      'completedTasks',
      JSON.stringify (updatedCompletedArr)
    );
  };

  const handleDeleteCompletedTask = index => {
    let reducedTask = [...completedTasks];
    reducedTask.splice (index);

    localStorage.setItem ('completedTasks', JSON.stringify (reducedTask));
    setcompletedTasks (reducedTask);
  };

  useEffect (() => {
    let savedTask = JSON.parse (localStorage.getItem ('taskmanagerlist'));
    let savedCompletedTask = JSON.parse (
      localStorage.getItem ('completedTasks')
    );
    if (savedTask) {
      setTasks (savedTask);
    }

    if (savedCompletedTask) {
      setcompletedTasks (savedCompletedTask);
    }
  }, []);


  const handleEdit = (ind,item)=>{
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  }

  const handleUpdateTitle = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value}
    })
  }

  const handleUpdateDescription = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value}
    })
  }

  const handleUpdateTask = ()=>{
      let newTask = [...allTasks];
      newTask[currentEdit] = currentEditedItem;
      setTasks(newTask);
      setCurrentEdit("");
  }



  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="taskmanager-wrapper">
        <div className="taskmanager-input">
          <div className="taskmanager-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle (e.target.value)}
              placeholder="What is the task title?"
            />
          </div>
          <div className="taskmanager-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What is the task description?"
            />
          </div>
          <div className="taskmanager-input-item">
            <button
              type="button"
              onClick={handleAddTask}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen (false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        <div className="taskmanager-list">

          {isCompleteScreen === false &&
            allTasks.map ((item, index) => {
              if(currentEdit===index){
                 return(
                  <div className='edit__wrapper' key={index}>
                  <input placeholder='Updated Title' 
                  onChange={(e)=>handleUpdateTitle(e.target.value)} 
                  value={currentEditedItem.title}  />
                  <textarea placeholder='Updated Title' 
                  rows={4}
                  onChange={(e)=>handleUpdateDescription(e.target.value)} 
                  value={currentEditedItem.description}  />
                   <button
              type="button"
              onClick={handleUpdateTask}
              className="primaryBtn"
            >
              Update
            </button>
              </div> 
                 ) 
              }else{
                return (
                  <div className="taskmanager-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
  
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTask (index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete (index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit  className="check-icon"
                        onClick={() => handleEdit (index,item)}
                        title="Edit?" />
                    </div>
  
                  </div>
                );
              }
              
            })}

          {isCompleteScreen === true &&
            completedTasks.map ((item, index) => {
              return (
                <div className="taskmanager-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTask (index)}
                      title="Delete?"
                    />
                  </div>

                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}

export default App;