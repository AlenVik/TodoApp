'use strict'

const input = document.getElementById('input');
const addBtn = document.getElementById('addBtn')
const todoLIst = document.querySelector('.todo__list')
const tasksDel = document.getElementById('tasksDel')
const tasksChoose = document.getElementById('tasksСhoose')
const takssChooseDel = document.getElementById('tasksСhooseDel')
const sidebar = document.querySelector('.todo__sidebar-list')
const select = document.getElementById('select')
const all = document.getElementById('all')
const link = document.querySelectorAll('.todo__sidebar-link')


const btnBurger = document.getElementById('btnBurger')
const btnCloseBurger = document.getElementById('btnBurgerClose')
const sidebarBlock = document.querySelector('.todo__sidebar');
const btnClose = document.querySelector('.button__burger-close')
const overlay = document.getElementById('overlay')

// const shop = document.getElementById('shop')
// const coll = document.getElementById('coll')
// const pay = document.getElementById('pay')
// const arch = document.getElementById('arch')

let massTasks = []
let localMassTasks = []



//! Получить все задачи из Local Storage
function getTasksFromLC() {
  const data = JSON.parse(localStorage.getItem('tasks'))
  if (!data) return;

  massTasks = data;
  taskGenerate(massTasks)
}
getTasksFromLC()

//!Добавить все задачи в local Storage
function addTasksToLC() {
  localStorage.setItem('tasks', JSON.stringify(massTasks))
}

//! Получение даты создания задачи 
function dateOfTask() {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hour = date.getHours()
  const minutes = date.getMinutes()

  return `Задача создана ${month + 1}/${day}/${year} в ${hour}:${minutes}`
}

//! Функция добавления новой задачи в массив задач
function addTaskToMass(selectEl) {
  if (input.value != '' && !checkTheSameTask(input.value)) {
    const task = {
      id: Date.now(),
      input: input.value,
      isComplited: false,
      attrib: selectEl,
      date: dateOfTask()
    }

    massTasks.push(task)
    localMassTasks.push(task)
    addTasksToLC(massTasks)
    checkContainsClassActive()
    input.value = ''
    input.focus()
  }
  else if (input.value === '') {
    input.classList.add('focus-visible')

    input.addEventListener('click', function () {
      input.classList.remove('focus-visible')
    })
    setTimeout(() => {
      input.classList.remove('focus-visible')
    }, 3000);
  }
}

//! Функция проверки наличия класса 'active' в стилях
function checkContainsClassActive() {
  let classActive;
  link.forEach(list => {
    if (list.classList.contains('active')) {
      classActive = list
    }
  })

  if (all.classList.contains('active')) {
    taskGenerate(massTasks)
  }
  if (classActive.classList.contains('active') && !all.classList.contains('active')) {
    let massnew = [];
    let attribute = classActive.getAttribute('data-set')
    massTasks.forEach(task => {
      if (task.attrib === attribute) {
        massnew.push(task)
      }
      localMassTasks = massnew
      taskGenerate(localMassTasks)
    })
  }
}

//! Функция генерации новой задачи на странице
function taskGenerate(taskMass) {
  let html = '';

  taskMass.forEach(task => {

    const data = 'data-set'
    const taskAttrib = task.attrib ? `${data}=${task.attrib}` : '';

    const statusTask = task.isComplited ? 'checked' : '';
    const statusClass = task.isComplited ? 'task__done' : ``
    const htmlEl = `
       <div id="${task.id}" class="todo__task" ${taskAttrib}>
          <label class="todo__checkbox">
            <input type="checkbox" ${statusTask}>
            <div class="todo__checkbox-mark"></div>
          </label>
          <div class="todo__task-name">
             <span class="text-main ${statusClass}">${task.input}</span>
              <span class="text-category">${task.attrib}</span>
          </div>
          <button id="delBtn" >
            <img class="todo__task-trash" src="img/trash.svg" alt="">
          </button>
        </div>
        `
    html += htmlEl;
  })

  todoLIst.innerHTML = html
  AllCountTasks(massTasks)
  doneCounttasks(massTasks)
  unDoneCounttasks(massTasks)
}

