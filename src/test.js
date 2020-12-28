function woop() {
    return new Promise((res)=> {console.log("before");for(i = 0; i<2;i++){return res("middle"+i)};console.log("after");})
}

async function woopwoop() {
    console.log(await woop());
}

woopwoop();