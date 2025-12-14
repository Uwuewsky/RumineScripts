/*
 * Для портирования(громкое слово!) кода под новенькую тему
 * или под всякие мобилки возможно потребуется изменить:
 * 1. [-] Функции getXXX() - селекторы и\или логику;
 * 2. [-] Стили сообщений/popup-а в injectStyles() и reloadIgnoredMessages();
 * 3. [-] Вставку в HTML кнопки открытия popup-a и счетчика в initInterface();
 * И, вроде, всё. Остальное должно работать без изменений;
 */


/*
 * Глобальные переменные скрипта;
 */
let messageSelector, ignoreParameters, tempIgnoreParameters;

window.addEventListener("DOMContentLoaded", initIgnore);

function getMessageList() {
    /*
     * Список всех сообщений на странице;
     */
    return document.querySelectorAll(messageSelector);
}

function getIgnoredMessageList() {
    /*
     * Список всех скрытых сообщений на странице;
     */
    return document.querySelectorAll(`${messageSelector}.hidden`);
}

function getNicknameFromMessage(e) {
    /*
     * Возвращает строку с никнеймом юзера из сообщения;
     */
    return e.querySelector("h4 > a").textContent;
}

function getMessagesCountFromMessage(e) {
    /*
     * Возвращает число с количеством сообщений юзера;
     */
    return parseInt(e.querySelector(".forum-topicMsgStat > .msgUserCount > span").textContent);
}

function getPermalimkFromMessage(e) {
    /*
     * Возвращает ссылку на сообщение;
     */
    return e.querySelector(".getMessageLinck").href;
}

function copyObject(a) {
    /*
     * Возвращает глубокую копию объекта; Не работает если в объекте есть методы;
     */
    return JSON.parse(JSON.stringify(a));
}

function initIgnore() {
    /*
     * Выполняется при загрузке страницы;
     */
    messageSelector = ".contentBoxTopicMessageList:not(#postAddTopic) > .forum-topicMsgCont";
    
    if (localStorage.getItem("ignoreParameters") === null)
        ignoreParameters = {userList: [], minMessageCount: 2, uniqueMessageList: [], deleteMessages: false};
    else
        ignoreParameters = JSON.parse(localStorage.getItem("ignoreParameters"));
    
    tempIgnoreParameters = copyObject(ignoreParameters);
    
    injectStyles();
    initInterface();
    reloadIgnoredMessages();
}

function injectStyles() {
    /*
     * Стили для скрытых сообщений;
     */
    document.head.insertAdjacentHTML("beforeend",
                                     `<style id="ignoreStyles">
        ${messageSelector}.hidden {
                height: 80px;
                overflow: clip;
        }
        
        ${messageSelector}.hidden > .forum-topicMsgUser,
        ${messageSelector}.hidden > .forum-topicMsg {
                display: none;
        }
        
        .forum-topicMsgDate {
                transition-property: background !important;
        }
        
        .ignoreToggleButton {
                position: absolute;
                margin-top: 50px;
                color: #9d9d9d;
                cursor: pointer;
        }
        
        #counterMessages {
                float: right;
                font-size: 11px;
                display: block;
                padding: 0px 7px;
                border: 1px solid #c1c1c1;
                background: #fffefdc2;
                border-radius: 2px;
                text-align: center;
                color: #848484 !important;
                line-height: 19px;
                box-shadow: 0 0 #ffce87;
        }
        
        .counterMessage-nofloat {
                float: none !important;
        }
        
        #ignorePopup {
                position: fixed;
                left: calc(50% - 350px);
                top: calc(50% - 250px);
                width: 700px;
                height: 500px;
                padding: 10px;
                overflow: auto;
                z-index: 999;
                background: #fcfcff;
                border: solid 2px #c5c5c5;
                border-radius: 4px;
        }
        
        #ignorePopup.hidden {
                display: none;
        }
        
        #ignorePopupExit,
        #ignorePopupSubmit,
        #ignorePopupToDefault,
        #ignorePopup table .ignoreTableDeleteRowButton {
                margin: 0 5px 0 5px;
                float: right;
                cursor: pointer;
        }
        
        #ignorePopup label {
                display: block;
                margin: 10px 0;
        }
        
        #ignorePopup fieldset {
                margin: 10px 30px 10px 0;
                padding: 10px;
                border: solid 1px #ccc;
        }
        
        #ignoreUniqueMessageAdd {
                width: 325px;
        }
        
        #ignorePopup table th {
                background-color: #bbb;
        }
        
        #ignorePopup table > tbody > tr:nth-child(2n) {
                background-color: #ddd;
        }
        </style>
        <style id="ignoreStylesDeleteHidden"></style>`);
}