//! Функция добавления подсветки при фильтрации и выборе категории задач
function colorTask(e) {
  if (e.target.classList.contains('todo__sidebar-link')) {
    const targ = e.target;
    link.forEach(task => task.classList.remove('active'))
    targ.classList.add('active')
  }
}

//! Проверка названия новой задачи на те, что уже имеются в массиве задач
function checkTheSameTask(input) {
  let isHave = false;
  massTasks.forEach(task => {
    if (task.input === input) {
      alert('Такая задача уже есть!')
      isHave = !isHave;
    }
  })
  return isHave
}

//! Удаление задачи
function deleteTask(id, list) {
  list.forEach((task, idm) => {
    if (task.id === id) {
      list.splice(idm, 1)
    }
  })
}

//! Удаление задачи из locamTaskMask
function deleteTaskFromLocalTaskMast(id, list) {
  list.forEach((task, idm) => {
    if (task.id === id) {
      list.splice(idm, 1)
    }
  })
}

//! Удаление выбранных задач
function deleteAllTasks(list) {
  let newMassTasks = []

  list.forEach(task => {
    if (task.isComplited === false) newMassTasks.push(task)
  })

  massTasks = newMassTasks;

}

//! Удаление выбранных задач из locamTaskMask
function deleteAllTasksFromLocalTaskMask(list) {
  let newMassTasks = []

  list.forEach(task => {
    if (task.isComplited === false) newMassTasks.push(task)
  })

  localMassTasks = newMassTasks;
}

//! Смена статуса задачи
function taskDone(id, massTasks) {
  massTasks.forEach(task => {
    if (task.id === id) {
      task.isComplited = !task.isComplited;
    }
  })
}

//! Появление/Скрытие кнопки "Удалить"
function showDelBtn(count) {
  if (count > 0) {
    tasksDel.style.opacity = '1';
    tasksDel.style.pointerEvents = 'auto';
  } else {
    tasksDel.style.opacity = '0.5';
    tasksDel.style.pointerEvents = 'none';
  }
}

//! Количество задач
function AllCountTasks(massTasks) {
  const countText = document.querySelector('.allNum')
  countText.innerText = massTasks.length
  addBorderClassNew()
}

//! Количество выполненных задач
function doneCounttasks(massTasks) {
  const countText = document.querySelector('.allDoneNum')
  let count = 0;
  massTasks.forEach(task => {
    if (task.isComplited === true) {
      count++
    }
  });
  countText.innerText = count

  showDelBtn(count)
}

//! Количество НЕвыполненных задач
function unDoneCounttasks(massTasks) {
  const countText = document.querySelector('.allUnDoneNum')
  let count = 0;
  massTasks.forEach(task => {
    if (task.isComplited === false) {
      count++
    }
  });
  countText.innerText = count
}

//! Получение значения Select
let selectEl;
select.addEventListener('change', function (e) {
  selectEl = e.target.value;
})

//! Прослушка кол-ва символов в инпуте

input.addEventListener('input', function () {
  const str = input.value;

  if (str.length === 30) {
    const hide = document.querySelector('.todo__input-hide')
    hide.style.opacity = '1';
    setTimeout(() => {
      hide.style.opacity = '0';
    }, 3000);
  }
})

//! Прослушка списка задач (удаление, смена статуса задачи)
todoLIst.addEventListener('click', function (e) {

  const delTask = e.target.classList.contains('todo__task-trash')
  const checkBox = e.target.classList.contains('todo__checkbox-mark')

  if (delTask) {
    const id = Number(e.target.parentElement.parentElement.id)
    deleteTaskFromLocalTaskMast(id, localMassTasks)
    deleteTask(id, massTasks)
    addTasksToLC(massTasks)
    if (all.classList.contains('active')) {
      taskGenerate(massTasks)
    } else {
      taskGenerate(localMassTasks)
    }
  }

  if (checkBox) {
    const id = Number(e.target.parentElement.parentElement.id)

    showDelBtn(massTasks)
    taskDone(id, massTasks)
    addTasksToLC(massTasks)

    if (all.classList.contains('active')) {
      taskGenerate(massTasks)
    } else {
      taskGenerate(localMassTasks)
    }

  }
})

