// ==UserScript==
// @name         Bookkit algo2comment
// @namespace    https://github.com/vgresak/bookkit-algo2comment
// @version      0.1.2
// @description  Creates button to copy uuCmd algorithm into clipboard with proper formatting.
// @author       Viktor Grešák
// @match        https://*/uu-bookkitg01-main/*
// @match        https://*/uu-bookkit-maing01/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @run-at       document-end
// ==/UserScript==

(async function () {
    'use strict';
    setInterval(initPage, 1000);
})();

function initPage() {
    if (isInitialized() || !isPageReady()) {
        return;
    }
    $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm .uup-bricks-infoicon-header").after(addCopyBtn);
};

function isInitialized() {
    return $("#algo2comment-btn").length;
}

function isPageReady() {
    return $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm").length;
};

function addCopyBtn() {
    const btn = $("<a id=\"algo2comment-btn\" class=\"uu5-bricks-button uu5-bricks-button-m uu5-bricks-button-filled\">Copy</a>");
    let feedbackInProgress = false;
    btn.click(async (e) => {
        e.preventDefault();
        await copyTextToClipboard(getCommentFromAlgorithm());
        if (!feedbackInProgress) {
            feedbackInProgress = true;
            $("#algo2comment-btn").html("Copied!").delay(1000).fadeOut(500, function () {
                $(this).html("Copy").fadeIn(500);
                feedbackInProgress = false;
            });
        }
    });
    return btn;
}

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

function getCommentFromAlgorithm() {
    const steps = $(".uu-uuapp-designkit.uu-uuapp-designkit-algorithm .uu-uuapp-designkit-block>.uu-uuapp-designkit-statement .uu-uuapp-designkit-common-statement-labels>span.uu5-bricks-span");
    let result = "";
    steps.each(function () {
        result += getCommentFromStep($(this));
    });
    return result;
}

function getCommentFromStep(stepElem) {
    const stepNumber = stepElem.text();
    const stepContent = stepElem.closest(".uu-uuapp-designkit-common-statement-main-content");
    const conditionText = stepContent.find(".uu-uuapp-designkit-common-statement-condition>.uu-uuapp-designkit-common-statement-condition-wrapper>.uu5-common-div>.uu5-common-div").text();
    const stepDescription = stepContent.find(".uu-uuapp-designkit-common-statement-desc>.uu5-common-div").text();
    if (conditionText) {
        return `// ${stepNumber} If ${conditionText}\n// ${stepDescription}\n`;
    } else {
        return `// ${stepNumber} ${stepDescription}\n`;
    }
}

