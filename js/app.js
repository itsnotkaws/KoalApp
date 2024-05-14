import {
    _getUsers,
    _getQuestions,
    _saveQuestion,
    _saveQuestionAnswer
} from "./_DATA.js";
import {
    loginPage,
    mainPage,
    addPage,
    questionPage,
    leaderboardPage,
} from "./pages.js";

const app = document.getElementById("app");
let currentUser = null;

function loadContent(page) {
    if (currentUser) {
        switch (page) {
            case "add":
                app.innerHTML = addPage(currentUser);
                loadAddInteractions();
                break;
            case "question":
                app.innerHTML = `${questionPage(currentUser)}<h2 class="w-full text-center p-12">Chargement...</h2>`;
                break;
            case "leaderboard":
                app.innerHTML = `${leaderboardPage(currentUser)}<h2 class="w-full text-center p-12">Chargement...</h2>`;
                loadLeaderboad().then((leaderboard) => {
                    app.innerHTML = `${leaderboardPage(currentUser)}${leaderboard}`;
                });
                break;
            default:
                app.innerHTML = mainPage(currentUser);
                loadMainInteractions();
                break;
        }
    } else {
        app.innerHTML = loginPage;
        loadLoginInteractions();
    }
}

function navigateTo(page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({ page: page }, '', url);
    loadContent(page);
}

window.addEventListener('popstate', (event) => {
    const page = event.state ? event.state.page : null;
    loadContent(page);
});

window.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    const page = url.searchParams.get('page') || null;
    loadContent(page);
});

app.addEventListener('click', (event) => {
    const navHome = document.getElementById("home");
    const navAdd = document.getElementById("addq");
    const navLeaderboard = document.getElementById("leaderboard");
    const questions = document.querySelectorAll("#question");
    const logout = document.getElementById("logout");

    if (navHome && navHome.contains(event.target)) {
        navigateTo(null);
    } else if (navAdd && navAdd.contains(event.target)) {
        navigateTo("add");
    } else if (navLeaderboard && navLeaderboard.contains(event.target)) {
        navigateTo("leaderboard");
    } else if (logout && logout.contains(event.target)) {
        currentUser = null;
        navigateTo(null);
    } else if (questions && questions.length) {
        for (const question of questions) {
            if (question.contains(event.target)) {
                const questionId = question.getAttribute('qid');
                navigateTo("question");
                loadQuestion(questionId).then((questionData) => {
                    app.innerHTML = `${questionPage(currentUser)}<section class="w-full h-[calc(100% - 5rem)] p-12 flex flex-col items-center">${questionData}</section>`;
                    loadQuestionInteraction(questionId);
                });
            }
        }
    }
});

function loadLoginInteractions() {
    const loginButton = document.getElementById("login");
    const dropdown = document.getElementById("dropdown");

    _getUsers().then((users) => {
        for (const user of Object.values(users)) {
            const option = dropdown.appendChild(document.createElement("option"));
            option.innerHTML = user.name;
        }

        loginButton.onclick = () => {
            const selected = dropdown.options[dropdown.options.selectedIndex].text;
            if (selected === "Selectionne un utilisateur") return;
            currentUser = Object.values(users).find((user) => user.name === selected);
            navigateTo(null);
        };
    });

    dropdown.onchange = () => {
        const selected = dropdown.options[dropdown.options.selectedIndex].text;

        if (selected !== "Selectionne un utilisateur") {
            loginButton.removeAttribute("disabled");
        } else {
            loginButton.setAttribute("disabled", true);
        }
    };
}

function loadMainInteractions() {
    const answered = document.getElementById("answered");
    const not_answered = document.getElementById("not-answered");
    const not_answered_text = document.getElementById("not-answered-text");
    const answered_text = document.getElementById("answered-text");
    const polls = document.getElementById("polls");

    let notAnsweredHtml = "";
    let answeredHtml = "";
    let notAnsweredCount = 0;
    let answeredCount = 0;

    _getUsers().then(async (users) => {
        const user = currentUser;
        username.innerHTML = user.name;
        avatar.setAttribute("src", user.avatarURL);

        const questions = localStorage.getItem("questions") ?
            JSON.parse(localStorage.getItem("questions")) :
            await _getQuestions();

        for (const question of Object.values(questions)) {
            if (
                question.optionOne.votes.includes(user.id) ||
                question.optionTwo.votes.includes(user.id)
            )
                continue;

            const author = Object.values(users).find(
                (user) => user.id === question.author
            );
            notAnsweredCount++;
            notAnsweredHtml += `<section class="min-h-[200px] p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <section class="max-w-64">
                    <h2 class="font-semibold text-base">${author.name} demande</h2>
                    <span class="text-xs">Est-ce que tu préfères ${question.optionOne.text} ou ${question.optionTwo.text}</span>
                </section>
                <img class="h-20" src="${author?.avatarURL}" alt="avatar">
            </header>
            <footer class="w-full text-sm mt-auto py-2 border-solid border-2 rounded border-[#9f9f9f]">
                <button class="w-full mt-auto" qid="${question.id}" id="question">Voir le sondage</button>
            </footer>
        </section>`;
        }

        not_answered_text.innerHTML = notAnsweredCount;
        if (notAnsweredHtml) polls.innerHTML = notAnsweredHtml;
        else polls.innerHTML = "<h2>Pas de question</h2>";

        const answeredQuestions = getAnsweredQuestions(user.id, questions);

        for (const answer of answeredQuestions) {
            const question = Object.values(questions).find(
                (question) => question.id === answer
            );
            const author = Object.values(users).find(
                (user) => user.id === question.author
            );

            answeredCount++;
            answeredHtml += `<section class="min-h-[200px] p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <section class="max-w-64">
                    <h2 class="font-semibold text-base">${author.name} demande</h2>
                    <span class="text-xs">Est-ce que tu préfères ${question.optionOne.text} ou ${question.optionTwo.text}</span>
                </section>
                <img class="h-20" src="${author?.avatarURL}" alt="avatar">
            </header>
            <footer class="w-full text-sm mt-auto py-2 border-solid border-2 rounded border-[#9f9f9f]">
                <button class="w-full mt-auto" qid="${question.id}" id="question">Voir le sondage</button>
            </footer>
        </section>`;
        }

        answered_text.innerHTML = answeredCount;
    });

    answered.onclick = () => {
        if (answered.classList.contains("answered")) return;
        else {
            if (answeredHtml) polls.innerHTML = answeredHtml;
            else polls.innerHTML = "<h2>Pas de question</h2>";
            not_answered.classList.add("border-white");
            not_answered.classList.remove("not-answered");
            answered.classList.remove("border-white");
            answered.classList.add(
                "border-solid",
                "border-x",
                "border-t",
                "answered"
            );
        }
    };

    not_answered.onclick = () => {
        if (not_answered.classList.contains("not-answered")) return;
        else {
            if (notAnsweredHtml) polls.innerHTML = notAnsweredHtml;
            else polls.innerHTML = "<h2>Pas de question</h2>";
            answered.classList.add("border-white");
            answered.classList.remove("answered");
            not_answered.classList.remove("border-white");
            not_answered.classList.add(
                "border-solid",
                "border-x",
                "border-t",
                "not-answered"
            );
        }
    };
}

function loadAddInteractions() {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const submit = document.getElementById("submit");

    submit.onclick = async function() {
        if (!input1.value || !input2.value) return;

        _saveQuestion({
            optionOneText: input1.value,
            optionTwoText: input2.value,
            author: currentUser.id,
        });

        loadContent();
    };
}

async function loadLeaderboad() {
    const users = await _getUsers();
    const questions = await _getQuestions();
    const userScores = [];

    for (const checkingUser of Object.values(users)) {
        const answeredCount = getAnsweredQuestions(
            checkingUser.id,
            questions
        ).length;
        const createdCount = Object.values(questions).filter(
            (question) => question.author === checkingUser.id
        ).length;

        userScores.push({
            answeredCount,
            createdCount,
            total: answeredCount + createdCount,
            user: checkingUser,
        });
    }

    const leaderboard = userScores.sort((a, b) => b.total - a.total).slice(0, 3);

    return `
  	<section class="w-full h-full p-12 flex flex-col items-center">
		<div class="grid grid-cols-3 gap-6">
			<article>
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
						<div class="flex items-center justify-center text-xs bg-[#9f9f9f] rounded h-5 w-8">2e</div>
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
						<div class="flex items-center justify-center text-xs bg-[#9f9f9f] rounded h-5 w-8">3e</div>
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
			</article>
		</div>
	</section>`;
}

async function loadQuestion(questionId) {
    const users = await _getUsers();
    const questions = await _getQuestions();
    const question = questions[questionId];
    const author = Object.values(users).find(user => user.id === question.author);

    let userAnswer = null;

    if (question.optionOne.votes.includes(currentUser.id)) userAnswer = 'optionOne';
    else if (question.optionTwo.votes.includes(currentUser.id)) userAnswer = 'optionTwo';

    const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;

    if (userAnswer) {
        return `<section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <div class="max-w-64">
                    <h2 class="font-semibold text-lg text-base">${author.name} demande</h2>
                    <span class="text-sm">Est-ce que tu préfères</span>
                </div>
                <img class="h-20" src="${author.avatarURL}">
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
        return `<section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <div class="max-w-64">
                    <h2 class="font-semibold text-lg text-base">${author.name} demande</h2>
                    <span class="text-sm">Est-ce que tu préfères</span>
                </div>
                <img class="h-20" src="${author.avatarURL}">
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
    }
}

function loadQuestionInteraction(questionId) {
    const submit = document.getElementById('submit');
    const checkbox1 = document.getElementById('checkbox1');
    const checkbox2 = document.getElementById('checkbox2');

    submit.onclick = async function() {
        if (!checkbox1.checked && !checkbox2.checked) return;

        let userSelected = checkbox1.checked ? 'optionOne' : 'optionTwo';
        await _saveQuestionAnswer({
            authedUser: currentUser.id,
            qid: questionId,
            answer: userSelected
        });

        loadContent("question");
        loadQuestion(questionId).then((questionData) => {
            app.innerHTML = `${questionPage(currentUser)}<section class="w-full h-[calc(100% - 5rem)] p-12 flex flex-col items-center">${questionData}</section>`;
            loadQuestionInteraction(questionId);
        });
    }
}

function getAnsweredQuestions(userId, questions) {
    const answeredQuestions = [];

    for (const question of Object.values(questions)) {
        if (
            question.optionOne.votes.includes(userId) ||
            question.optionTwo.votes.includes(userId)
        ) {
            answeredQuestions.push(question.id);
        }
    }

    return answeredQuestions;
}
