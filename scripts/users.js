const url = 'https://script.google.com/macros/s/AKfycbzUHKc80FSAlL7rJRdUth6X61oj2FbIqT4xlfxIdjSIMEfLRcczUJ_hhORmOnJ2pK5JHg/exec'
const table = document.querySelector('#usersTable')
const thead = table.querySelector('thead')
const tbody = table.querySelector('tbody')
const theadS = document.querySelector('#sendingTable').querySelector('thead')
const tbodyS = document.querySelector('#sendingTable').querySelector('tbody')
let changingOption0 = [0, 0]
let changingOption1 = [0, 0]
let sendingArray = []
const sendingForm = document.getElementById('sendingForm')
const sendingNameData = sendingForm.querySelector('#name')
const sendingValueData = sendingForm.querySelector('#value')
const selTeachers = document.querySelector('#teachers')
let generalData = null

window.onload = function () {
    document.querySelector('.loader').classList.remove('loader--hidden');
    const val = '1';
    const url1 = `${url}?type=${val}`;
    fetch(url1)
        .then(res => res.json())
        .then(data => {
            data.type = 'GET';
            generalData = data
            fillMainTable(data)
            document.querySelector('.loader').classList.add('loader--hidden');
        })
}

function fillMainTable(data) {
    let uniq = 0
    let teachers = []
    for (let subjArray of data.slice(1)) {
        if (subjArray[2].indexOf(';') > -1) {
            let strArr = subjArray[2].split(';')
            for (let s of strArr) {
                teachers.push(s)
            }
        } else {
            teachers.push(subjArray[2])
        }
        uniq = teachers.reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
        uniq = uniq.sort()
        uniq.unshift('Выберите преподавателя...')
    }
    for (let u of uniq) {
        let op = document.createElement('option')
        if (u == 'Выберите преподавателя...') {
            op.value = 0
        } else {
            op.value = u.replace(/\s/g, '')

        }
        op.textContent = u
        selTeachers.appendChild(op)
    }
    for (let subjArray of data.slice(1)) {
        let className = subjArray[2].replace(/\s/g, '')
        if (className.indexOf(';') > -1) {
            let strArr = className.split(';')
            for (let s of strArr) {
                let tr = document.createElement('tr')
                tr.classList.add(s, 'hideTrs')
                for (let i of [1, 2, 3, 7]) {
                    let td = document.createElement('td')
                    td.classList.add(subjArray[0], subjArray[3], 'clickable')
                    if (i == 2) {
                        td.classList.add('hidden')
                        td.textContent = subjArray[i].split(';')[strArr.indexOf(s)]
                    } else {
                        td.textContent = subjArray[i]
                    }
                    // td.addEventListener('click', (e) => {

                    //     document.querySelector('.popup').classList.toggle('open')
                    // })
                    tr.appendChild(td)
                }
                tbody.appendChild(tr)
            }
        } else {
            let tr = document.createElement('tr')
            tr.classList.add(className, 'hideTrs')
            for (let i of [1, 2, 3, 7]) {
                let td = document.createElement('td')
                td.classList.add(subjArray[0], subjArray[3], 'clickable')
                if (i == 2) { td.classList.add('hidden') }
                td.textContent = subjArray[i]
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }
    }
}

function fillSubTable(result, values, s) {
    let pointsQty = 0
    let controlType = 0
    let controlFact = 0
    let groups = []
    for (let i of values) {
        if (!groups.includes(i[1])) {
            groups.push(i[1])
        }
    }
    for (let subject of result) {
        if (subject[0] === Number(s)) {
            pointsQty = subject[6]
            controlType = subject[7]
            controlFact = subject[8]
        }
    }
    let thArray = ['ФИО', 'Группа']
    let thArrayI = [0, 1]
    if (controlType != 'Курсовая' && controlType != 'Отчет') {
        for (let i = 1; i < pointsQty + 1; i++) {
            thArray.push(`КТ${i}`)
            thArrayI.push(i + 2)
        }
        if (controlType == 'Экзамен') {
            thArray.push(controlType)
            thArrayI.push(pointsQty + 3)
        }
    } else {
        thArray.push(controlType)
        thArrayI.push(2)
    }

    let currentGroup = 0
    let tr = document.createElement('tr')
    let trs = theadS.getElementsByTagName('tr')
    while (trs.length > 0) trs[0].parentNode.removeChild(trs[0])
    for (let col of thArray) {
        let th = document.createElement('th')
        if (col == 'Группа') {
            let sel = document.createElement('select')
            sel.id = 'selectGroup'
            sel.addEventListener('change', (el) => { selectGroup(el) })
            for (let i of groups) {
                let opt = document.createElement('option')
                opt.value = i
                opt.textContent = i
                sel.appendChild(opt)
            }
            currentGroup = sel.value
            changingOption1[1] = Number(currentGroup)

            th.appendChild(sel)
        } else {
            th.textContent = col
        }
        tr.appendChild(th)

    }
    theadS.appendChild(tr)
    let trss = tbodyS.getElementsByTagName('tr')
    while (trss.length > 0) trss[0].parentNode.removeChild(trss[0])
    for (let fio of values) {
        let tr = document.createElement('tr')
        tr.classList.add(fio[1])
        if (fio[1] != currentGroup) {
            tr.classList.add('hideTrs')
        }

        for (let i of thArrayI) {
            let td = document.createElement('td')
            if (i == 0) {
                let strArr = fio[i].split(' ')
                let txt = `${strArr[0]} ${strArr[1].substring(0, 1)}`
                td.textContent = txt
            } else if (i == 1) {
                td.textContent = fio[i]
            } else {
                let selectTag = document.createElement('select')
                selectTag.classList.add('notes')
                let txt = `${fio[0]}-${fio[1]}-${fio[2]}-${thArray[thArrayI.indexOf(i)]}`
                selectTag.id = txt
                for (let op of ['', 3, 4, 5]) {
                    let opt = document.createElement('option')
                    opt.value = op
                    opt.textContent = op
                    selectTag.appendChild(opt)
                }
                selectTag.selectedIndex = ['', 3, 4, 5].indexOf(fio[i])
                selectTag.addEventListener('change', (el) => {
                    el.target.parentElement.classList.add('yel')
                    if (sendingArray.includes(el.target.id)) {
                        let index = sendingArray.indexOf(el.target.id)
                        sendingArray[index] = el.target.id.toString() + '-' + el.target.value.toString()
                    } else {
                        sendingArray.push(el.target.id.toString() + '-' + el.target.value.toString())
                    }
                    sendingNameData.value = sendingArray
                })
                td.appendChild(selectTag)
            }
            tr.appendChild(td)
        }
        tbodyS.append(tr)

    }

    let buttons = document.createElement('tr')
    let dv = document.createElement('div')
    dv.className = 'buttonsDiv'
    let dvs = document.getElementsByClassName('del')
    while (dvs.length > 0) dvs[0].parentNode.removeChild(dvs[0])
    let btn0 = document.createElement('button')
    btn0.textContent = 'Закрыть'
    btn0.id = 'btn0'
    btn0.type = 'button'
    btn0.className = 'del'
    btn0.addEventListener('click', () => {
        document.querySelector('.popup').classList.toggle('open')
    })


    let btn1 = document.createElement('button')
    btn1.id = 'btn1'
    btn1.type = 'button'
    btn1.textContent = 'Записать'
    btn1.className = 'del'
    btn1.addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('.loader').classList.remove('loader--hidden');
        fetch(url, {
            method: "POST",
            body: new FormData(sendingForm)
        }).then(()=>{
            document.querySelector('.loader').classList.add('loader--hidden');
        document.querySelector('.popup').classList.toggle('open')
        }).catch(error => console.error('Error!', error.message))
        
    })
    dv.appendChild(btn0)
    dv.appendChild(btn1)
    document.getElementById('sendingTable').appendChild(dv)
}

