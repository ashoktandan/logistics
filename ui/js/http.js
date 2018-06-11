async function postcall(api, data) {
    console.info(`Hitting API ="${localStorage.api + api}" with data =`,data)
    let response = await fetch(localStorage.api + api, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
    let responsedata = await response.json()
    console.info(`Got response from API =${localStorage.api + api} =`,responsedata)
    return responsedata
}

function logout(){
    location.href='/index.html'
}