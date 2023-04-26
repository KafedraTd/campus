
window.onload = function () {
    glancePicture(1)
}

function glancePicture(type) {
    let course = localStorage.getItem('c')
    let group = localStorage.getItem('g')
    let fio = localStorage.getItem('f')
    let thead = document.querySelector('table').querySelector('thead')
    let tbody = document.querySelector('table').querySelector('tbody')
    document.title = 'Группа ' + group
    let specData = localStorage.getItem('d1')
    specData = JSON.parse(specData)
    let tchsData = localStorage.getItem('d2')
    tchsData = JSON.parse(tchsData)
    console.log(specData)
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

            let td22 = document.createElement('td')
            // redCircle.id = `${course}-${group}-${fioLine}=${s}`
            // greCircle.id = `${course}-${group}-${fioLine}=${s}`

            let cValue = specData[group][fioLine][s]['contr']
            let pValue = specData[group][fioLine][s]['points']
            //pValue[1]==0 - точки закрыты
            //cValue[0]==0 - экзамены не закрыты

            if (type == 0) {
                if (pValue[0] == 0 && pValue[1] == 0) {//если точки не наступили
                } else if (cValue[2] == 'Зачет') {// если зачет по предмету
                    if (cValue[0] == 1) {// если все наступившие точки сданы
                        let doneCircle = document.createElement('span')
                        doneCircle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        doneCircle.textContent = 'star'
                        td22.appendChild(doneCircle)
                        doneCircle.setAttribute('data-tooltip', 'Есть зачет')
                        greValueCount++
                    } else if (pValue[0] != 0 && pValue[1] == 0) {
                        let greCircle = document.createElement('span')
                        greCircle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        greCircle.textContent = 'done'
                        greCircle.setAttribute('data-tooltip', `Пока норм`)
                        td22.appendChild(greCircle)
                        greValueCount++
                    } else if (pValue[1] != 0) {// если какие-то точки не сданы
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_checked'
                        redCircle.setAttribute('data-tooltip', `Не все закрыты`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    }
                } else {// если экзамен, курсовая или отчет по предмету
                    if (cValue[0] == 1) {// если точки наступили и все они сданы и если экзамен не наступил или наступил и получена оценка по нему
                        let greCircle = document.createElement('span')
                        greCircle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        greCircle.textContent = 'done'
                        greCircle.setAttribute('data-tooltip', "Экзамен сдан")
                        td22.appendChild(greCircle)
                        greValueCount++
                    } else if (pValue[0] != 0 && pValue[1] == 0 && cValue[0] == -1) {
                        let greCircle = document.createElement('span')
                        greCircle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        greCircle.textContent = 'done'
                        greCircle.setAttribute('data-tooltip', "Пока норм")
                        td22.appendChild(greCircle)
                        greValueCount++
                    } else if (pValue[1] != 0 && cValue[0] == -1) {// если какие-то точки не сданы и экзамен не наступил
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_checked'
                        redCircle.setAttribute('data-tooltip', `Не все закрыты`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    } else if (pValue[1] != 0 && cValue[0] == 0) {// если какие-то точки не сданы и экзамен наступил, но не сдан
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_checked'
                        redCircle.setAttribute('data-tooltip', `Точки и ${cValue[2]} не закрыты`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    } else if (pValue[1] == 0 && cValue[0] == 0) {// если все точки сданы и экзамен наступил, но не сдан
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_checked'
                        redCircle.setAttribute('data-tooltip', `${cValue[2]} не сдан(а)`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    }
                }
            }else if (type==1){
                let totalPointsPerSubject=pValue[3]
                let passedPoints=pValue[0]+pValue[1]
                for (i=0;i<totalPointsPerSubject;i++){
                    let circle = document.createElement('div')
                    if (pValue[2].includes(i+1)){
                        circle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        circle.textContent = 'done'
                        greValueCount++
                    }else{
                        if (passedPoints<i+1){
                            console.log(fio, s, passedPoints)
                            circle.classList.add('material-symbols-outlined', 'white', 'clickable')
                            circle.textContent = 'radio_button_checked'
                        }else{
                            circle.classList.add('material-symbols-outlined', 'red', 'clickable')
                            circle.textContent = 'radio_button_checked'
                            redValueCount++
                            valuesPerSubject[s]++
                        }
                        
                    }
                    td22.appendChild(circle)
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
    } catch (e) { console.log(e) }

})