
const btn1 = document.querySelector('#btn1');
const accordion = document.querySelector('.accordion')
const url = 'https://script.google.com/macros/s/AKfycbzUHKc80FSAlL7rJRdUth6X61oj2FbIqT4xlfxIdjSIMEfLRcczUJ_hhORmOnJ2pK5JHg/exec'

window.onload = function () {
    document.querySelector('.loader').classList.remove('loader--hidden');
    const val = '0';
    const url1 = `${url}?type=${val}`;
    fetch(url1)
        .then(res => res.json())
        .then(data => {
            data.type = 'GET';
            fillMainTable(data);
            document.querySelector('.loader').classList.add('loader--hidden');
        })
}

let transferingData1=0
let transferingData2=0
const tds = ['Курс', 'Группа', 'Студенты', 'Точки', 'Зачеты', 'Экзамены', 'Курсовые', 'Отчеты', 'Всего']
const table = document.querySelector('#mainTable')
const thead = table.querySelector('thead')
const tbody = table.querySelector('tbody')

document.body.addEventListener('click', (e) => {
    const target = e.target.closest('.clickable')
    try {
        let g = target.classList[1]
        if (target.classList.length > 2) {
            if (g == '0') {
                let searchClass = target.classList[0]
                let hiddenTds = document.getElementsByClassName(searchClass)
                hiddenTds = Array.prototype.slice.call(hiddenTds)
                hiddenTds.forEach(td => {
                    if (td.classList.contains('groupInfo')) {
                        td.classList.toggle('fioTd--active')

                    }
                })
            } else {
                let searchClass = target.classList[1]
                let hiddenTds = document.getElementsByClassName(searchClass)
                hiddenTds = Array.prototype.slice.call(hiddenTds)
                hiddenTds.forEach(td => {
                    if (td.classList.contains('fioTd')) {
                        td.classList.toggle('fioTd--active')
                    }
                })
            }
        } else {
            let data = target.getAttribute('data-tool').split('-')
            localStorage.setItem('c', data[0])
            localStorage.setItem('g', data[1])
            localStorage.setItem('f', data[2])
            localStorage.setItem('d1',JSON.stringify(transferingData1))
            localStorage.setItem('d2',JSON.stringify(transferingData2))
            window.open("auxiliary.html", '_blank')
        }


    } catch { }

})


