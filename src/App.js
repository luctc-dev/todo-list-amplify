import React, { useState, useMemo, useEffect } from 'react';

// Bootstrap 
import Container from 'react-bootstrap/Container';

import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { onCreateTodo, onDeleteTodo, onUpdateTodo } from './graphql/subscriptions';

// Local
import Header from './components/Header';
import Button from './components/Button';
import Control from './components/Control';
import ListTasksTable from './components/ListTasksTable';

import todoServices from './services/todos';

import { LIST_TASK_KEY } from './constants';

function App() {
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('name');
  const [orderDir, setOrderDir] = useState('asc');
  const [searchText, setSearchText] = useState('');
  const [listTasks, setListTasks] = useState([]);
  const [nextTokenGetList, setNextTokenGetList] = useState('');

  // Subscribe Create
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (evt) => {
        try {
          const data = evt.value.data.onCreateTodo;
          const findOne = listTasks.find(o => o.id === data.id);
          if (!findOne) {
            listTasks.push(data);
            setListTasks([...listTasks]);
          }
        } catch (e) { console.log(e) }
      }
    });

    return () => subscription.unsubscribe();
  }, [listTasks])

  // Subscribe Delete
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: (evt) => {
        try {
          const data = evt.value.data.onDeleteTodo;
          const findOne = listTasks.find(o => o.id === data.id);
          if (findOne) {
            const newListTasks = listTasks.filter(o => o.id !== data.id);
            setListTasks([...newListTasks]);
          }
        } catch (e) { console.log(e) }
      }
    });

    return () => subscription.unsubscribe();
  }, [listTasks])

  // Subscribe Update
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onUpdateTodo)).subscribe({
      next: (evt) => {
        try {
          const data = evt.value.data.onUpdateTodo;
          const findIndex = listTasks.findIndex(o => o.id === data.id);
          if (findIndex !== -1) {
            listTasks[findIndex] = data;
            setListTasks([...listTasks]);
          }
        } catch (e) { console.log(e) }
      }
    });

    return () => subscription.unsubscribe();
  }, [listTasks])

  useEffect(() => {
    const limit = 2;
    todoServices.getDataAsync({ limit, nextToken: '' }).then(res => {
      if (res.ok && res.data && res.data.items && res.data.items.length) {
        setListTasks(res.data.items);
        setNextTokenGetList(res.data.nextToken);
      }
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(LIST_TASK_KEY, JSON.stringify(listTasks));
  }, [listTasks]);

  function onSelectSort(orderBy, orderDir) {
    setOrderBy(orderBy);
    setOrderDir(orderDir);
  }

  function onChangeSearch(text) {
    setSearchText(text);
  }

  function handleLoadmoreTaskByNextToken() {
    const limit = 2;
    const nextToken = nextTokenGetList;
    if (nextToken && !loading) {
      setLoading(true);
      todoServices.getDataAsync({ limit, nextToken })
        .then(res => {
          if (res.ok && res.data && res.data.items && res.data.items.length) {
            setListTasks([
              ...listTasks,
              ...res.data.items
            ]);
          }
          setNextTokenGetList(res.data.nextToken);
          setLoading(false);
        })
    }
  }

  function handleAddNewTask({ id, name, level }) {
    todoServices.createTask({ id, name, level }).then(res => {
      if (res.ok) {
        listTasks.push(res.data);
        setListTasks([...listTasks]);
      }
    })
  }

  function handleDeleteTask(taskDelete, callback) {
    todoServices.deleteTask(taskDelete)
      .then(res => {
        if (res.ok && res.data) {
          let newTask = listTasks.filter(task => task.id !== taskDelete.id)
          setListTasks(newTask);
        } else {
          setTimeout(() => alert('Xoa khong thanh cong'), 0)
        }
        callback && typeof callback === 'function' && callback();
      })
  }

  function handleEditTask(taskEdit, callback) {
    let findIndex = listTasks.findIndex((task) => task.id === taskEdit.id)
    if (findIndex !== -1) {
      todoServices.editTask(taskEdit)
        .then(res => {
          if (res.ok) {
            listTasks[findIndex].name = taskEdit.name
            listTasks[findIndex].level = taskEdit.level
            setListTasks([...listTasks]);
          } else {
            setTimeout(() => { alert(res.error) }, 0);
          }
          callback && typeof callback === 'function' && callback();
        })
    }
  }

  const listTaskSearch = useMemo(() => {
    return listTasks.filter(task => {
      let nameLower = task.name.toLowerCase(),
        queryLower = searchText.toLowerCase();
      return nameLower.indexOf(queryLower) !== -1;
    })
  }, [searchText, listTasks])

  const listTaskSearchAndSort = useMemo(() => {
    let returnIndex = 1; // default for desc
    if (orderDir === 'asc') returnIndex = -1;

    listTaskSearch.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return returnIndex;
      else if (a[orderBy] > b[orderBy]) return (-1) * returnIndex;
      return 0;
    })

    return [...listTaskSearch];
  }, [orderBy, orderDir, listTaskSearch])

  let injectedPropsControl = {
    orderBy,
    orderDir,
    searchText,
    onSelectSort,
    onChangeSearch,
    handleAddNewTask
  }

  return (
    <Container>
      <Header />
      <Control {...injectedPropsControl} />
      <ListTasksTable
        listTasks={listTaskSearchAndSort}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
      />
      <Button
        loading={loading}
        onClick={() => {
          handleLoadmoreTaskByNextToken()
        }}
        className="btn btn-primary">Load more</Button>
    </Container>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true
});


// query GetTodo {
//   listTodos(filter: {
//     level: {
//       between: [0, 1]
//     }
//   } ) {
//     items {
//       id
//       name
//       level
//     }
//   }
// }