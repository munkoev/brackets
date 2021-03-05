module.exports = function check(str, bracketsConfig) {
    // main idea here is that you:
    // 0) fill helping arrays  with brackets from bracketConfig in order of appearance in str
    // 1) go through str from left to right and try to close brackets asap (counter +1: bracket opened and vv)
    // 2) check on every str[i] if there is extra opening or closing parenthesis

    let openings = [], openings_sorted=[],
        closings_sorted=[],
        counter = [], counter_slice = [],
        booldict = [],
        arr = str.split('');

    // create arrays
    for (let j = 0; j < bracketsConfig.length; j++){
        openings.push(bracketsConfig[j][0]);
        counter.push(0);
        if (bracketsConfig[j][0] === bracketsConfig[j][1]) {booldict.push([bracketsConfig[j][0], true])}
    }
    const booldicto = Object.fromEntries(booldict);
    // console.log(booldicto, str) //for debug

    // sorting in order of appearance
    openings_sorted = openings.sort((a,b) => {return arr.indexOf(a) - arr.indexOf(b);}) //TODO refactor to function
    for (let L = 0; L < openings_sorted.length; L++) {
        for (let m = 0; m <bracketsConfig.length; m++) {
            if (bracketsConfig[m][0] === openings_sorted[L]) {closings_sorted[L] = bracketsConfig[m][1]}
        }
    }

    // main check
    for (let i = 0; i < arr.length; i++) {

        // remember previous counter
        let pre = Array.from(counter)

        // if opening=closed then use boolean switcher to check what should be done: add 1 or subtract 1 to counter[i]
        // with help of booldicto Object f/e {'|': true, '^': true}
        if (openings_sorted.indexOf(arr[i])===closings_sorted.indexOf(arr[i])) {
            if (booldicto[arr[i]]) {
                if (openings_sorted.includes(arr[i])) {
                    counter[openings_sorted.indexOf(arr[i])] += 1;
            }} else {
                    if (closings_sorted.includes(arr[i])) {
                    counter[closings_sorted.indexOf(arr[i])] -= 1;
                }
            }
            booldicto[arr[i]] = !booldicto[arr[i]];
        } else {
            if (openings_sorted.includes(arr[i])) {
                counter[openings_sorted.indexOf(arr[i])] += 1;
            }
            if (closings_sorted.includes(arr[i])) {
                counter[closings_sorted.indexOf(arr[i])] -= 1;
            }
        }

        // check if any element<0 then there is extra closing parenthesis
        if (!counter.every(ele => ele >= 0)) {
            // console.log('false 3: ', counter) //for debug
            return false;}

        // check if any counter element was closed  but there is extra open parenthesis left
        for (let k = 0; k < counter.length-1; k++) {
                counter_slice = counter.slice(k + 1, counter.length);
                if (counter[k] === 0 && pre[k] > 0 && counter_slice.some(ele => ele > 0)) {
                    // console.log('false 1: ', counter) //for debug
                    return false}
        }

        // if str can be shortened to substring (from left) then new sorting is needed for openings and closing arrays
        if (counter.every(ele => ele === 0)) {
            let subs = str.substring(i+1)
            openings_sorted = openings.sort((a,b) => {return subs.indexOf(a) - subs.indexOf(b);})
            for (let L = 0; L < openings_sorted.length; L++) {
                for (let m = 0; m <bracketsConfig.length; m++) {
                    if (bracketsConfig[m][0] === openings_sorted[L]) {closings_sorted[L] = bracketsConfig[m][1]}
                }
            }
        }
        // console.log(openings_sorted, closings_sorted, counter, pre); //for debug
    }
    // if all parenthesis are properly closed, counter should consist of zeros
    return counter.every(ele => ele === 0);
}
