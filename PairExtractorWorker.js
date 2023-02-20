addEventListener('message', string =>   {postMessage(pairFinderV2regexV4(string.data));
                                        //  postMessage(pairFinderV2regexV4(string.data))
})


/**
 * Finds pairs of words in a string, separated by white space or a single hyphen.
 * 
 * The words may only contain characters: [a-z] [A-Z] and apostrophes
 * (not more than 1 contiguous).
 * 
 * Counts the frequency of the pairs throughout the given string.
 * 
 * Returns a list of list(s) with the frequency count in descending order
 * and the words, in lower case, in the following format [[count, word 1, word 2],...]
 */
function pairFinderV2regexV4 (string){
    //the regular expression finds words joined phonetically in one of 4 groups:
    // group1: nested words (may contain any group)
    // group2: join left only
    // group3: join left & right
    // group4: invalid words
    // const regxv3 = /((?:(?<=\s)“.+?”(?=.?\s))|(?:(?<=\s)‘.+?’(?=.?\s))|(?:(?<=\s)\(.+?\)(?=.?\s))|(?:(?<=\s)\[.+?\](?=.?\s))|(?:(?<=\s)".+?"(?=.?\s))|(?:(?<=\s){.+?}(?=.?\s))|(?:(?<=\s)—.+?—(?=.?\s))|(?:(?<=\s)<.+?>(?=.?\s))|(?:(?<=\s)¿.+?\?(?=.?\s))|(?:(?<=\s)¡.+?!(?=.?\s))|(?:(?<=\s)《.+?》(?=.?\s))|(?:(?<=\s)\|.+?\|(?=.?\s))|(?:(?<=\s)⸘.+?‽(?=.?\s))|(?:(?<=\s)–.+?–(?=.?\s))|(?:(?<=\s)`.+?`(?=.?\s)))|((?![a-z]+[’'-]{2,}[a-z]+)(?<=\s|^)'?[a-z]+[a-z’'-]*[,!?‽.:;](?=[^a-z]|$))|((?![a-z]+[’'-]{2,}[a-z]+)(?<=\s|^)'?[a-z]+[a-z’'-]*(?=\s|$))|(\S+[^a-z-’']*?)/img
    const start = performance.now()
    const regxv4 = /((?:(?<=\s)“.+?”(?=.?\s))|(?:(?<=\s)‘.+?’(?=.?\s))|(?:(?<=\s)\(.+?\)(?=.?\s))|(?:(?<=\s)\[.+?\](?=.?\s))|(?:(?<=\s)".+?"(?=.?\s))|(?:(?<=\s){.+?}(?=.?\s))|(?:(?<=\s)—.+?—(?=.?\s))|(?:(?<=\s)<.+?>(?=.?\s))|(?:(?<=\s)¿.+?\?(?=.?\s))|(?:(?<=\s)¡.+?!(?=.?\s))|(?:(?<=\s)《.+?》(?=.?\s))|(?:(?<=\s)\|.+?\|(?=.?\s))|(?:(?<=\s)⸘.+?‽(?=.?\s))|(?:(?<=\s)–.+?–(?=.?\s))|(?:(?<=\s)`.+?`(?=.?\s)))|((?![a-z]+[’'-]{2,}[a-z]+)(?<=(?:\s|^)[—―]?|[a-z]-)'?[a-z]+[a-z’']*[,!?‽.:;](?=[^a-z]|$))|((?![a-z]+[’'-]{2,}[a-z]+)(?<=(?:\s|^)[—―]?|[a-z]-)'?[a-z]+[a-z’']*(?=(?:-[a-z])|\s|$))|((?!-[a-z]|—[a-z]|―[a-z])\S+[^a-z-’']*?)/gim
    const mainIter = string.matchAll(regxv4)
    let pairsList = new Map
    wordFinder (mainIter)

    function join(a, b){
        a = a.toLowerCase()
        b = b.toLowerCase()
        const key = `${a}.${b}` //period to separate coincidences such as "a tone" and "at one" => "atone"
        const value = {count:1, a:a, b:b}
        if (pairsList.has(key)) {
            value.count = pairsList.get(key).count +1
            pairsList.set(key,value)}
        else pairsList.set(key,value)
    }

    function wordFinder(stringIter){
        let a,b
        let carry = false
        do {
        if (carry === true ){a = b}
        else {a = stringIter.next().value}
        if (a === undefined) { break}
       
        if (a[2] !== undefined || a[4] !== undefined) {continue}
        if (a[1] !== undefined) {wordFinder(a[1].slice(1,-1).matchAll(regxv4)); carry=false;continue}
        b = stringIter.next().value
        if (b !== undefined && b[1] !== undefined) {wordFinder(b[1].slice(1,-1).matchAll(regxv4));carry=false; continue}
       
        if (b === undefined) { break}
        if (b[3] !== undefined){join (a[3], b[3]); carry = true}
       
        else if (b[2] !== undefined){join(a[3], b[2].slice(0,-1)); carry = false}
        else {carry = false; continue}
        } while (!stringIter.done)
    }
    console.log(`Worker took ${((performance.now() - start) / 1000).toFixed(2)} concurrent seconds.`)
    return [...pairsList.values()].sort ((a,b) => b.count - a.count)
}



