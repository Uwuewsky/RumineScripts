// ==UserScript==
// @name         Rumine Convert to HTML-code
// @version      1.0.1
// @description  Скрипт для конвертации крокозябр в html-код
// @author       Sab [https://ru-minecraft.ru/user/Sab/]
// @match        https://ru-minecraft.ru/forum/showtopic-*
// @icon         https://www.google.com/s2/favicons?domain=ru-minecraft.ru
// @updateURL    https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/convert-code.user.js
// @downloadURL  https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/convert-code.user.js
// @grant        none
// ==/UserScript==


(function() {

let bb_panel = document.body.querySelector("ol.bbcode_forum");
let button = document.createElement("li");
button.innerHTML = `<span
                     title="Конвертировать Unicode "
                     style="background-position: -260px 0 !important;">
                    </span>`;
button.onclick = () => { convertMessage() };
bb_panel.insertAdjacentElement("beforeend", button);

function convertToNumericEntities(str) {

    if (!str) return str;

    const punctuation = new Set(Array.from(".,!?;:()[]{}+-=_/\\…—–'\"<>&*…~°•¤_@#€$%^"));
    let result = "";

    for (const char of str) {
        const cp = char.codePointAt(0);
        const isBasic = /[A-Za-z0-9А-Яа-яЁё\s]/.test(char) || punctuation.has(char);

        result += isBasic ? char : `&#${cp};`;
    }
    return result;
}

function convertMessage() {
    let text_area = document.getElementById("text_msg");
    text_area.value = convertToNumericEntities(text_area.value);
}

})();
