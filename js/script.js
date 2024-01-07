import { _getUsers, _getQuestions } from './_DATA.js';

const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '/login.html';
}

const username = document.getElementById('username');
const avatar = document.getElementById('avatar');
const logout = document.getElementById('logout');

_getUsers().then(async users => {
    const user = Object.values(users).find(user => user.name === currentUser);

    if (!user) {
        window.location.href = '/login.html';
    } else {
        username.innerHTML = user.name;
        avatar.setAttribute('src', user.avatarURL);
    }
})


logout.onclick = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}