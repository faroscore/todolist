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
    document.querySelector(".setting-all").classList.add("setting_selected");
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
    document.querySelector(".setting-active").classList.add("setting_selected");
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
    document.querySelector(".setting-completed").classList.add("setting_selected");
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
    var array = document.body.querySelectorAll(".note");
    if (this.checked) {
        for (var i = 0; i < array.length; i++) {
            forceComplete.apply(array[i]);
        }
        checkSetting();
    } else {
        for (var i = 0; i < array.length; i++) {
            forceUncomplete.apply(array[i]);
        }
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
        document.body.querySelector("#complete-all").style.opacity = "0";
        document.body.querySelector("#complete-all").disabled = true;
    }
}

function clearCompleted() {
    // удалить выполненные 
    var array = document.body.querySelectorAll(".note_completed");
    [].forEach.call(array, function(block) {
        block.remove();
    })
    if (!document.body.querySelector(".note")) {
        document.body.querySelector("#complete-all").style.opacity = "0";
        document.body.querySelector("#complete-all").disabled = true;
    }
}

function createNote() {
    // создать задачу
    var input = document.body.querySelector("#input");
    var form = document.body.querySelector(".form")
    if (input.value == "") {
        console.log("заметка не создана");
    } else {
        var text = input.value;
        var el = document.createElement("div");

        el.innerHTML = `<input type="checkbox" class="note__check"><span class="note__text">${text}</span><span class="note__delete">x</span>`;
        el.classList.add("note");

        var checkbox = el.querySelector(".note__check");
        checkbox.addEventListener("click", completeNote);

        var deleteButton = el.querySelector(".note__delete");
        deleteButton.addEventListener("click", deleteNote);

        var noteText = el.querySelector(".note__text");
        noteText.addEventListener("dblclick", editNote);

        document.body.insertBefore(el, form.nextElementSibling)
        console.log("заметка создана");

        if (document.body.querySelector(".note")) {
            document.body.querySelector("#complete-all").style.opacity = "1";
            document.body.querySelector("#complete-all").disabled = false;
        }
        input.value = "";

        checkSetting();
    }

}

// основное текстовое поле
var input = document.body.querySelector("#input");
input.addEventListener("blur", createNote);


// основной чекбокс для всех задач
var mainCheckbox = document.body.querySelector("#complete-all");
mainCheckbox.addEventListener("click", completeAll);


// настройки
var settingActive = document.body.querySelector(".setting-active");
var settingAll = document.body.querySelector(".setting-all");
var settingCompleted = document.body.querySelector(".setting-completed");

settingActive.addEventListener("click", showActive);
settingAll.addEventListener("click", showAll);
settingCompleted.addEventListener("click", showCompleted);

var clearCompletedText = document.body.querySelector(".clear-completed");
clearCompletedText.addEventListener("click", clearCompleted);
