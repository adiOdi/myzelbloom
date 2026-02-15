"use strict";
/**
 * a myzel contains an ordered list of people,
 * where the relationships between the positions
 * remains fixed, while the people can move around
 * in the myzel.
 */
class Myzel {
    /**
     * constructs a Myzel from the lists contained in config
     */
    constructor() {
        this.males = [];
        this.flintas = [];
        config.males.forEach(element => {
            let id = 0;
            for (let index = 0; index < element.length; index++) {
                id += element.charCodeAt(index) * index;
            }
            id %= 1024;
            const name = element;
            const new_person = { id, name };
            this.males.push(new_person);
        });
        config.flintas.forEach(element => {
            let id = 0;
            for (let index = 0; index < element.length; index++) {
                id += element.charCodeAt(index) * index;
            }
            id %= 1024;
            const name = element;
            const new_person = { id, name };
            this.flintas.push(new_person);
        });
        this.males.sort((a, b) => { return a.id - b.id; });
        this.flintas.sort((a, b) => { return a.id - b.id; });
        this.all = this.males.concat(this.flintas);
        this.permutation_counter = 0;
        const factorial = (n) => {
            return n <= 1 ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((acc, val) => acc * val, 1);
        };
        this.males_length_factorial = factorial(this.males.length);
        const nr_permutations = factorial(this.flintas.length) * this.males_length_factorial;
        if (nr_permutations <= config.ITERATIONS) {
            // when we have that many iterations, we should just try all permutations
            config.ITERATIONS = nr_permutations;
            this.use_random_mix = false;
        }
        else {
            this.use_random_mix = true;
        }
    }
    /**
     * Shuffle the males and flintas lists in random order.
     */
    mix() {
        if (this.use_random_mix) {
            this.males.sort((a, b) => { return PseudoRandomGenerator.instance().next() - 0.5; });
            this.flintas.sort((a, b) => { return PseudoRandomGenerator.instance().next() - 0.5; });
        }
        else {
            this.nextPermutation(this.males);
            if (++this.permutation_counter >= this.males_length_factorial) {
                this.nextPermutation(this.flintas);
                this.permutation_counter = 0;
            }
        }
        this.all = this.males.concat(this.flintas);
    }
    /**
     * generates the next ordering of people,
     * in the end every order of males and females has been tried.
     * it dos not return anything, but changes the state of the lists.
     */
    nextPermutation(nums) {
        // Helper function to reverse a portion of the array
        const reverse = (start, end) => {
            while (start < end) {
                [nums[start], nums[end]] = [nums[end], nums[start]];
                start++;
                end--;
            }
        };
        let n = nums.length;
        let k = -1;
        // Step 1: Find the largest index k such that nums[k] < nums[k + 1]
        for (let i = n - 2; i >= 0; i--) {
            if (nums[i].id < nums[i + 1].id) {
                k = i;
                break;
            }
        }
        // Step 2: If no such index exists, reverse the entire array
        if (k === -1) {
            reverse(0, n - 1);
            return;
        }
        // Step 3: Find the largest index l greater than k such that nums[k] < nums[l]
        let l = -1;
        for (let i = n - 1; i > k; i--) {
            if (nums[i].id > nums[k].id) {
                l = i;
                break;
            }
        }
        // Step 4: Swap the values at indices k and l
        [nums[k], nums[l]] = [nums[l], nums[k]];
        // Step 5: Reverse the sequence from index k + 1 to the end
        reverse(k + 1, n - 1);
    }
    /**
     * Calculates two hashes for the Myzel.
     */
    hash() {
        let i = 0;
        const maleHashValues = this.males.map(person => person.id * ++i % config.BLOOMLENGTH);
        let hashValue1 = maleHashValues.reduce((a, b) => (a + b) % config.BLOOMLENGTH, 0);
        i = 321;
        const flintaHashValues = this.flintas.map(person => person.id * ++i % config.BLOOMLENGTH);
        let hashValue2 = flintaHashValues.reduce((a, b) => (a + b) % config.BLOOMLENGTH, 0);
        return [Math.abs(hashValue1), Math.abs(hashValue2)];
    }
    // helper function to check if two persons of same gender are next to each other (b cares for a)
    caresForSameGender(person_a, person_b, list) {
        const a_index = list.findIndex((p => p.id === person_a.id));
        const b_index = list.findIndex((p => p.id === person_b.id));
        if (a_index == -1 || b_index == -1) {
            console.log("Person not found");
            return false;
        }
        return (a_index + 1) % list.length === b_index;
    }
    /**
     * wether person_b cares for person_a
     */
    caresFor(person_a, person_b) {
        const is_a_male = this.males.find((p => p.id === person_a.id)) != undefined;
        const is_b_male = this.males.find((p => p.id === person_b.id)) != undefined;
        let cares_for = false;
        if (is_a_male && is_b_male) {
            cares_for = this.caresForSameGender(person_a, person_b, this.males);
        }
        else if (!is_a_male && !is_b_male) {
            cares_for = this.caresForSameGender(person_a, person_b, this.flintas);
        }
        const a_index = this.all.findIndex((p => p.id === person_a.id));
        const b_index = this.all.findIndex((p => p.id === person_b.id));
        if (a_index == -1 || b_index == -1) {
            console.log("Person not found");
            return false;
        }
        return cares_for || b_index === ((a_index + this.males.length) % this.all.length);
    }
    /**
     * wether person_b cares for person_a
     * (by string name)
     */
    caresForN(person_a_name, person_b_name) {
        const person_a = this.get(person_a_name);
        const person_b = this.get(person_b_name);
        if (!person_a || !person_b) {
            console.log("Person not found");
            return false;
        }
        return this.caresFor(person_a, person_b);
    }
    /**
     * get a person by their name
     */
    get(name) {
        return this.males.find((p => p.name === name)) || this.flintas.find((p => p.name === name));
    }
    /**
     * print the care relationship
     * of all the people in the care system
     */
    print() {
        for (let index = 0; index < this.males.length; index++) {
            const person = this.males[index]?.name;
            const carer_1 = this.males[(index + 1) % this.males.length]?.name;
            const carer_2 = this.all[(index + this.males.length) % this.all.length]?.name;
            console.log(`${person} is cared for by ${carer_1} and ${carer_2}`);
        }
        for (let index = 0; index < this.flintas.length; index++) {
            const person = this.flintas[index]?.name;
            const carer_1 = this.flintas[(index + 1) % this.flintas.length]?.name;
            const carer_2 = this.all[(index + this.males.length * 2) % this.all.length]?.name;
            console.log(`${person} is cared for by ${carer_1} and ${carer_2}`);
        }
    }
    printList() {
        let string = "";
        this.all.forEach((p) => {
            string += p.name + ", ";
        });
        string = string.slice(0, -2);
        console.log(string);
    }
    printPerson(name) {
        let person_index = this.males.findIndex((p) => p.name === name);
        if (person_index != -1) {
            const carer_1 = this.males[(person_index + 1) % this.males.length]?.name;
            const carer_2 = this.all[(person_index + this.males.length) % this.all.length]?.name;
            console.log(`${name} is cared for by ${carer_1} and ${carer_2}`);
            return `${name} is cared for by ${carer_1} and ${carer_2}`;
        }
        person_index = this.flintas.findIndex((p) => p.name === name);
        if (person_index != -1) {
            const carer_1 = this.flintas[(person_index + 1) % this.flintas.length]?.name;
            const carer_2 = this.all[(person_index + this.males.length * 2) % this.all.length]?.name;
            console.log(`${name} is cared for by ${carer_1} and ${carer_2}`);
            return `${name} is cared for by ${carer_1} and ${carer_2}`;
        }
        console.log(`person ${name} does not exist`);
        return undefined;
    }
    males;
    flintas;
    all;
    permutation_counter;
    males_length_factorial;
    use_random_mix;
}
/**
 * a bloomfilter can reveal if a thing has definitely never been added.
 * it works by hashing the thing, and setting the corresponding entry in a bitmap.
 * as there are supposed to be collisions happening, having a bit set does not guarantee
 * a certain thing has really been added, but if the bit is not set, it was definitely not.
 */