function initInterface() {
    /*
     * Создание кнопки в меню профиля для открытия всплывающего окна;
     */
    let menu = document.querySelector(".topmenu-profile > li > ul");
    
    let li = document.createElement("li");
    let a = document.createElement("a");
    
    a.textContent = "Настройки игнора";
    a.style.cursor = "pointer";
    a.addEventListener("click", () => {
        showElement(document.getElementById("ignorePopup"));
    });
    
    li.append(a);
    menu.insertAdjacentElement("beforeend", li);
    
    /*
     * Создание счетчика сообщений; Пока пустой;
     */

    let counterHTML;
    if (document.getElementById("paginationForum").hasChildNodes())
        counterHTML = `<span id="counterMessages"></span>`;
    else
        counterHTML = `<span id="counterMessages" class="counterMessage-nofloat"></span>`;

    document.getElementById("addNewMsg")
        .insertAdjacentHTML("afterend", counterHTML);
    
    /*
     * Создание кнопок переключения скрытия у каждого сообщения;
     */
    getMessageList().forEach((e)=>{
        createToggleButton(e);
    });
    
    /*
     * Создание всплывающего окна;
     */
    let popup = document.createElement("div");
    popup.id = "ignorePopup";
    popup.classList.add("hidden");
    popup.innerHTML = `<button id="ignorePopupExit">X</button>
        <button id="ignorePopupSubmit">Принять изменения</button>
        <button id="ignorePopupToDefault">Сбросить настройки</button>
        
        <span>Настройки скрипта для игнорирования постов:</span>
        
        <fieldset>
          <legend>Игнорирование пользователей</legend>
          <label>Добавить юзера в список: <input id="ignoreNicknameAdd" type="text"> <button id="ignoreNicknameAddSubmit">✓</button></label>
          <table id="ignoreNicknameView">
            <thead><tr><th>Никнейм пользователя</th><th></th></tr></thead>
            <tbody></tbody>
          </table>
        </fieldset>
        
        <fieldset>
          <legend>Игнорирование отдельных сообщений</legend>
          <label>Добавить сообщение в список:
            <input id="ignoreUniqueMessageAdd" type="text" placeholder="https://ru-minecraft.ru/forum/showtopic-15361/findpost-1239156/">
            <button id="ignoreUniqueMessageAddSubmit">✓</button>
          </label>
          <table id="ignoreUniqueMessageView">
            <thead><tr><th>URL-адрес сообщения</th><th></th></tr></thead>
            <tbody></tbody>
          </table>
        </fieldset>
        
        <fieldset>
          <legend>Остальные настройки</legend>
          <label>Минимальное количество сообщений: <input id="ignoreInputMinMessages" type="number"></label>
          <label>Удалять сообщения вместо сворачивания: <input id="ignoreDeleteMessages" type="checkbox"></label>
        </fieldset>`;

    document.body.insertAdjacentElement("afterbegin", popup);

    /*
     * Заполнение сохраненными данными во всплывающем окне;
     */
    document.getElementById("ignoreInputMinMessages").value = tempIgnoreParameters.minMessageCount;
    document.getElementById("ignoreDeleteMessages").checked = tempIgnoreParameters.deleteMessages;
    fillTable(document.getElementById("ignoreNicknameView"), tempIgnoreParameters.userList);
    fillTable(document.getElementById("ignoreUniqueMessageView"), tempIgnoreParameters.uniqueMessageList);

    /*
     * Биндинг кнопок во всплывающем окне;
     */
    document.getElementById("ignorePopupExit").addEventListener("click", (e) => {
        hideElement(e.target.parentNode);
    });
    
    document.getElementById("ignorePopupSubmit").addEventListener("click", () => {
        ignoreParameters = copyObject(tempIgnoreParameters);
        
        localStorage.setItem("ignoreParameters", JSON.stringify(ignoreParameters));
        
        reloadIgnoredMessages();
    });
    
    document.getElementById("ignorePopupToDefault").addEventListener("click", (e) => {
        if (window.confirm("Вы уверены что хотите сбросить настройки и перезагрузить страницу?")) {
            localStorage.removeItem("ignoreParameters");
            location.reload()
        }
    });
    
    document.getElementById("ignoreInputMinMessages").addEventListener("input", (e) => {
        tempIgnoreParameters.minMessageCount = e.target.value;
    });
    
    document.getElementById("ignoreDeleteMessages").addEventListener("input", (e) => {
        tempIgnoreParameters.deleteMessages = e.target.checked;
    });
    
    bindPopupButton(document.getElementById("ignoreNicknameAddSubmit"),
                    document.getElementById("ignoreNicknameAdd"),
                    document.getElementById("ignoreNicknameView"),
                    tempIgnoreParameters.userList,
                    mode="add");
    
    bindPopupButton(document.getElementById("ignoreUniqueMessageAddSubmit"),
                    document.getElementById("ignoreUniqueMessageAdd"),
                    document.getElementById("ignoreUniqueMessageView"),
                    tempIgnoreParameters.uniqueMessageList,
                    mode="add");
}

