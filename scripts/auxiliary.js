
window.onload = function () {
    let course = localStorage.getItem('c')
    let group = localStorage.getItem('g')
    let fio = localStorage.getItem('f')
    let thead = document.querySelector('table').querySelector('thead')
    let tbody = document.querySelector('table').querySelector('tbody')

    let specData = localStorage.getItem('d1')
    specData = JSON.parse(specData)
    let tchsData = localStorage.getItem('d2')
    tchsData = JSON.parse(tchsData)

    let studentsArray = Object.keys(specData[group])
    let subjects = Object.keys(specData[group][fio])
    let valuesPerSubject = {}
    let tr1 = document.createElement('tr')
    let td11 = document.createElement('td')
    td11.textContent = `Группа ${group}`
    tr1.appendChild(td11)
    for (let s of subjects) {
        valuesPerSubject[s] = 0
        let td12 = document.createElement('td')
        td12.classList.add('th')
        let dv12 = document.createElement('div')
        dv12.id = s
        td12.textContent = tchsData[s][1]
        let txt1 = tchsData[s][2]
        let txt2 = tchsData[s][0]
        td12.setAttribute('data-tooltip', txt1 + ' (' + txt2 + ')')
        td12.appendChild(dv12)
        tr1.appendChild(td12)
    }
    let td13 = document.createElement('td')
    td13.textContent = 'Итого не сдано'
    let dv13 = document.createElement('div')
    dv13.id = 'total'
    td13.appendChild(dv13)
    tr1.appendChild(td13)
    thead.appendChild(tr1)
    console.log(specData)
    for (let fioLine of studentsArray) {

        let tr2 = document.createElement('tr')
        tr2.className = 'fioLineOfAuxTable'
        let td21 = document.createElement('td')
        td21.textContent = fioLine
        td21.classList.add('leftTd')
        tr2.appendChild(td21)
        let redValueCount = 0
        let greValueCount = 0

        for (let s of subjects) {

            let redCircle = document.createElement('span')
            redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
            redCircle.textContent = 'radio_button_checked'
            let greCircle = document.createElement('span')
            greCircle.classList.add('material-symbols-outlined', 'gre', 'clickable')
            greCircle.textContent = 'check_box'
            let td22 = document.createElement('td')
            redCircle.id = `${course}-${group}-${fioLine}=${s}`
            greCircle.id = `${course}-${group}-${fioLine}=${s}`

            let cValue = specData[group][fioLine][s]['contr']
            let pValue = specData[group][fioLine][s]['points']
            //pValue[1]==0 - точки закрыты
            //cValue[0]==0 - экзамены не закрыты
            if (pValue[0] == 0 && pValue[1] == 0) {//если точки не наступили

            } else if(cValue[2]=='Зачет'){// если зачет по предмету
                if (pValue[0] != 0 && pValue[1] == 0 && cValue[0] == 0) {// если все наступившие точки сданы
                    td22.appendChild(greCircle)
                    greValueCount++
                }else if(pValue[1] != 0){// если какие-то точки не сданы
                    redCircle.setAttribute('data-tooltip', `Точки`)
                    td22.appendChild(redCircle)
                    redValueCount++
                    valuesPerSubject[s]++
                }
            }else{// если экзамен, курсовая или отчет по предмету
                if (pValue[0] != 0 && pValue[1] == 0 && (cValue[0] == -1||cValue[0]!=0)) {// если точки наступили и все они сданы и если экзамен не наступил или наступил и получена оценка по нему
                    td22.appendChild(greCircle)
                    greValueCount++
                }else if(pValue[1] != 0&&cValue[0] == -1){// если какие-то точки не сданы и экзамен не наступил
                    redCircle.setAttribute('data-tooltip', `Точки`)
                    td22.appendChild(redCircle)
                    redValueCount++
                    valuesPerSubject[s]++
                }else if(pValue[1] != 0&&cValue[0] == 0){// если какие-то точки не сданы и экзамен наступил, но не сдан
                    redCircle.setAttribute('data-tooltip', `Точки и ${cValue[2]}`)
                    td22.appendChild(redCircle)
                    redValueCount++
                    valuesPerSubject[s]++
                }else if(pValue[1] == 0&&cValue[0] == 0){// если все точки сданы и экзамен наступил, но не сдан
                    redCircle.setAttribute('data-tooltip', `${cValue[2]}`)
                    td22.appendChild(redCircle)
                    redValueCount++
                    valuesPerSubject[s]++
                }
            }
            tr2.appendChild(td22)
        }

        let td23 = document.createElement('td')
        td23.textContent = redValueCount
        td23.id = `${course}-${group}-${fioLine}`
        let txt = `из ${redValueCount + greValueCount}`
        td23.setAttribute('data-tooltip', txt)
        tr2.appendChild(td23)
        tbody.appendChild(tr2)
    }
    totalPerGroup = 0
    for (let s of subjects) {
        let dv = document.getElementById(s)
        dv.textContent = valuesPerSubject[s]
        totalPerGroup = totalPerGroup + valuesPerSubject[s]
        if (valuesPerSubject[s] == 0) {
            dv.classList.add('countDivForSubjectGre')
        } else {
            dv.classList.add('countDivForSubjectRed')
        }
    }
    document.getElementById('total').textContent = totalPerGroup
    if (totalPerGroup == 0) {
        document.getElementById('total').classList.add('countDivForSubjectGre')
    } else {
        document.getElementById('total').classList.add('countDivForSubjectRed')
    }
}

document.body.addEventListener('click', (e) => {
    const target = e.target.closest('.clickable')
    let id1 = target.id.split('=')[1]
    let id2 = target.id.split('=')[0]
    let element1 = document.getElementById(id1)
    let element2 = document.getElementById(id2)
    let number1 = Number(element1.textContent)
    let number2 = Number(element2.textContent)
    try {
        if (target.classList.contains('gre')) {
            target.classList.remove('gre')
            target.classList.add('red')
            target.textContent = 'radio_button_checked'
            element1.textContent = `${number1 + 1}`
            element2.textContent = `${number2 + 1}`
        } else if (target.classList.contains('red')) {
            target.classList.remove('red')
            target.classList.add('gre')
            target.textContent = 'check_box'
            element1.textContent = `${number1 - 1}`
            element2.textContent = `${number2 - 1}`
        }
        target.classList.add('yel')
    } catch { }

})