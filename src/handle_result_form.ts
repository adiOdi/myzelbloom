const result_form = document.getElementById('result_form') as HTMLFormElement;
if (result_form) {
    const config_element = document.getElementById('config') as HTMLInputElement;
    const name_element = document.getElementById('name') as HTMLInputElement;
    const filter_element = document.getElementById('filters') as HTMLInputElement;
    const elements: { [key: string]: HTMLInputElement } = { config: config_element, name: name_element, filters: filter_element };
    result_form.addEventListener('submit', (event) => {
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

        const exists = (name: string) => { return (config.flintas.includes(name) || config.males.includes(name)); };
        if (!exists(name_element.value)) {
            console.log("invalid name");
            name_element.parentElement?.classList.add('error');
            error_happened = true;
        } else {
            name_element.parentElement?.classList.remove('error');
            localStorage.setItem("name", name_element.value);
        }
        filter_element.parentElement?.classList.remove('error');
        let filter = new BloomFilter();
        if (filter_element.value) {
            let filters = filter_element.value.split(',').map((x) => x.trim());
            if (filters.length != config.males.length + config.flintas.length) {
                console.warn("maybe not all filters here?");
                filter_element.parentElement?.classList.add('error');
            }
            filters.forEach(element => {
                filter.import(element);
            });
            localStorage.setItem("filters", filter_element.value);
        } else {
            filter_element.parentElement?.classList.add('error');
        }
        const result = result_block.children[1] as HTMLElement;
        const resulting_myzel = getValidMyzel(filter);
        let result_string = "";
        if (!error_happened)
            result_string = resulting_myzel?.printPerson(name_element.value) || "";
        if (!result_string) {
            error_happened = true;
        }
        if (error_happened) {
            result_block.classList.remove("visible");
            return;
        }
        if (result && result_block) {
            result_block.classList.add("visible");
            result.innerText = result_string || "";
        }
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