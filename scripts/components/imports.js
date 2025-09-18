import { TernaryNumber } from "./ternary-number.js";
import { TernaryControl } from "./ternary-control.js";

customElements.define('ternary-number', TernaryNumber);
customElements.define('ternary-control', TernaryControl);

export {
    TernaryNumber,
    TernaryControl
};