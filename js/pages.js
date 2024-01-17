export const loginPage = `
<section class="flex flex-col h-full items-center justify-center">
    <header class="flex items-center">
        <img class="h-20 mr-2" src="data:image/png;base64,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" alt="icon">
        <h2 class="text-xl font-bold">Connexion à votre compte</h2>
    </header>
    <article class="flex flex-col items-center justify-center p-4 border-solid rounded-md border-2 shadow-2xl">
        <select id="dropdown" class="text-[grey] text-sm w-full p-2 rounded border-solid border focus:outline-none" required>
            <option selected disabled hidden>Selectionne un utilisateur</option>
        </select>
        <p class="px-4 text-xs mt-4">Selectionne un utilisateur au dessus et clique sur le bouton connexion.<br>Cette application est une démonstration et ne nécessite pas de mot de passe.</p>
        <button id="login" disabled class="p-2 mt-4 bg-black w-full rounded-md text-white">Connexion</button>
    </article>
</section>
`;

const header = (current, user) => `<header class="text-white w-full h-20 bg-black">
<nav class="flex items-center justify-around h-full"> 
    <ul class="flex items-center h-full">
        <li id="home" class="flex items-center p-4 h-full border-solid border-[#4e4e4e] border-x cursor-pointer hover:bg-[#4e4e4e]${current === 'main' ? ' bg-[#4e4e4e]' : ''}">
            <img class="h-10 mr-3" src="https://cdn.pixabay.com/photo/2021/10/30/14/44/speech-balloon-6754528_960_720.png" alt="icon">
            <span class="text-sm">Accueil</span>
        </li>
        <li id="addq" class="flex items-center p-4 h-full border-solid border-[#4e4e4e] border-r cursor-pointer hover:bg-[#4e4e4e]${current === 'add' ? ' bg-[#4e4e4e]' : ''}">
            <span class="text-sm">Nouvelle Question</span>
        </li>
        <li id="leaderboard" class="flex items-center p-4 h-full border-solid border-[#4e4e4e] border-r cursor-pointer hover:bg-[#4e4e4e]${current === 'leaderboard' ? ' bg-[#4e4e4e]' : ''}">
            <span class="text-sm">Classement</span>
        </li>
    </ul>
    <ul class="flex items-center h-full p-4 border-solid border-x border-[#4e4e4e]">
        <li class="flex items-center gap-2">
            <span class="text-sm">Bienvenue, <span id="username" class="text-sm">${user.name}</span></span>
            <img id="avatar" class="h-8 rounded-full" src="${user.avatarURL}" alt="avatar">
        </li>
        <li>
            <button id="logout" class="ml-8 h-full text-sm">Déconnexion</button>
        </li>
    </ul>
</nav>
</header>`

export const mainPage = (user) => `
${header('main', user)}
<section class="w-full h-[calc(100% - 5rem)] p-12 flex flex-col items-center">
    <section class="pt-2 rounded">
        <div class="flex relative">
            <details>
                <summary id="not-answered" class="flex items-center w-[182px] p-4 cursor-pointer border-solid border-x border-t px-4 rounded-t not-answered">
                    <span class="text-sm">Non répondues</span>
                    <span id="not-answered-text" class="text-sm text-white ml-auto bg-[#9f9f9f] px-2 rounded">0</span>
                </summary>
            </details>
            <details>
                <summary id="answered" class="flex items-center w-[153px] p-4 cursor-pointer border-solid border-x border-t border-white px-4 rounded-t">
                    <span class="text-sm">Répondues</span>
                    <span id="answered-text" class="text-sm text-white ml-auto bg-[#9f9f9f] px-2 rounded">0</span>
                </summary>
            </details>
        </div>
        <div id="polls" class="w-[825px] grid grid-cols-2 gap-6 p-4 mb-8 border-solid border rounded-b">
            <h2>Chargement...</h2>
        </div>
    </section>
</section>
`;

export const addPage = (user) => `
${header('add', user)}
<section class="w-full h-full p-12 flex flex-col items-center">
    <section class="p-4 flex flex-col border-solid border rounded-md min-w-96">
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
    </section>
</section>
`;

export const questionPage = (user) => `
${header('main', user)}
`;

export const leaderboardPage = (user) => `
${header('leaderboard', user)}
`;
