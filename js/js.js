// (function() {
// главный чекбокс
var mainCheckbox = document.body.querySelector("#complete-all");
// настройки
var settingActive = document.body.querySelector(".setting-active");
var settingAll = document.body.querySelector(".setting-all");
var settingCompleted = document.body.querySelector(".setting-completed");
// главные элементы
var form = document.body.querySelector(".form")
var input = document.body.querySelector("#input");

// функция для получения шаблона
function getTemplate(id) {
    var element = document.getElementById(id);
    return _.template(element.innerHTML);
}

//модель задания
var Task = Backbone.Model.extend({
    validate: function(attributes) {
        if (attributes.text == "") {
            return "Нельзя создать пустую заметку";
        }
    },
    defaults: {
        text: "",
        completed: false
    }
});

// коллекция заданий
var Tasks = Backbone.Collection.extend({
    model: Task,
    completeAll: function() {
        this.each(function(model) {
            model.set("completed", true);
        }, this);
    },
    incompleteAll: function() {
        this.each(function(model) {
            model.set("completed", false);
        }, this);
    },
    deleteCompleted: function() {
        for (var i = 0; i < this.models.length; i++) {
            var model = this.models[i];
            if (model.get("completed")) {
                model.destroy();
                i--;
            }
        }
        checkMainCheckbox();
    }
})

// вьюха для таска
var TaskView = Backbone.View.extend({

    initialize: function() {
        this.model.on("destroy", this.remove, this);
        this.model.on("change", this.render, this);
    },

    className: "note",

    template: getTemplate("task_template"),

    events: {
        "click .note__check": function(event) {
            if (event.currentTarget.checked) {
                this.model.set("completed", true);
                this.el.classList.add("note_completed");
            } else {
                this.model.set("completed", false);
                this.el.classList.remove("note_completed");
            }
        },
        "click .note__delete": function() {
            this.model.destroy();
            checkMainCheckbox();
        },
        "click .note__text": function() {
            console.log("ИЗМЕНЯЕМ ЗАДАЧУ");
        }
    },

    remove: function() {
        this.el.remove();
    },

    render: function() {
        this.el.innerHTML = this.template(this.model.toJSON());
        if (this.model.get("completed")) {
            this.el.querySelector(".note__check").checked = true;
        }
        return this;
    }
});

// вьюха коллекций
var TasksView = Backbone.View.extend({

    initialize: function() {
        this.collection.on("add", this.addTask, this)
    },

    render: function() {
        this.collection.each(this.addTask, this)
        return this;
    },

    addTask: function(task) {
        var taskView = new TaskView({
            model: task
        });
        // вставляем сразу в за формой, не обрабатывая саму вьюху коллекци
        document.body.insertBefore(taskView.render().el, form.nextElementSibling)
        checkMainCheckbox();
        checkSetting();
    }
});


//функция для проверки главного чек-бокса
function checkMainCheckbox() {
    if (tasks.models.length > 0) {
        mainCheckbox.style.opacity = "1";
        mainCheckbox.disabled = false;
    } else {
        mainCheckbox.style.opacity = "0";
        mainCheckbox.disabled = true;
    }

}



var task = new Task();
var tasks = new Tasks();
var tasksView = new TasksView({ collection: tasks });
tasksView.render();
//лучше сделать проверку в модели на "change"

function checkSetting() {
    // При добавлении заметки, нужно проверить, какая группа выбрана
    if (document.querySelector(".setting_selected")) {
        var setting = document.querySelector(".setting_selected");
        switch (setting.classList[0]) {
            case "setting-active":
                showActive();
                break;
            case "setting-completed":
                showCompleted();
                break;
            default:
                showAll();
                break;
        }
    }
}

function showAll() {
    // Показать все задачи
    if (document.querySelector(".setting_selected")) {
        document.querySelector(".setting_selected").classList.remove("setting_selected");
    }
    settingAll.classList.add("setting_selected");
    var array = document.querySelectorAll(".note");
    [].forEach.call(array, function(el) {
        el.style.display = "block";
    });
}