function selectGroup(el) {
    changingOption1[0] = changingOption1[1]
    changingOption1[1] = Number(el.target.value)
    if (el.target.value != 0) {

        let tableRows = document.getElementsByClassName(el.target.value)
        hiddenRows = Array.prototype.slice.call(tableRows)
        hiddenRows.forEach(tr => {

            tr.classList.toggle('hideTrs')

        })
    }
    let tableRows2 = document.getElementsByClassName(changingOption1[0])
    hiddenRows2 = Array.prototype.slice.call(tableRows2)
    hiddenRows2.forEach(tr => {
        tr.classList.toggle('hideTrs')
    })
}


selTeachers.addEventListener('change', (el) => {
    changingOption0[0] = changingOption0[1]
    changingOption0[1] = el.target.value
    if (el.target.value != 0) {
        let tableRows = document.getElementsByClassName(el.target.value)
        hiddenRows = Array.prototype.slice.call(tableRows)
        hiddenRows.forEach(tr => {
            tr.classList.toggle('showTrs')
        })
    }
    let tableRows2 = document.getElementsByClassName(changingOption0[0])
    hiddenRows2 = Array.prototype.slice.call(tableRows2)
    hiddenRows2.forEach(tr => {
        tr.classList.toggle('showTrs')
    })
})

let clickable = document.getElementsByClassName('clickable')

document.body.addEventListener('click', (e) => {
    if (e.target.closest('.clickable')) {
        document.querySelector('.loader').classList.remove('loader--hidden');
        let sub = e.target.classList[0]
        let course = e.target.classList[1]
        if (course == 'clickable') { course = '4' }//Для четвертой дисциплины
        sendingValueData.value = course
        let url1 = `${url}?type=${course + sub}`;
        fetch(url1)
            .then(res => res.json())
            .then(dt => {
                dt.type = 'GET';
                fillSubTable(generalData, dt, sub)
            }).then(() => {
                document.querySelector('.loader').classList.add('loader--hidden');
                document.querySelector('.popup').classList.toggle('open')
            })

    }
})

// document.getElementById('btn0').addEventListener('click', (e) => {
//     document.querySelector('.popup').classList.toggle('open')
// })

// document.getElementById('btn1').addEventListener('click', (e) => {
//     e.preventDefault()
//     fetch(url, {
//         method: "POST",
//         body: new FormData(sendingForm)
//     }).catch(error => console.error('Error!', error.message))
//     document.querySelector('.popup').classList.toggle('open')
// })