function fillMainTable(result) {
    let mainData = result[0]
    let specData = result[1]
    let tutsData = result[3]
    transferingData1=result[1]
    transferingData2=result[2]
    for (const cr in mainData) {
        if (mainData.hasOwnProperty(cr)) {
            let courseData = []
            let groups = mainData[cr]['groups']
            let studts = mainData[cr]['studts']
            let points = mainData[cr]['points']
            let credits = mainData[cr]['contrZ']
            let exams = mainData[cr]['contrE']
            let esses = mainData[cr]['contrK']
            let reports = mainData[cr]['contrO']
            let groupsQty = 0
            let grQty = [0, 0]
            let stQty = [0, 0]
            let ptQty = [0, 0]
            let crQty = [0, 0]
            let exQty = [0, 0]
            let esQty = [0, 0]
            let rpQty = [0, 0]
            let ttQty = [0, 0]
            if (groups) { groupsQty = groups.length }
            if (groups) {
                for (let gr of groups) {
                    let studVal = calcValuesByGroup(gr, 0, result[1])
                    let totalStudVal = studts[groups.indexOf(gr)]
                    let totalDebtPerGroup = 0
                    let totalTotalDebtPerGroup = 0
                    for (let i of [credits[gr], exams[gr], esses[gr], reports[gr]]) {
                        totalDebtPerGroup = totalDebtPerGroup + i[1]
                        totalTotalDebtPerGroup = totalTotalDebtPerGroup + i[0] + i[1]
                    }

                    grQty[0] = grQty[0] + 1
                    grQty[1] = grQty[1] + 1

                    stQty[0] = stQty[0] + studVal
                    stQty[1] = stQty[1] + totalStudVal

                    ptQty[0] = ptQty[0] + points[gr][1]
                    ptQty[1] = ptQty[1] + points[gr][0] + points[gr][1]

                    crQty[0] = crQty[0] + credits[gr][1]
                    crQty[1] = crQty[1] + credits[gr][0] + credits[gr][1]
                    exQty[0] = exQty[0] + exams[gr][1]
                    exQty[1] = exQty[1] + exams[gr][0] + exams[gr][1]
                    esQty[0] = esQty[0] + esses[gr][1]
                    esQty[1] = esQty[1] + esses[gr][0] + esses[gr][1]
                    rpQty[0] = rpQty[0] + reports[gr][1]
                    rpQty[1] = rpQty[1] + reports[gr][0] + reports[gr][1]
                    ttQty[0] = ttQty[0] + totalDebtPerGroup
                    ttQty[1] = ttQty[1] + totalTotalDebtPerGroup
                }
            }
            courseData.push(grQty, stQty, ptQty, crQty, exQty, esQty, rpQty, ttQty)
            let tr = document.createElement('tr')
            tr.classList.add(cr, 0, 'courseInfo')
            let td = document.createElement('td')
            td.textContent = `Курс ${cr}`
            td.classList.add(cr, 0, 'courseTd', 'clickable')
            tr.appendChild(td)
            for (let t of courseData) {
                let th = document.createElement('td')
                th.classList.add(cr, 0, 'courseTd', 'clickable')
                th.textContent = t[0]
                let txt = `из ${t[1]} (${Math.round(t[0] / t[1] * 100)}%)`
                th.setAttribute('data-tooltip', txt)
                tr.appendChild(th)
            }
            tbody.appendChild(tr)

            if (groups) {
                for (let gr of groups) {
                    let studVal = calcValuesByGroup(gr, 0, result[1])
                    let totalStudVal = studts[groups.indexOf(gr)]
                    let totalDebtPerGroup = 0
                    let totalTotalDebtPerGroup = 0
                    for (let i of [credits[gr], exams[gr], esses[gr], reports[gr]]) {
                        totalDebtPerGroup = totalDebtPerGroup + i[1]
                        totalTotalDebtPerGroup = totalTotalDebtPerGroup + i[0] + i[1]
                    }

                    let valuesArray = [[cr, 0], [gr, 1], [studVal, totalStudVal], [points[gr][1], points[gr][0] + points[gr][1]], [credits[gr][1], credits[gr][0] + credits[gr][1]], [exams[gr][1], exams[gr][0] + exams[gr][1]], [esses[gr][1], esses[gr][0] + esses[gr][1]], [reports[gr][1], reports[gr][0] + reports[gr][1]], [totalDebtPerGroup, totalTotalDebtPerGroup]]
                    let studentsByNameArray = specData[gr]
                    
                    let trr = document.createElement('tr')
                    trr.classList.add(cr, gr, 'groupInfo')
                    for (let t of valuesArray) {
                        let td = document.createElement('td')
                        td.classList.add(cr, gr, 'groupTd', 'clickable')
                        
                        if (t[1] == 1) {
                            let tutor = tutsData[cr][0][tutsData[cr][1].indexOf(gr.toString())]
                            td.setAttribute('data-tooltip', `Куратор: ${tutor}`)
                            td.textContent = t[0]
                        } else if (t[1] == 0) {
                            td.textContent = t[0]
                        }else{
                            let txt = `из ${t[1]} (${Math.round(t[0] / t[1] * 100)}%)`
                            td.setAttribute('data-tooltip', txt)
                            td.textContent = t[0]
                        }

                        trr.appendChild(td)
                    }
                    tbody.appendChild(trr)
                    //здесь формирование строк по фамилиям

                    for (const fio in studentsByNameArray) {
                        if (studentsByNameArray.hasOwnProperty(fio)) {
                            let studentsArray = calcValuesByGroup(gr, 1, result[1])
                            let trrr = document.createElement('tr')
                            trrr.classList.add(cr, gr, 'fioTd')

                            if (studentsArray[fio].slice(-1)[0][0] != 0) {
                                trrr.classList.add('notFilled')
                            }
                            for (let i of [cr, gr, fio]) {
                                let td1 = document.createElement('td')
                                td1.classList.add('clickable')
                                let txt = `${cr}-${gr}-${fio}`
                                td1.setAttribute('data-tool', txt)
                                td1.textContent = i
                                if ([cr, gr, fio].indexOf(i) == 2) { td1.classList.add('leftTd') }
                                trrr.appendChild(td1)
                            }
                            for (let el of studentsArray[fio]) {
                                let td2 = document.createElement('td')
                                td2.classList.add('clickable')
                                let txt = `${cr}-${gr}-${fio}`
                                td2.setAttribute('data-tool', txt)
                                txt = `из ${el[1]} (${Math.round(el[0] / el[1] * 100)}%)`
                                td2.setAttribute('data-tooltip', txt)
                                td2.textContent = el[0]
                                //tdd.classList.add(gr,'disapearingTd')
                                trrr.appendChild(td2)
                            }

                            tbody.appendChild(trrr)

                        }
                    }
                }


            }
            //table.appendChild(tbody)

            // divContent.appendChild(table)
            //accordion.appendChild(table)
        }

    }
}



