function showText() {
    fetch('../../Items')
        .then(response => response.json())
        .then(data => document.getElementById('MAINSHOW').innerText = JSON.stringify(data, null, 2));
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('removeForm').style.display = 'none';
    document.getElementById('MAINSHOW').innerText = '';
}

function showRemoveForm() {
    document.getElementById('removeForm').style.display = 'block';
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('MAINSHOW').innerText = '';
}

function clearJSON() {
    fetch('/clear', { method: 'POST' })
        .then(response => response.text())
        .then(data => document.getElementById('MAINSHOW').innerText = data);
}

function restoreJSON() {
    fetch('/restore', { method: 'POST' })
        .then(response => response.text())
        .then(data => document.getElementById('MAINSHOW').innerText = data);
}

function addElement() {
    const title = document.getElementById('titleTF').value;
    const value = document.getElementById('valueTF').value;
    const color = document.getElementById('colorTF').value;
    fetch(`/add`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `title=${title}&value=${value}&color=${color}`
    })
    .then(response => response.text())
    .then(data => document.getElementById('MAINSHOW').innerText = data);
}

function removeElement() {
    const index = document.getElementById('indexTF').value;
    fetch(`/remove`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `index=${index}`
    })
    .then(response => response.text())
    .then(data => document.getElementById('MAINSHOW').innerText = data);
}

function showPieChart() {
    // Generate SVG for the pie chart on the server and send it back
}

function showLocalPieChart() {
    // Implementation to show local pie chart goes here
    // Fetch JSON from relative URL /Items, then create SVG directly in the browser
}
