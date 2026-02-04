"use strict";
const config_form = document.getElementById('config_form');
if (config_form) {
    config_form.addEventListener('submit', (event) => {
        // handle the form data
        event.preventDefault();
        const iterations_element = document.getElementById('iterations');
        const seed_element = document.getElementById('seed');
        const flintas_element = document.getElementById('flintas');
        const males_element = document.getElementById('males');
        const result_block = document.getElementById("result");
        console.log(iterations_element);
        let error_happened = false;
        config.seed = parseInt(seed_element.value);
        if (!config.seed) {
            console.log("invalid seed");
            seed_element.parentElement?.classList.add('error');
            error_happened = true;
        }
        config.flintas = flintas_element.value.split(',').map(x => x.trim());
        config.males = males_element.value.split(',').map(x => x.trim());
        config.ITERATIONS = parseInt(iterations_element.value);
        if (!config.ITERATIONS) {
            console.log("invalid iterations");
            iterations_element.parentElement?.classList.add('error');
            error_happened = true;
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
    });
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
        if (value)
            document.getElementById(key).value = value;
    });
}
//# sourceMappingURL=handle_config_form.js.map