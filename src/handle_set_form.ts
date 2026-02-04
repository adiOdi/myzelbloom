const set_form = document.getElementById('set') as HTMLFormElement;
if (set_form) {
    const config_element = document.getElementById('config') as HTMLInputElement;
    const name_element = document.getElementById('name') as HTMLInputElement;
    const not_for_element = document.getElementById('not_for') as HTMLInputElement;
    const not_from_element = document.getElementById('not_from') as HTMLInputElement;
    const elements: { [key: string]: HTMLInputElement } = { config: config_element, name: name_element, not_for: not_for_element, not_from: not_from_element };
    set_form.addEventListener('submit', (event) => {
        // handle the form data
        event.preventDefault();

        const result_block = document.getElementById("result") as HTMLDivElement;
        result_block.classList.remove("visible");
        let error_happened: boolean = false;
        try {
            config = JSON.parse(atob(config_element.value));
            localStorage.setItem("config", config_element.value);
            config_element.parentElement?.classList.remove('error');
        } catch (error) {
            error_happened = true;
            config_element.parentElement?.classList.add('error');
            console.log(error);
        }
        let preferences = {
            name: "",
            not_for: [""],
            not_from: [""]
        };
        const exists = (name: string) => { return (config.flintas.includes(name) || config.males.includes(name)); };
        if (!exists(name_element.value)) {
            console.log("invalid name");
            name_element.parentElement?.classList.add('error');
            error_happened = true;
        } else {
            name_element.parentElement?.classList.remove('error');
            preferences.name = name_element.value;
            localStorage.setItem("name", name_element.value);
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
            if (!error_happened) {
                localStorage.setItem("not_for", not_for_element.value);
            }
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
            if (!error_happened) {
                localStorage.setItem("not_from", not_from_element.value);
            }
        }
        console.log(preferences);
        if (error_happened) {
            result_block.classList.remove("visible");
            return;
        }

        let nots: string[][] = [[]];
        preferences.not_for.forEach(element => {
            nots.push([element, preferences.name]);
        });
        preferences.not_from.forEach(element => {
            nots.push([preferences.name, element]);
        });

        const result = result_block.children[1] as HTMLElement;
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
        localStorage.setItem("filters", result_string);
    });
    const urlParams = new URLSearchParams(window.location.search);
    for (const key in elements) {
        if (!Object.hasOwn(elements, key)) continue;
        const element = elements[key];
        if (!element || !key) continue;
        const value = localStorage.getItem(key);
        if (value)
            element.value = value;
    }
    urlParams.forEach((value, key) => {
        if (value && elements[key])
            elements[key].value = value;
    });
}