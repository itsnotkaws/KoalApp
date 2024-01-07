import { _getUsers, _getQuestions, _saveQuestion } from './_DATA.js';

const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '/login.html';
}

const username = document.getElementById('username');
const avatar = document.getElementById('avatar');
const logout = document.getElementById('logout');
const addContainer = document.getElementById('add');

let userId = 'Unknown';

_getUsers().then(async users => {
    const user = Object.values(users).find(user => user.name === currentUser);

    if (!user) {
        window.location.href = '/login.html';
    } else {
        username.innerHTML = user.name;
        userId = user.id;
        avatar.setAttribute('src', user.avatarURL);

        addContainer.innerHTML = `<section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
        <header class="flex justify-between">
            <section class="max-w-64">
                <h2 class="font-semibold text-lg text-base">${user.name} demande</h2>
                <span class="text-sm">Est-ce que tu préfères</span>
            </section>
            <img class="h-20" src="${user.avatarURL}">
        </header>
        <section class="flex flex-col">
            <input id="input1" class="w-full text-sm mt-4 p-2 border-solid border-2 rounded border-grey focus:outline-none" type="text" placeholder="Entrer la réponse une">
            <input id="input2" class="w-full text-sm mt-4 p-2 border-solid border-2 rounded border-grey focus:outline-none" type="text" placeholder="Entrer la réponse deux">
        </section>
        <footer class="flex justify-center">
            <button id="submit" class="w-full text-sm mt-8 py-2 border-solid border-2 rounded border-[#9f9f9f]">Poser la question</button>
        </footer>
    </section>`;
    
        const input1 = document.getElementById('input1');
        const input2 = document.getElementById('input2');
        const submit = document.getElementById('submit');

        submit.onclick = async function() {
            if (!input1.value || !input2.value) return;
            
            const previousQuestions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : null;
            _saveQuestion({ optionOneText: input1.value, optionTwoText: input2.value, author: userId }, previousQuestions);

            const newQuestions = await _getQuestions();
            localStorage.setItem('questions', JSON.stringify(newQuestions));

            window.location.href = '/';
        }
    }
})

logout.onclick = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}