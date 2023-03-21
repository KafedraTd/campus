let login=document.getElementById('login')

let loginsArray={
    '5676':'191-4',
    '0390':'192-4',
    '1521':'201-3',
    '9687':'202-3',
    '9413':'203-3',
    '1455':'204-3',
    '9460':'211-2',
    '6612':'212-2',
    '3283':'213-2',
    '3659':'221-1',
    '9475':'222-1',
    '0198':'all-0'
}

let logins=Object.keys(loginsArray)
login.addEventListener('keyup',(e)=>{
    let lg=login.value
    if(lg.length==4){
        if(logins.includes(lg)){
            localStorage.clear()
            localStorage.setItem('group',loginsArray[lg])
            window.open('users.html', '_self')
        }
    }
    
})
