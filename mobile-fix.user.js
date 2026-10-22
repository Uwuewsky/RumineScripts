// ==UserScript==
// @name         Rumine Mobile Fix
// @version      1.7
// @description  Скрипт для фикса мобильного форума ru-minecraft.ru
// @author       Sab [https://ru-minecraft.ru/user/Sab/]
// @match        https://ru-minecraft.ru/forum/showtopic-*
// @match        https://ru-minecraft.ru/user/*/message/*
// @icon         https://www.google.com/s2/favicons?domain=ru-minecraft.ru
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/mobile-fix.user.js
// @downloadURL  https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/mobile-fix.user.js
// ==/UserScript==


(function() {
    document.head.insertAdjacentHTML("beforeend",
    `<style id="mobileFixScriptStyles">

    /* Большие картинки в постах */
    .msgText img:not(.emoji, .emoji2), .postUserBox img:not(.emoji, .emoji2) {
        max-width: 98%;
        height: auto;
    }

    /* Убрать белый фон у картинок */
    .msgText img[title], .postUserBox img[title] {
        vertical-align: middle;
        border: none !important;
        background: none !important;
        border-radius: 0 !important;
    }

    /* Большие аватарки */
    .avatar img {
        max-height: 90px;
        max-width: 90px;
        height: auto;
    }

    /* Срезанный тулбар */
    ol.bbcode_forum {
        height: unset;
    }

    /* Сплошнойтекствыезжалзаграницы */
    .msgText {
        word-wrap: anywhere;
    }

    /* Всплывающие диалоговые окна зафиксированы на весь экран */
    .ui-dialog {
        width: 100vw !important;
        height: 100vh !important;
        top: 0 !important;
        position: fixed !important;
    }

    .ui-dialog .ui-dialog-content {
        padding: 0 10px !important;
        height: auto !important;
        overflow: unset !important;
    }

    .ui-dialog-title {
        font-size: 14px !important;
    }

    /* Элементы в диалогах тоже побольше */
    #bepopup-promt-text {
        width: 97% !important;
    }

    ol.boxUserTrophies {
        max-height: 80vh !important;
        overflow: auto;
    }

    #reputation_view_popup, #bullet_energy_emos div {
        height: 85vh !important;
    }

    .reputation-user-info {
        background: #0002;
    }

    .reputation_user_block thead, .reputation_user_block colgroup {
        display: none;
    }

    .reputation-change {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: 90vw;
    }

    .change-author, .change-comment {
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .change-comment {
        border-left: 2px solid orange;
        margin: 5px 0 15px 0 !important;
    }

    .change-author {
        background: #0001;
    }

    .change-date, .change-value {
        color: #666;
        margin: 0;
        padding: 0 !important;
        font-size: 12px;
        background: #0001;
    }

    .change-value {
        text-align: left !important;
    }

    .set_page_reputation {
        font-size: 9px;
        color: #999;
        margin: 0;
    }

    textarea.reputation-comment-input {
        width: 97% !important;
    }

    .innerts > .userClin {
        width: unset;
        float: unset;
        border-bottom: solid 1px #0005;
    }

    .innerts > .statForum {
        float: unset;
        margin-left: unset;
    }

    .statForum dl {
        width: 220px;
    }

    ul.main_menu {
        height: auto;
    }

    /* Срезанный блок голосования */
    #containerPoll .topicPollBox {
        width: unset;
    }

    /* Палитра выбора цвета, iframe */
    #cp iframe {
        width: 100vw;
        height: calc(100vw/1.5);
    }
    </style>`);

    // Пофиксить мелкую палитру
    // Такая хрень потому что скрипт исполняется фиг пойми в каком контексте,
    // и коллбеки с кнопки не работают в перемешку с глобальными функциями.
    document.getElementById("colorSelector").setAttribute("onclick", "ins_colors_custom(this);");
    window.eval(`ins_colors_custom = function(d) { ins_colors(d); document.querySelector("#cp iframe").addEventListener("load", function() { let tab = this.contentWindow.document.querySelector("table"); tab.style.width = "100vw"; tab.style.height = "100vh"; }); }`);
})();