function calcValuesByGroup(gr, num, specData) {
    let studentsCount = 0
    let studentsValue = {}
    for (const key in specData) {
        if (specData.hasOwnProperty(key)) {
            let studObj = specData[key]

            if (key == gr) {
                for (const fio in studObj) {
                    if (studObj.hasOwnProperty(fio)) {
                        studentsValue[fio] = []
                        let studData = studObj[fio]
                        let studCount = 0
                        let poinCount = 0
                        let poinCountT = 0
                        let credCount = 0
                        let credCountT = 0
                        let examCount = 0
                        let examCountT = 0
                        let esseCount = 0
                        let esseCountT = 0
                        let repoCount = 0
                        let repoCountT = 0
                        let totalDebtPerStudent = 0
                        let totalDebtPerStudentT = 0
                        for (const predmet in studData) {
                            if (studData.hasOwnProperty(predmet)) {
                                let contrType = studData[predmet]['contr'][2]
                                let pData = studData[predmet]['points'][1]
                                let cData = studData[predmet]['contr'][0]

                                if (pData != 0 || cData == 0) {  //когда поменяю в Appscript надо поменять здесь
                                    studCount++
                                }
                                poinCount = poinCount + pData
                                poinCountT = poinCountT + studData[predmet]['points'][0] + pData
                                if (contrType == 'Зачет' || contrType == 'ДифЗ') {
                                    if (cData == 0) {
                                        credCount++
                                    }
                                    credCountT++
                                } else if (contrType == 'Экзамен') {
                                    if (cData == 0) {
                                        examCount++
                                    } else if (cData != -1) {
                                        examCountT++
                                    }
                                } else if (contrType == 'Курсовая') {
                                    if (cData == 0) {
                                        esseCount++
                                    } else if (cData != -1) {
                                        esseCountT++
                                    }
                                } else if (contrType == 'Отчет') {
                                    if (cData == 0) {
                                        repoCount++
                                    } else if (cData != -1) {
                                        repoCountT++
                                    }
                                }
                                totalDebtPerStudent = credCount + examCount + esseCount + repoCount
                                totalDebtPerStudentT = credCountT + examCountT + esseCountT + repoCountT
                            }
                        }
                        if (studCount != 0) { studentsCount++ }//складываем студентов
                        studentsValue[fio].push([poinCount, poinCountT], [credCount, credCountT], [examCount, examCountT], [esseCount, esseCountT], [repoCount, repoCountT], [totalDebtPerStudent, totalDebtPerStudentT])
                    }
                }

            }
        }
    }
    if (num == 0) {
        return studentsCount
    } else if (num = 1) {
        return studentsValue
    }
}