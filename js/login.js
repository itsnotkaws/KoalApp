import { _getUsers } from './_DATA.js';

const loginButton = document.getElementById('login');
const dropdown = document.getElementById('dropdown');

_getUsers().then(users => {
    for (const user of Object.values(users)) {
        const option = dropdown.appendChild(document.createElement('option'));
        option.innerHTML = user.name;
    }
})

dropdown.onchange = function() {
    const selected = dropdown.options[dropdown.options.selectedIndex].text;

    if (selected !== 'Selectionne un utilisateur') {
        loginButton.removeAttribute('disabled');
    } else {
        loginButton.setAttribute('disabled', true);
    }
}

loginButton.onclick = function() {
    const selected = dropdown.options[dropdown.options.selectedIndex].text;
    if (selected === 'Selectionne un utilisateur') return;

    localStorage.setItem('currentUser', selected);
    window.location.href = '/';
}