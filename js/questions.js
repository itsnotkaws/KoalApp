import { _getUsers, _getQuestions, _saveQuestionAnswer } from './_DATA.js';

const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    window.location.href = '/login.html';
}

const username = document.getElementById('username');
const avatar = document.getElementById('avatar');
const logout = document.getElementById('logout');
const questionContainer = document.getElementById('question');

_getUsers().then(async users => {
    const user = Object.values(users).find(user => user.name === currentUser);

    if (!user) {
        window.location.href = '/login.html';
    } else {
        username.innerHTML = user.name;
        avatar.setAttribute('src', user.avatarURL);

        const questions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : await _getQuestions();

        const urlParams = new URLSearchParams(window.location.search);
        const questionId = urlParams.get('id');

        const question = questions[questionId];
        if (!question) {
            window.location.href = '/';
        }

        let userAnswer = null;
        
        if (question.optionOne.votes.includes(user.id)) userAnswer = 'optionOne';
        else if (question.optionTwo.votes.includes(user.id)) userAnswer = 'optionTwo';

        const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;

        if (userAnswer) {
            questionContainer.innerHTML = `<section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <div class="max-w-64">
                    <h2 class="font-semibold text-lg text-base">${user.name} demande</h2>
                    <span class="text-sm">Est-ce que tu préfères</span>
                </div>
                <img class="h-20" src="${user.avatarURL}">
            </header>
            <section class="w-full mt-4 p-2${userAnswer === 'optionOne' ? ' pt-10 relative' : ''} border-solid border-2 rounded border-grey" type="text" placeholder="Entrer la réponse une"> ${userAnswer === 'optionOne' ? ` <div class="absolute right-[-13px] flex items-center pl-3 top-2 h-6 w-24 bg-[#ff0000] rounded text-xs text-white">Votre vote</div>
                <div class="border-t-[0.75rem] border-t-[#f80000] border-r-[0.75rem] border-r-transparent w-0 h-0 top-[29px] right-[-13.25px] rounded-br-[20px] absolute"></div>` : ''} <span class="text-sm text-[#4e4e4e]">${question.optionOne.text}</span>
                <div class="w-full h-6 mt-2 rounded bg-[#e8e8e8]">
                    <div class="w-[${Math.round(question.optionOne.votes.length / totalVotes * 100)}%] relative h-full bg-[#4e4e4e] rounded">
                        <span class="text-sm text-white absolute right-1 top-[50%] translate-y-[-50%]">${Math.round(question.optionOne.votes.length / totalVotes * 100)}%</span>
                    </div>
                </div>
                <div class="text-sm font-semibold text-center mt-2">${question.optionOne.votes.length} out of ${totalVotes} vote${totalVotes > 1 ? 's' : ''}</div>
            </section>
            <section class="w-full mt-4 p-2${userAnswer === 'optionTwo' ? ' pt-10 relative' : ''} border-solid border-2 rounded border-grey" type="text" placeholder="Entrer la réponse une"> ${userAnswer === 'optionTwo' ? ` <div class="absolute right-[-13px] flex items-center pl-3 top-2 h-6 w-24 bg-[#ff0000] rounded text-xs text-white">Votre vote</div>
                <div class="border-t-[0.75rem] border-t-[#f80000] border-r-[0.75rem] border-r-transparent w-0 h-0 top-[29px] right-[-13.25px] rounded-br-[20px] absolute"></div>` : ''} <span class="text-sm text-[#4e4e4e]">${question.optionTwo.text}</span>
                <div class="w-full h-6 mt-2 rounded bg-[#e8e8e8]">
                    <div class="w-[${Math.round(question.optionTwo.votes.length / totalVotes * 100)}%] relative h-full bg-[#4e4e4e] rounded">
                        <span class="text-sm text-white absolute right-1 top-[50%] translate-y-[-50%]">${Math.round(question.optionTwo.votes.length / totalVotes * 100)}%</span>
                    </div>
                </div>
                <div class="text-sm font-semibold text-center mt-2">${question.optionTwo.votes.length} out of ${totalVotes} vote${totalVotes > 1 ? 's' : ''}</div>
            </section>
        </section>`;
        } else {
            questionContainer.innerHTML = `<section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <div class="max-w-64">
                    <h2 class="font-semibold text-lg text-base">${user.name} demande</h2>
                    <span class="text-sm">Est-ce que tu préfères</span>
                </div>
                <img class="h-20" src="${user.avatarURL}">
            </header>
            <section class="flex items center mt-4">
                <input id="checkbox1" class="mr-2" type="radio" name="answer">
                <label for="checkbox1" class="text-sm font-light">${question.optionOne.text}</label>
            </section>
            <section class="flex items center mt-4">
                <input id="checkbox2" class="mr-2" type="radio" name="answer">
                <label for="checkbox2" class="text-sm font-light">${question.optionTwo.text}</label>
            </section>
            <button id="submit" class="w-full text-sm mt-8 py-2 border-solid border-2 rounded border-[#9f9f9f]">Répondre</button>
        </section>`;

            const submit = document.getElementById('submit');
            const checkbox1 = document.getElementById('checkbox1');
            const checkbox2 = document.getElementById('checkbox2');

            submit.onclick = async function() {
                if (!checkbox1.checked && !checkbox2.checked) return;

                let userSelected = checkbox1.checked ? 'optionOne' : 'optionTwo';
                const previousQuestions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : null;

                await _saveQuestionAnswer({ authedUser: user.id, qid: questionId, answer: userSelected }, previousQuestions);

                const newQuestions = await _getQuestions();
                localStorage.setItem('questions', JSON.stringify(newQuestions));

                window.location.reload();
            }
        }
    }
})

logout.onclick = function() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}