function showActive() {
    // проказать активные задачи
    if (document.querySelector(".setting_selected")) {
        document.querySelector(".setting_selected").classList.remove("setting_selected");
    }
    settingActive.classList.add("setting_selected");
    var array = document.querySelectorAll(".note");
    [].forEach.call(array, function(el) {
        el.style.display = "block";
    });
    array = document.querySelectorAll(".note_completed");
    [].forEach.call(array, function(el) {
        el.style.display = "none";
    });
}

function showCompleted() {
    //показать выполненные задачи
    if (document.querySelector(".setting_selected")) {
        document.querySelector(".setting_selected").classList.remove("setting_selected");
    }
    settingCompleted.classList.add("setting_selected");
    var array = document.querySelectorAll(".note");
    [].forEach.call(array, function(el) {
        el.style.display = "none";
    });
    array = document.querySelectorAll(".note_completed");
    [].forEach.call(array, function(el) {
        el.style.display = "block";
    });
}

function recreateNode() {
    // проверяем текст в поле
    if (this.value) {
        // текст есть
        var text = this.value;
        var textNote = this.parentElement.querySelector(".note__text");
        textNote.style.display = "";
        textNote.textContent = text;
        this.remove();

    } else {
        // текста нет
        deleteNote.apply(this);
    }
}

function editNote() {
    // создаем input
    var html = "<input type='text' class='note__input' value='" + this.textContent + "'>";
    this.insertAdjacentHTML("beforeBegin", html);
    this.style.display = "none";
    this.parentElement.querySelector("input[type='text']").addEventListener("blur", recreateNode);
}


function completeAll(event) {
    // Выполнить/Отменить выполнение всех задачи
    if (this.disabled)
        return;
    if (this.checked) {
        tasks.completeAll();
        checkSetting();
    } else {
        tasks.incompleteAll();
        checkSetting();
    }
}

function forceComplete() {
    // Выполнить задачу
    this.querySelector(".note__text").style.textDecoration = "line-through";
    this.querySelector(".note__check").checked = true;
    this.classList.add("note_completed");
}

function forceUncomplete() {
    // Отменить выполнение задачи
    this.querySelector(".note__text").style.textDecoration = "";
    this.querySelector(".note__check").checked = false;
    this.classList.remove("note_completed");
}


function completeNote() {
    // щелкнут чекбокс задачи, выполнить/отменить задачу
    if (this.checked) {
        this.parentElement.querySelector(".note__text").style.textDecoration = "line-through";
        this.parentElement.classList.add("note_completed");
    } else {
        this.parentElement.querySelector(".note__text").style.textDecoration = "";
        this.parentElement.classList.remove("note_completed");
    }
}


function deleteNote() {
    // удалить задачу
    this.parentElement.remove();
    if (!document.body.querySelector(".note")) {
        mainCheckbox.style.opacity = "0";
        mainCheckbox.disabled = true;
    }
}

function deleteCompleted() {
    // удалить выполненные 
    tasks.deleteCompleted();
}

function createNote(event) {
    // создать задачу
    if (event.keyCode != 13)
        return;
    var text = input.value;
    var task = new Task();
    if (task.set({ text: text }, { validate: true })) {
        input.value = "";
        console.log("Заметка создана");
        tasks.add(task);
    } else {
        console.log("Заметка некорректна");
    }
}

// основное текстовое поле

input.addEventListener("keypress", createNote);
// основной чекбокс для всех задач

mainCheckbox.addEventListener("click", completeAll);

settingActive.addEventListener("click", showActive);
settingAll.addEventListener("click", showAll);
settingCompleted.addEventListener("click", showCompleted);

var clearCompletedText = document.body.querySelector(".clear-completed");
clearCompletedText.addEventListener("click", deleteCompleted);
// }());
