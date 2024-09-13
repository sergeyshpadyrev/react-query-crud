export const arrayStartsWith = <T>(array: T[] | ReadonlyArray<T>, prefix: T[]): boolean => {
    if (prefix.length > array.length) return false;

    for (let i = 0; i < prefix.length; i++) {
        if (array[i] !== prefix[i]) return false;
    }

    return true;
};
