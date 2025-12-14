// ==UserScript==
// @name         Rumine Mobile Compact Style
// @version      1.2
// @description  Скрипт для стилизации форума ru-minecraft.ru под IRC
// @author       Sab [https://ru-minecraft.ru/user/Sab/]
// @match        https://ru-minecraft.ru/forum/showtopic-*
// @icon         https://www.google.com/s2/favicons?domain=ru-minecraft.ru
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/compact-mobile.user.js
// @downloadURL  https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/compact-mobile.user.js
// ==/UserScript==


(function() {
function initIrcScript() {
    injectStyles();
    moveNavigationToBottom()
    restyleUserInfoBlocks();
}

function injectStyles() {
    /*
     * Стили для сообщений;
     */
    document.head.insertAdjacentHTML("beforeend",
    `<style id="ircScriptStyles">
    .ircPost .msgText {
        margin-bottom: 0;
    }

    .ircPost .msgText table {
        margin: 2px 0;
    }

    .ircPost div[class^="likeBox"] > div {
        border: none;
        border-top: 1px solid #CACACA;
        border-radius: 0;
    }

    #header, .ComplaintMessageLinck,
    .controlMsgBox.msgIControl br, .signature, .signature ~ * {
        display: none;
    }

    .ircPost div[class^="likeBox"] div {
        background: none !important;
        font-size: 10px;
        padding: 0 5px;
        opacity: 75%;
    }

    .ircPost .avatar img {
        width: 60px;
        height: auto;
        max-height: 60px !important;
        max-width: 60px !important;
    }

    .ircPost .msgIControl {
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: unset;
        height: unset;
        margin-top: 2px;
    }

    .ircPost .controlMsgBox.msgIControl a {
        border: 1px solid #A5CAE4;
        padding: 2px 10px;
        background: linear-gradient(#eef3f9 0%, #e6edf3 85%, #E8E8E8 100%);
        font-size: 10px !important;
        border-radius: 3px;
        color: #2b485c;
    }

    .ircPost .EditMsgView {
        font-size: 10px;
        opacity: 75%;
        margin-top: 10px;
        padding: 0 5px;
        color: #2a2a2a;
    }

    .ircPost .blockav {
        display: inline-block;
        width: auto;
        vertical-align: middle;
    }

    .ircPost .msginfoa {
        height: auto;
        min-height: 70px;
        max-height: 70px;
    }

    .ircPost .repamsg {
        font-size: 12px;
        width: auto;
        padding-left: 0;
        position: unset;
        margin-top: 0;
        display: inline-block;
        margin-left: 10px;
    }

    .ircPost .offlinest, .ircPost .onlinest {
        padding-left: 0;
    }

    .ircAuthorBlock {
        display: inline-block;
    }

    .ircAuthorBlock .namestyle a, .ircAuthorBlock > b {
        margin-right: 10px;
        font-size: 12px;
    }

    .ircPost .msgInfo {
        position: unset;
    }

    .ircPost .msgInfo > div:not(.msgIControl) {
        display: inline-block;
    }
    </style>`);
}

function restyleUserInfoBlocks() {
    let posts = document.querySelectorAll(".msg");
    posts.forEach((post)=>{
        post.classList.add("ircPost");

        let e = post.querySelector(".msginfoa");
        if (e == null) { return; }

        let block = document.createElement("div");
        block.className = "ircAuthorBlock"

        let blockinfo1 = e.querySelector(".blockinfo1");
        let messages1 = blockinfo1.childNodes[4].textContent.trim();
        let messages2 = blockinfo1.childNodes[6].textContent.trim();
        let message_status = document.createElement("span");
        message_status.textContent = messages1 + " / " + (messages2.slice(10) || 0)

        let blockinfo2 = e.querySelector(".blockinfo2");
        let name = e.querySelector(".namestyle");
        let group
        group = blockinfo2.querySelector("b");
        if (group == null) {
            group = document.createElement("b");
            group.textContent = "YMER";
        }

        let online = e.querySelector(".onlinest");
        let offline = e.querySelector(".offlinest");
        let online_status = document.createElement("span");
        if (online.textContent.trim() == "") {
            online_status = offline;
            e.removeChild(online)
        } else {
            online_status = online;
            e.removeChild(offline)
        }

        let reputation = e.querySelector(".repamsg");

        let control_buttons = post.querySelector(".controlMsgBox.msgIControl");
        control_buttons.querySelectorAll("a").forEach((a)=>{
            if (a.textContent == "Ответить") {
                a.textContent = "↩"
            // } else if  (a.textContent == "Мне нравится") {
            //     a.textContent = "❤"
            // } else if  (a.textContent == "Больше не нравится") {
            //     a.textContent = "💔"
            } else if  (a.textContent == "Редактировать") {
                a.textContent = "✎"
            }
        })

        block.append(name)
        block.append(group)
        block.append(document.createElement("br"))
        block.append(message_status)
        block.append(document.createElement("br"))
        block.append(online_status)
        block.append(reputation)

        e.removeChild(blockinfo1)
        e.removeChild(blockinfo2)
        e.append(block)

        post.querySelector(".msgInfo").append(control_buttons)
    });
}

function moveNavigationToBottom() {
    let root = document.getElementById("bullet_energy")
    let nav1 = root.querySelector(".navigate_forum")
    let nav2 = root.querySelector(".top_box")

    root.removeChild(nav1)
    root.removeChild(nav2)

    root.appendChild(nav2)
    root.appendChild(nav1)
}

initIrcScript();
})();
