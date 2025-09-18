import {LitElement, html} from "lit";

export class CalcService extends EventTarget {
    #data = 1000;

    get data() {
        return this.#data;
    }

    set data(value) {
        if (this.#data !== value) {
            this.#data = value;
            const doubled = this.#data * 2;
            this.dispatchEvent(new CustomEvent("data-changed", {
                detail: { value: this.#data, doubled }
            }));
        }
    }
}