"use strict";
const set_form = document.getElementById('set');
if (set_form) {
    set_form.addEventListener('submit', (event) => {
        // handle the form data
        event.preventDefault();
        const config_element = document.getElementById('config');
        const name_element = document.getElementById('name');
        const not_for_element = document.getElementById('not_for');
        const not_from_element = document.getElementById('not_from');
        const result_block = document.getElementById("result");
        result_block.classList.remove("visible");
        let error_happened = false;
        try {
            config = JSON.parse(atob(config_element.value));
            config_element.parentElement?.classList.remove('error');
        }
        catch (error) {
            error_happened = true;
            config_element.parentElement?.classList.add('error');
            console.log(error);
        }
        let preferences = {
            name: "",
            not_for: [""],
            not_from: [""]
        };
        const exists = (name) => { return (config.flintas.includes(name) || config.males.includes(name)); };
        if (!exists(name_element.value)) {
            console.log("invalid name");
            name_element.parentElement?.classList.add('error');
            error_happened = true;
        }
        else {
            name_element.parentElement?.classList.remove('error');
            preferences.name = name_element.value;
        }
        not_for_element.parentElement?.classList.remove('error');
        if (not_for_element.value) {
            let not_for_array = not_for_element.value.split(',');
            preferences.not_for = not_for_array.map((x) => x.trim());
            preferences.not_for.forEach(element => {
                if (!exists(element) || element == preferences.name) {
                    console.log("invalid name in for");
                    not_for_element.parentElement?.classList.add('error');
                    error_happened = true;
                    return;
                }
            });
        }
        not_from_element.parentElement?.classList.remove('error');
        if (not_from_element.value) {
            let not_from_array = not_from_element.value.split(',');
            preferences.not_from = not_from_array.map((x) => x.trim());
            preferences.not_from.forEach(element => {
                if (!exists(element) || element == preferences.name) {
                    console.log("invalid name in from");
                    not_from_element.parentElement?.classList.add('error');
                    error_happened = true;
                    return;
                }
            });
        }
        console.log(preferences);
        if (error_happened) {
            result_block.classList.remove("visible");
            return;
        }
        let nots = [[]];
        preferences.not_for.forEach(element => {
            nots.push([element, preferences.name]);
        });
        preferences.not_from.forEach(element => {
            nots.push([preferences.name, element]);
        });
        const result = result_block.children[1];
        const result_string = setPreferences(nots);
        console.log(result_string);
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
//# sourceMappingURL=handle_set_form.js.map