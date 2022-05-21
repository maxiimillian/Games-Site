import { useRef } from "react";

function fallbackClipboard(text) {
    return document.execCommand("copy");
}

export const useFocus = () => {
    const htmlElement = useRef(null);
    const setFocus = () => {htmlElement.current && htmlElement.current.focus()}

    return [ htmlElement, setFocus ];
}

export const activateClipboard = (text) => {
    if (!navigator.clipboard) {
        return fallbackClipboard(text);
    } else {
        navigator.clipboard.writeText(text)
        .then(() => true, () => false);
    }
}