//! Прослушка кнопки "Удалить" (удаление выбранных задач)
tasksDel.addEventListener('click', function () {
  deleteAllTasksFromLocalTaskMask(localMassTasks)
  deleteAllTasks(massTasks)
  addTasksToLC(massTasks)
  if (all.classList.contains('active')) {
    taskGenerate(massTasks)
  } else {
    taskGenerate(localMassTasks)
  }
})

//! Прослушка кнопки "Выбрать всё"
tasksChoose.addEventListener('click', function () {
  if (all.classList.contains('active')) {
    massTasks.forEach(task => {

      if (task.isComplited === false) {
        task.isComplited = !task.isComplited
      }
      addTasksToLC(massTasks)
      taskGenerate(massTasks)
    })

  } else {
    localMassTasks.forEach(task => {

      if (task.isComplited === false) {
        task.isComplited = !task.isComplited
      }
      addTasksToLC(massTasks)
      taskGenerate(localMassTasks)

    })
  }
})

//! Прослушка кнопки "Убрать всё"
takssChooseDel.addEventListener('click', function () {

  if (all.classList.contains('active')) {
    massTasks.forEach(task => {
      if (task.isComplited === true) {
        task.isComplited = !task.isComplited
      }
      addTasksToLC(massTasks)
      taskGenerate(massTasks)
    })

  } else {
    localMassTasks.forEach(task => {
      if (task.isComplited === true) {
        task.isComplited = !task.isComplited
      }
      addTasksToLC(massTasks)
      taskGenerate(localMassTasks)

    })
  }
})

//! Прослушка кнопки ALL (все задачи), для отображения всех задачи
all.addEventListener('click', function () {
  taskGenerate(massTasks)
  addBorderClassNew()
})

//! Прослушка sidebar, фильтр по категориям
sidebar.addEventListener('click', function (e) {
  colorTask(e)

  let attribute = e.target.getAttribute('data-set')
  let mass = [];
  let all = e.target.classList.contains('todo__sidebar-link')


  if (attribute) {
    massTasks.forEach(task => {

      if (task.attrib === attribute) mass.push(task)
      localMassTasks = mass;
      taskGenerate(mass)
    })
    addBorderClassNew()
  }

  if (!all) return
  sidebarBlock.classList.remove('show__sidebar')
  overlay.classList.remove('overlay')
})

//! Прослушка кнопки добавления задач с клавиши
input.addEventListener('keypress', function (keyPressed) {
  const keyEnter = 13;
  if (keyPressed.which == keyEnter) {
    selectEl = selectEl ? selectEl : 'uncategory';
    addTaskToMass(selectEl)
  }
}
)

//! Прослушка кнопки добавления задач с экрана, 
addBtn.addEventListener('click', function (e) {
  selectEl = selectEl ? selectEl : 'uncategory';
  addTaskToMass(selectEl)
  addBorderClassNew()
}
)

//! Добавления бордера при появлении задач
function addBorderClassNew() {

  const x = todoLIst.querySelector('.todo__task');
  if (x) {
    todoLIst.classList.add('todo__list-border')
  }
  else {
    todoLIst.classList.remove('todo__list-border')
  }
}

//! Работа с бургером, открытие sidebar 

btnBurger.addEventListener('click', function () {
  sidebarBlock.classList.add('show__sidebar')
  btnClose.classList.add('button__burger-close--open')
  overlay.classList.add('overlay')
})
//! Работа с бургером, закрытие sidebar
btnCloseBurger.addEventListener('click', function () {
  sidebarBlock.classList.remove('show__sidebar')
  overlay.classList.remove('overlay')
})


overlay.addEventListener('click', function () {
  sidebarBlock.classList.remove('show__sidebar')
  overlay.classList.remove('overlay')
})


//! Скрипт для установки select по умолчаниб в Mozilla

function selectForMozilla() {
  const firstEl = select.firstElementChild
  firstEl.setAttribute('selected', '');
}
selectForMozilla()




