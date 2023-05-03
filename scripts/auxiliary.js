
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
    let studentsArray = Object.keys(specData[group])
    let subjects = Object.keys(specData[group][fio])
    let valuesPerSubject = {}
    let countStudents={}

    let tr1 = document.createElement('tr')
    
    let td11 = document.createElement('td')
    td11.textContent = `Группа ${group}`
    tr1.appendChild(td11)
    for (let s of subjects) {
        valuesPerSubject[s] = 0
        countStudents[s]=0
        let td12 = document.createElement('td')
        td12.classList.add('th')
        let dv12 = document.createElement('div')
        dv12.className='pointsQty'
        dv12.id = s
        let dvSt=document.createElement('div')
        dvSt.className='studentsQty'
        dvSt.id= s+'-s'
        td12.textContent = tchsData[s][1]
        let txt1 = tchsData[s][2]
        let txt2 = tchsData[s][0]
        td12.setAttribute('data-tooltip', txt1 + ' (' + txt2 + ')')
        td12.appendChild(dvSt)
        td12.appendChild(dv12)
        tr1.appendChild(td12)
    }
    let td13 = document.createElement('td')
    td13.textContent = 'Итого не сдано'
    let dvStuds = document.createElement('div')
    dvStuds.classList.add('studentsQty')
    dvStuds.id = 'totalStud'

    let dvPoint = document.createElement('div')
    dvPoint.classList.add('pointsQty', 'ptQ')
    dvPoint.id = 'total'
    dvPoint.setAttribute('data-tooltip','Сортировать')
    dvPoint.addEventListener('click',()=>{
        sortTable(subjects.length+1)
    })
    td13.appendChild(dvStuds)
    td13.appendChild(dvPoint)
    tr1.appendChild(td13)
    thead.appendChild(tr1)
    totalPerGroupSt=0
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
                        redCircle.textContent = 'radio_button_unchecked'
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
                        redCircle.textContent = 'radio_button_unchecked'
                        redCircle.setAttribute('data-tooltip', `Не все закрыты`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    } else if (pValue[1] != 0 && cValue[0] == 0) {// если какие-то точки не сданы и экзамен наступил, но не сдан
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_unchecked'
                        redCircle.setAttribute('data-tooltip', `Точки и ${cValue[2]} не закрыты`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    } else if (pValue[1] == 0 && cValue[0] == 0) {// если все точки сданы и экзамен наступил, но не сдан
                        let redCircle = document.createElement('span')
                        redCircle.classList.add('material-symbols-outlined', 'red', 'clickable')
                        redCircle.textContent = 'radio_button_unchecked'
                        redCircle.setAttribute('data-tooltip', `${cValue[2]} не сдан(а)`)
                        td22.appendChild(redCircle)
                        redValueCount++
                        valuesPerSubject[s]++
                    }
                }
            }else if (type==1){
                let totalPointsPerSubject=pValue[3]
                let passedPoints=pValue[0]+pValue[1]
                let countGreenPoints=0
                if (pValue[1]!=0){
                    countStudents[s]++
                }
                for (i=0;i<totalPointsPerSubject;i++){
                    let circle = document.createElement('div')
                    if (pValue[2].includes(i+1)){
                        circle.classList.add('material-symbols-outlined', 'gre', 'clickable')
                        circle.textContent = 'done'
                        countGreenPoints++
                        greValueCount++
                    }else{
                        if (passedPoints<i+1){
                            circle.classList.add('material-symbols-outlined', 'white', 'clickable')
                            circle.textContent = 'radio_button_unchecked'
                            circle.setAttribute('data-tooltip', `Не наступила`)
                        }else{
                            circle.classList.add('material-symbols-outlined', 'red', 'clickable')
                            circle.textContent = 'radio_button_unchecked'
                            circle.setAttribute('data-tooltip', `Не сдана`)
                            redValueCount++
                            valuesPerSubject[s]++
                        }
                        
                    }
                    td22.appendChild(circle)
                }
                if(totalPointsPerSubject!=0){
                    if(totalPointsPerSubject==countGreenPoints){
                        td22.classList.add('closed')
                    }
                }

                
                

            }

            tr2.appendChild(td22)
        }
        if (redValueCount!=0){totalPerGroupSt++}
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
        let dv1 = document.getElementById(s)
        dv1.textContent = valuesPerSubject[s]
        txtId=s+'-s'
        let dv0 = document.getElementById(txtId)
        dv0.textContent = countStudents[s]
        totalPerGroup = totalPerGroup + valuesPerSubject[s]
        if (valuesPerSubject[s] == 0) {
            dv1.classList.add('countDivForSubjectGre')
        } else {
            dv1.classList.add('countDivForSubjectRed')
        }
        if (countStudents[s] == 0) {
            dv0.classList.add('countDivForSubjectGre')
        } else {
            dv0.classList.add('countDivForSubjectRed')
        }
    }
    document.getElementById('total').textContent = totalPerGroup
    let sortSpan=document.createElement('span')
    sortSpan.classList.add('material-symbols-outlined')
    sortSpan.innerText='sort'
    document.getElementById('total').appendChild(sortSpan)
    document.getElementById('totalStud').textContent = totalPerGroupSt
    if (totalPerGroup == 0) {
        document.getElementById('total').classList.add('countDivForSubjectGre')
    } else {
        document.getElementById('total').classList.add('countDivForSubjectRed')
    }
    if (totalPerGroupSt == 0) {
        document.getElementById('totalStud').classList.add('countDivForSubjectGre')
    } else {
        document.getElementById('totalStud').classList.add('countDivForSubjectRed')
    }
}

// document.body.addEventListener('click', (e) => {
//     const target = e.target.closest('.clickable')
//     let id1 = target.id.split('=')[1]
//     let id2 = target.id.split('=')[0]
//     let element1 = document.getElementById(id1)
//     let element2 = document.getElementById(id2)
//     let number1 = Number(element1.textContent)
//     let number2 = Number(element2.textContent)
//     try {
//         if (target.classList.contains('gre')) {
//             target.classList.remove('gre')
//             target.classList.add('red')
//             target.textContent = 'radio_button_unchecked'
//             element1.textContent = `${number1 + 1}`
//             element2.textContent = `${number2 + 1}`
//         } else if (target.classList.contains('red')) {
//             target.classList.remove('red')
//             target.classList.add('gre')
//             target.textContent = 'check_box'
//             element1.textContent = `${number1 - 1}`
//             element2.textContent = `${number2 - 1}`
//         }
//         target.classList.add('yel')
//     } catch (e) { console.log(e) }

// })

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

    table = document.querySelector('table');
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }