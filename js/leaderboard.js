import { _getUsers, _getQuestions } from './_DATA.js';

const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '/login.html';
}

const username = document.getElementById('username');
const avatar = document.getElementById('avatar');
const logout = document.getElementById('logout');
const leaderboardContainer = document.getElementById('leaderboard');

_getUsers().then(async users => {
    const user = Object.values(users).find(user => user.name === currentUser);

    if (!user) {
        window.location.href = '/login.html';
    } else {
        username.innerHTML = user.name;
        avatar.setAttribute('src', user.avatarURL);

        const questions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : await _getQuestions();

        const userScores = [];

        for (const checkingUser of Object.values(users)) {
            const answeredCount = getAnsweredQuestions(checkingUser.id, questions).length;
            const createdCount = Object.values(questions).filter(question => question.author === checkingUser.id).length;
            
            userScores.push({ answeredCount, createdCount, total: answeredCount + createdCount, user: checkingUser });
        }

        const leaderboard = userScores.sort((a, b) => b.total - a.total).slice(0, 3);

        leaderboardContainer.innerHTML = `<article>
        <section class="relative">
            <figure class="absolute h-0 w-0 border-t-[45px] border-t-[#ff0000] border-r-[45px] border-r-transparent"></figure>
            <i class="fa-solid fa-trophy absolute top-1.5 left-1.5 text-white text-[14px]"></i>
            <img class="w-52 rounded-t" src="${leaderboard[0].user.avatarURL}" alt="avatar">
        </section>
        <section class="w-52 p-4 border-solid border-x-2 border-b-2 rounded-b shadow-xl">
            <h3 class="font-semibold text-lg">${leaderboard[0].user.name}</h3>
            <div class="flex items-center gap-2">
                <span class="font-semibold text-[#9f9f9f]">Rang</span>
                <div class="flex items-center justify-center text-xs bg-[#9f9f9f] rounded h-5 w-8">1er</div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div>
                    <span class="text-xs">Répondues : ${leaderboard[0].answeredCount}</span>
                    <span class="text-xs">Créées : ${leaderboard[0].createdCount}</span>
                </div>
                <div class="flex flex-col items-center justify-center mt-2 pl-2 border-solid border-l">
                    <span class="text-sm font-medium">Score</span>
                    <div class="text-sm font-semibold rounded-full text-white w-8 h-8 bg-[#ff0000] flex items-center justify-center">${leaderboard[0].total}</div>
                </div>
            </div>
        </section>
    </article>
    <article>
        <section class="relative">
            <figure class="absolute h-0 w-0 border-t-[45px] border-t-orange-500 border-r-[45px] border-r-transparent"></figure>
            <i class="fa-solid fa-trophy absolute top-1.5 left-1.5 text-white text-[14px]"></i>
            <img class="w-52 rounded-t" src="${leaderboard[1].user.avatarURL}" alt="avatar">
        </section>
        <section class="w-52 p-4 border-solid border-x-2 border-b-2 rounded-b shadow-xl">
            <h3 class="font-semibold text-lg">${leaderboard[1].user.name}</h3>
            <div class="flex items-center gap-2">
                <span class="font-semibold text-[#9f9f9f]">Rang</span>
                <div class="flex items-center justify-center text-xs bg-[#9f9f9f] rounded h-5 w-8">1er</div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div>
                    <span class="text-xs">Répondues : ${leaderboard[1].answeredCount}</span>
                    <span class="text-xs">Créées : ${leaderboard[1].createdCount}</span>
                </div>
                <div class="flex flex-col items-center justify-center mt-2 pl-2 border-solid border-l">
                    <span class="text-sm font-medium">Score</span>
                    <div class="text-sm font-semibold rounded-full text-white w-8 h-8 bg-orange-500 flex items-center justify-center">${leaderboard[1].total}</div>
                </div>
            </div>
        </section>
    </article>
    <article>
        <section class="relative">
            <figure class="absolute h-0 w-0 border-t-[45px] border-t-[#f7f700] border-r-[45px] border-r-transparent"></figure>
            <i class="fa-solid fa-trophy absolute top-1.5 left-1.5 text-white text-[14px]"></i>
            <img class="w-52 rounded-t" src="${leaderboard[2].user.avatarURL}" alt="avatar">
        </section>
        <section class="w-52 p-4 border-solid border-x-2 border-b-2 rounded-b shadow-xl">
            <h3 class="font-semibold text-lg">${leaderboard[2].user.name}</h3>
            <div class="flex items-center gap-2">
                <span class="font-semibold text-[#9f9f9f]">Rang</span>
                <div class="flex items-center justify-center text-xs bg-[#9f9f9f] rounded h-5 w-8">1er</div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div>
                    <span class="text-xs">Répondues : ${leaderboard[2].answeredCount}</span>
                    <span class="text-xs">Créées : ${leaderboard[2].createdCount}</span>
                </div>
                <div class="flex flex-col items-center justify-center mt-2 pl-2 border-solid border-l">
                    <span class="text-sm font-medium">Score</span>
                    <div class="text-sm font-semibold rounded-full text-white w-8 h-8 bg-[#f7f700] flex items-center justify-center">${leaderboard[2].total}</div>
                </div>
            </div>
        </section>
    </article>`;
    }
})

function getAnsweredQuestions(userId, questions) {
    const answeredQuestions = [];

    for (const question of Object.values(questions)) {
        if (question.optionOne.votes.includes(userId) || question.optionTwo.votes.includes(userId)) {
            answeredQuestions.push(question.id);
        }
    }

    return answeredQuestions;
}

logout.onclick = function() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}