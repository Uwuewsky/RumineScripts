// ==UserScript==
// @name         Rumine Direct Link
// @version      1.0
// @description  Скрипт для замены ссылок-переходников на прямые ссылки
// @author       Sab [https://ru-minecraft.ru/user/Sab/]
// @match        https://ru-minecraft.ru/*
// @icon         https://www.google.com/s2/favicons?domain=ru-minecraft.ru
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/rumine-direct-link.user.js
// @downloadURL  https://raw.githubusercontent.com/Uwuewsky/RumineScripts/refs/heads/master/rumine-direct-link.user.js
// ==/UserScript==


(function() {
    let links = document.getElementsByTagName("a");
    for (let link of links) {
        if (!link.href) continue;
        try {
            if (link.href.startsWith("https://ru-minecraft.ru/out")) {
                link.href = atob(decodeURIComponent(link.href.slice(32)))
            }
        } catch (e) {
            console.error("Возникла ашыпка в Rumine Direct Link:", link.href);
        }
    }
})();