class BloomFilter {
    constructor() {
        this.bloomfilter = new Uint8Array(Math.ceil(config.BLOOMLENGTH / 8));
    }
    // set the bloom filter at a specific index to 1
    setAtIndex(index) {
        let number_index = Math.floor(index / 8);
        let inner_index = index % 8;
        let filter = this.bloomfilter[number_index];
        if (filter != undefined) {
            filter |= (1) << inner_index;
            this.bloomfilter[number_index] = filter;
        }
    }
    // get the bloom filter at a specific index
    getAtIndex(index) {
        let number_index = Math.floor(index / 8);
        let inner_index = index % 8;
        let filter = this.bloomfilter[number_index];
        if (filter)
            return ((filter >> inner_index) & 1) == 1;
        return false;
    }
    /**
     * sets the bits of the bloom filters at the hashed indexes to 1
     */
    set(myzel) {
        let hashes = myzel.hash();
        for (const hash of hashes) {
            this.setAtIndex(hash);
        }
    }
    /**
     * checks if the Myzel might have been added before.
     * when this returns true, this does not mean a certein Myzel was added.
     * when it returns false, a certain Myzel was definitely not added to the filter.
     */
    mightContain(myzel) {
        let hashes = myzel.hash();
        for (const hash of hashes) {
            if (!this.getAtIndex(hash))
                return false;
        }
        return true;
    }
    print() {
        console.log("filter is:");
        for (const element of this.bloomfilter) {
            console.log(element.toString(2).padStart(8, '0'));
        }
        console.log("checksum is: " + this.export());
    }
    export() {
        console.log("filter is:");
        for (const element of this.bloomfilter) {
            console.log(element.toString(2).padStart(8, '0'));
        }
        let string = String.fromCodePoint(...this.bloomfilter);
        console.log("string is:", string);
        return btoa(string).replaceAll('=', '~').replaceAll('+', '-').replaceAll('/', '_');
        let checksum = "";
        for (const element of this.bloomfilter) {
            checksum = checksum.concat(element.toString(32).padStart(7, '0'));
        }
        return checksum;
    }
    import(checksum) {
        let string = atob(checksum.replaceAll('~', '=').replaceAll('-', '+').replaceAll('_', '/'));
        console.log("string is:", string);
        for (let index = 0; index < this.bloomfilter.length; index++) {
            this.bloomfilter[index] = string.charCodeAt(index);
        }
        // for (let index = 0; index < this.bloomfilter.length; index++) {
        //     let new_value = parseInt(checksum.substring(index * 7, index * 7 + 7), 32);
        //     const old_value = this.bloomfilter[index];
        //     if (old_value) {
        //         new_value |= old_value;
        //     }
        //     this.bloomfilter[index] = new_value;
        // }
        console.log("filter is:");
        for (const element of this.bloomfilter) {
            console.log(element.toString(2).padStart(8, '0'));
        }
    }
    bloomfilter;
}
class PseudoRandomGenerator {
    constructor() {
        this.state = 0;
        this.restart();
    }
    next() {
        let t = this.state += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    restart() {
        this.seed(config.seed);
    }
    seed(seed) {
        this.state = seed;
    }
    static instance() {
        if (PseudoRandomGenerator.inst) {
            return PseudoRandomGenerator.inst;
        }
        PseudoRandomGenerator.inst = new PseudoRandomGenerator();
        return PseudoRandomGenerator.inst;
    }
    state;
    static inst;
}
/**
 * fills a filter with all forbidden care constructs
 *
 * @param filter the filter to modify
 * @param nots the list of forbidden care constructs
 */
function fillFilterWithPreferences(filter, nots) {
    let myzel = new Myzel();
    PseudoRandomGenerator.instance().restart();
    for (let i = 0; i < config.ITERATIONS; ++i) {
        myzel.mix();
        let any_issues = false;
        for (const not of nots) {
            if (myzel.caresForN(not[0] || "", not[1] || "")) {
                any_issues = true;
                break;
            }
        }
        if (any_issues) {
            filter.set(myzel);
        }
    }
}
/**
 * returns a random Myzel that is not in the filter
 *
 * @param filter the filter to check against
 */
function getValidMyzel(filter) {
    let real_myzel = new Myzel();
    PseudoRandomGenerator.instance().restart();
    for (let i = 0; i < config.ITERATIONS; ++i) {
        real_myzel.mix();
        if (!filter.mightContain(real_myzel)) {
            return real_myzel;
        }
    }
}
let config = {
    ITERATIONS: 0,
    BLOOMLENGTH: 0,
    males: [""],
    flintas: [""],
    seed: 0,
};
/**
 * calculate a bloom filter given some preferences
 *
 * @param nots forbidden care connections
 * @returns an encoded bloom filter as a atring
 */
function setPreferences(nots) {
    let filter = new BloomFilter();
    fillFilterWithPreferences(filter, nots);
    return (filter.export());
}
/**
 * get a valid myzel considering the bloom filters
 *
 * @param filter_strings an array of encoded bloom filters
 * @returns a valid myzel or undefined if no valid myzel could be found
 */
function getResult(filter_strings) {
    let filter = new BloomFilter();
    filter_strings.forEach(filter_string => {
        filter.import(filter_string);
    });
    let myzel = getValidMyzel(filter);
    if (myzel == undefined) {
        console.log("no valid myzel found");
        return;
    }
    myzel.print();
    return myzel;
}
/**
 * filter is: script.ts:320:17
10100101 script.ts:322:21
10101010 script.ts:322:21
11000111 script.ts:322:21
10101111 script.ts:322:21
string is: ¥ªÇ¯ script.ts:325:17
parHrw==
10100101 script.ts:348:21
10101010 script.ts:348:21
11000111 script.ts:348:21
10101111
 */
/**
128:parHr3PvnevHu0rptm3bJg==
120:9qyfqm+v6u2r8nvexINH
 80:d+7/q///3O2rbw==
*/ 
//# sourceMappingURL=script.js.map