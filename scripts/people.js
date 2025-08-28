async function fetchPeople() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}

function createPeople(people) {
    const peopleList = document.querySelector('.people-list');
    peopleList.innerHTML = '';
    people.forEach(person => {
        const div = document.createElement('div');
        div.className = 'person';
        div.innerHTML = `
            <h3>${person.name}</h3>
            <p><strong>Email:</strong> ${person.email}</p>
            <p><strong>Phone:</strong> ${person.phone}</p>
            <p><strong>Company:</strong> ${person.company.name}</p>
        `;
        peopleList.appendChild(div);
    });
}

fetchPeople().then(people => createPeople(people));