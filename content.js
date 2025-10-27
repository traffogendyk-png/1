// content.js - Оновлено для локального завантаження

function runOnInteractive(e) {
    // Ця функція чекає, поки DOM буде повністю готовий
    if ("complete" != document.readyState && "interactive" != document.readyState) {
        document.onreadystatechange = function () {
            if ("interactive" == document.readyState) e();
        };
    } else {
        e();
    }
}

// Функція, яка запускає ініціалізацію плагіна
function initializePlugin() {
    // 1. Інжекція локальних стилів (plugin.css)
    // Використовуємо chrome.runtime.getURL для отримання локального шляху до файлу
    var styleLink = document.createElement("link");
    styleLink.setAttribute("href", chrome.runtime.getURL("plugin.css"));
    styleLink.setAttribute("type", "text/css");
    styleLink.setAttribute("rel", "stylesheet");
    (document.head || document.documentElement).appendChild(styleLink);

    // 2. Інжекція локального коду (plugin.js)
    // Завантажуємо plugin.js в контекст сторінки.
    // У plugin.js має бути вся основна логіка (включаючи drawWindow1() та Tern_run())
    var script = document.createElement("script");
    script.setAttribute("src", chrome.runtime.getURL("plugin.js"));
    (document.body || document.documentElement).appendChild(script);

    // У цьому спрощеному варіанті ми ігноруємо старий код FingerprintJS та file_get_contents.
    // Увесь запуск інтерфейсу тепер повинен відбуватися всередині plugin.js.
}


// Запуск ініціалізації, коли DOM готовий
runOnInteractive(initializePlugin);

// ПРИМІТКА: Старі функції, як-от setScript, setStyle, file_get_contents
// та вся логіка з FingerprintJS і eval() повністю видалені,
// оскільки вони були призначені для зовнішнього завантаження.