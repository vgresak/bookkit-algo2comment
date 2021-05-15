// ==UserScript==
// @name         Bookkit algo2comment
// @namespace    https://github.com/vgresak/bookkit_algo2comment
// @version      0.1.0
// @description  Creates button to copy uuCmd algorithm into clipboard with proper formatting.
// @author       Viktor Grešák
// @match        https://*/uu-bookkitg01-main/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @run-at       document-end
// ==/UserScript==

(async function () {
    'use strict';
    setInterval(initPage, 1000);
})();

function initPage() {
    if (!isPageReady() || $("#algo2comment-btn").length) {
        console.log("page not ready or already initialized");
        return;
    }
    console.log("page ready");
    $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm .uup-bricks-infoicon-header").after(addCopyBtn);
};

function isPageReady() {
    const hasAlgorithm = $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm").length;
    return hasAlgorithm;
};

async function copyTextToClipboard(text) {
    const copyInput = $(`<textarea id="copyInput"/>`);
    copyInput.val(text);
    const body = $("body");
    copyInput.appendTo(body);
    copyInput.select();
    copyInput.focus();
    document.execCommand("copy");
    copyInput.remove();
}

function addCopyBtn() {
    const btn = $("<a id=\"algo2comment-btn\" class=\"uu5-bricks-button uu5-bricks-button-m uu5-bricks-button-filled\">Copy</a>");
    btn.click(async (e) => {
        e.preventDefault();
        await copyTextToClipboard(getCommentFromAlgorithm());
    });
    return btn;
}

function getCommentFromAlgorithm() {
    const statements = $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm .uu-uuapp-designkit-block>.uu-uuapp-designkit-statement .uu-uuapp-designkit-common-statement-labels>span.uu5-bricks-span");
    let result = "";

    statements.each(function () {
        const step = $(this).text();
        const stepContent = $(this).closest(".uu-uuapp-designkit-common-statement-main-content");
        const conditionText = stepContent.find(".uu-uuapp-designkit-common-statement-condition>.uu-uuapp-designkit-common-statement-condition-wrapper>.uu5-common-div>.uu5-common-div").text();
        const stepText = stepContent.find(".uu-uuapp-designkit-common-statement-desc>.uu5-common-div").text();
        if (conditionText) {
            result += `// ${step} If ${conditionText}\n// ${stepText}\n`;
        } else {
            result += `// ${step} ${stepText}\n`;
        }

    });

    return result;
}

