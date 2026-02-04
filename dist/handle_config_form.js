"use strict";
const config_form = document.getElementById('config_form');
if (config_form) {
    const iterations_element = document.getElementById('iterations');
    const seed_element = document.getElementById('seed');
    const flintas_element = document.getElementById('flintas');
    const males_element = document.getElementById('males');
    const elements = { iterations: iterations_element, seed: seed_element, flintas: flintas_element, males: males_element };
    config_form.addEventListener('submit', (event) => {
        // handle the form data
        event.preventDefault();
        const result_block = document.getElementById("result");
        let error_happened = false;
        config.seed = parseInt(seed_element.value);
        if (!config.seed) {
            console.log("invalid seed");
            seed_element.parentElement?.classList.add('error');
            error_happened = true;
        }
        else {
            localStorage.setItem("seed", seed_element.value);
            iterations_element.parentElement?.classList.remove('error');
        }
        config.flintas = flintas_element.value.split(',').map(x => x.trim());
        localStorage.setItem("flintas", flintas_element.value);
        config.males = males_element.value.split(',').map(x => x.trim());
        localStorage.setItem("males", males_element.value);
        config.ITERATIONS = parseInt(iterations_element.value);
        if (!config.ITERATIONS) {
            console.log("invalid iterations");
            iterations_element.parentElement?.classList.add('error');
            error_happened = true;
        }
        else {
            localStorage.setItem("iterations", iterations_element.value);
            iterations_element.parentElement?.classList.remove('error');
        }
        if (error_happened) {
            result_block.classList.remove("visible");
            return;
        }
        const result = result_block.children[1];
        const result_string = btoa(JSON.stringify(config));
        if (result && result_block) {
            result_block.classList.add("visible");
            result.innerText = result_string;
        }
        // copy result_string to clipboard
        navigator.clipboard.writeText(result_string)
            .then(() => console.log('Content written successfully'))
            .catch(err => console.error('Could not write text:', err));
        localStorage.setItem("config", result_string);
    });
    const urlParams = new URLSearchParams(window.location.search);
    for (const key in elements) {
        if (!Object.hasOwn(elements, key))
            continue;
        const element = elements[key];
        if (!element || !key)
            continue;
        const value = localStorage.getItem(key);
        if (value)
            element.value = value;
    }
    urlParams.forEach((value, key) => {
        if (value && elements[key])
            elements[key].value = value;
    });
}
//# sourceMappingURL=handle_config_form.js.map