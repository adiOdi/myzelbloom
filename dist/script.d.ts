interface Person {
    id: number;
    name: string;
}
/**
 * a myzel contains an ordered list of people,
 * where the relationships between the positions
 * remains fixed, while the people can move around
 * in the myzel.
 */
declare class Myzel {
    /**
     * constructs a Myzel from the lists contained in config
     */
    constructor();
    /**
     * Shuffle the males and flintas lists in random order.
     */
    mix(): void;
    /**
     * generates the next ordering of people,
     * in the end every order of males and females has been tried.
     * it dos not return anything, but changes the state of the lists.
     */
    nextPermutation(nums: Person[]): void;
    /**
     * Calculates two hashes for the Myzel.
     */
    hash(): number[];
    private caresForSameGender;
    /**
     * wether person_b cares for person_a
     */
    caresFor(person_a: Person, person_b: Person): boolean;
    /**
     * wether person_b cares for person_a
     * (by string name)
     */
    caresForN(person_a_name: string, person_b_name: string): boolean;
    /**
     * get a person by their name
     */
    get(name: string): Person | undefined;
    /**
     * print the care relationship
     * of all the people in the care system
     */
    print(): void;
    printList(): void;
    printPerson(name: string): string | undefined;
    private males;
    private flintas;
    private all;
    private permutation_counter;
    private males_length_factorial;
    private use_random_mix;
}
/**
 * a bloomfilter can reveal if a thing has definitely never been added.
 * it works by hashing the thing, and setting the corresponding entry in a bitmap.
 * as there are supposed to be collisions happening, having a bit set does not guarantee
 * a certain thing has really been added, but if the bit is not set, it was definitely not.
 */
declare class BloomFilter {
    constructor();
    private setAtIndex;
    private getAtIndex;
    /**
     * sets the bits of the bloom filters at the hashed indexes to 1
     */
    set(myzel: Myzel): void;
    /**
     * checks if the Myzel might have been added before.
     * when this returns true, this does not mean a certein Myzel was added.
     * when it returns false, a certain Myzel was definitely not added to the filter.
     */
    mightContain(myzel: Myzel): boolean;
    print(): void;
    export(): string;
    import(checksum: string): void;
    private bloomfilter;
}
declare class PseudoRandomGenerator {
    constructor();
    next(): number;
    restart(): void;
    seed(seed: number): void;
    static instance(): PseudoRandomGenerator;
    private state;
    private static inst;
}
/**
 * fills a filter with all forbidden care constructs
 *
 * @param filter the filter to modify
 * @param nots the list of forbidden care constructs
 */
declare function fillFilterWithPreferences(filter: BloomFilter, nots: string[][]): void;
/**
 * returns a random Myzel that is not in the filter
 *
 * @param filter the filter to check against
 */
declare function getValidMyzel(filter: BloomFilter): Myzel | undefined;
declare let config: {
    ITERATIONS: number;
    BLOOMLENGTH: number;
    males: string[];
    flintas: string[];
    seed: number;
};
/**
 * calculate a bloom filter given some preferences
 *
 * @param nots forbidden care connections
 * @returns an encoded bloom filter as a atring
 */
declare function setPreferences(nots: string[][]): string;
/**
 * get a valid myzel considering the bloom filters
 *
 * @param filter_strings an array of encoded bloom filters
 * @returns a valid myzel or undefined if no valid myzel could be found
 */
declare function getResult(filter_strings: string[]): Myzel | undefined;
//# sourceMappingURL=script.d.ts.map