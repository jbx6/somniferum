// app.js
document.getElementById('plantForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const found = formData.get('foundAt');
    const type = formData.get('type');
    const formDate = new Date(formData.get('formDate')).toLocaleDateString();

    const response = await fetch('/add-plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, found, type, formDate })
    });

    if (response.ok) {
        alert('Plant added successfully');
        console.log('Plant added successfully');
        location.reload();
    } else {
        const message = await response.text();
        alert(message);
        console.error(message);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/get-plants');
    const plants = await response.json();

    // Sort the plants by date in ascending order
    plants.sort((a, b) => {
        let datePartsA = a.date.split('/');
        let dateA = new Date(+datePartsA[2], datePartsA[1] - 1, +datePartsA[0]);

        let datePartsB = b.date.split("/");
        let dateB = new Date(+datePartsB[2], datePartsB[1] - 1, +datePartsB[0]);

        return dateB - dateA;
    })

    
    // render as list
    /*
    const plantsList = document.getElementById('plantsList');
    plants.map((plant) => {
        const { name, foundAt, type, date } = plant;
        const li = document.createElement('li');
        li.textContent = `[${date}] ${name} - ${foundAt} - ${type}`;
        plantsList.appendChild(li);
    });
    */

    // render as table
    const table = document.getElementById('plantsTable');
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const tbody = table.createTBody();
    const headings = ['Name', 'Found', 'Date', 'Type', 'Actions'];

    headings.map((heading) => {
        const th = document.createElement('th');
        th.textContent = heading;
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });

    plants.map((plant) => {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';

        const row = tbody.insertRow();
        const { name, found, type, date } = plant;

        [name, found, date, type, deleteButton].map((value, index) => {
            const cell = row.insertCell();
            cell.style.paddingTop = '8px';
            cell.style.paddingRight = '8px';

            if (index === 4) {
                deleteButton.addEventListener('click', async () => {
                    const response = await fetch('/delete-plant', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name })
                    });
            
                    if (response.ok) {
                        alert(name + ' deleted successfully');
                        console.log(name + ' deleted successfully');
                        location.reload();
                    } else {
                        const message = await response.text();
                        alert(message);
                        console.error(message);
                    }
                })

                cell.appendChild(deleteButton);
            } else {
                cell.textContent = value;
            };
            
        });
    });

});