function bindPopupButton(button, input, table, data, mode="add") {
    /*
     * Биндинг кнопки; При нажатии на button считывается значение input,
     * затем, это значение вноситс(удаляется) из data, и обновляется table на основе data;
     */
    button.addEventListener("click", () => {
        if (input.value.length != 0) {
            if (mode == "add")
                addToParametersData(data, input.value);
            else if (mode == "remove")
                deleteFromParametersData(data, input.value);
            input.value = "";
            fillTable(table, data);
        }
    });
}

function fillTable(table, data) {
    /*
     * Обновление таблицы данными массива data;
     */
    table.tBodies[0].innerHTML = "";
    data.forEach((e) => {
        let button = document.createElement("button");
        button.classList.add("ignoreTableDeleteRowButton");
        button.textContent = "X";
        button.addEventListener("click", (e) => {
            deleteFromParametersData(data, e.target.parentElement.parentElement.childNodes[0].textContent);
            fillTable(table, data);
        });
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");
        cell1.append(e);
        cell2.append(button);
        row.append(cell1, cell2);
        table.tBodies[0].append(row);
    });
}

function addToParametersData(data, str) {
    /*
     * Добавляет в массив data (здесь это object.data == [...]) некое значение;
     */
    if (data.indexOf(str) == -1)
        data.push(str);
}

function deleteFromParametersData(data, str) {
    /*
     * Удаляет из массива строку;
     */
    if (data.indexOf(str) != -1)
        data.splice(data.indexOf(str), 1);
}

function reloadIgnoredMessages() {
    /*
     * Обновляет скрытые сообщения;
     */
    if (ignoreParameters.deleteMessages)
        document.getElementById("ignoreStylesDeleteHidden")
        .innerHTML = `${messageSelector}.hidden { display: none !important; }`;
    else
        document.getElementById("ignoreStylesDeleteHidden").innerHTML = "";
    
    getIgnoredMessageList().forEach((e)=>{
        toggleMessage(e);
    });

    getMessageList().forEach((e)=>{
        if (ignoreParameters.userList.indexOf(getNicknameFromMessage(e)) != -1 ||
            ignoreParameters.minMessageCount > getMessagesCountFromMessage(e) ||
            ignoreParameters.uniqueMessageList.indexOf(getPermalimkFromMessage(e)) != -1)
            toggleMessage(e);
    });

    updateCounter();
}

function updateCounter() {
    /*
     * Обновление счетчика постов;
     */
    let counterMessages = [getIgnoredMessageList().length, getMessageList().length];
    
    document.getElementById("counterMessages")
        .textContent = `Скрыто ${counterMessages[0]} из ${counterMessages[1]} сообщений`;
}

function createToggleButton(e) {
    /*
     * Создает кнопку для переключения на элементе e;
     */
    let button = document.createElement("button");
    button.classList.add("ignoreToggleButton");
    button.textContent = "▼";
    
    button.addEventListener("click", (e) => {
        toggleMessage(e.target.parentNode);
        updateCounter();
    });
    
    e.insertAdjacentElement("afterbegin", button);
}

function setButtonText(e, str="▼") {
    /*
     * Изменение текста кнопки переключения скрытия;
     */
    e.querySelector(".ignoreToggleButton").textContent = str;
}

function toggleMessage(e) {
    /*
     * Переключение сообщения скрыто/показано;
     */
    if (e.classList.contains("hidden")) {
        showElement(e);
        setButtonText(e);
    }
    else {
        hideElement(e);
        setButtonText(e, `Скрыто сообщение от ${getNicknameFromMessage(e)}`);
    }
}

function showElement(e) {
    /*
     * Показ скрытого элемента; Кэп;
     */
    e.classList.remove("hidden");
}

function hideElement(e) {
    /*
     * Скрытие элемента;
     */
    e.classList.add("hidden");
}
