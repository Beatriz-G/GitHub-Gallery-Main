//div with a class of overview
const overview = document.querySelector(".overview");
//Github user name
const username = "Beatriz-G";
//variable selecting the unordered list to display the repos list
const repoList = document.querySelector(".repo-list");
//selects the section with a class of repos where all the information appears
const repoContainer = document.querySelector(".repos");
//selects the section with a class of repo-data where the individual repo data will appear
const repoData = document.querySelector(".repo-data");
//selects the back to repo gallery button
const backButton = document.querySelector(".view-repos");
//selects the input with the search by name placeholder
const filterInput = document.querySelector(".filter-repos");

//async function to fetch information from GH profile
const userInfo = async function () {
    const user = await fetch(`https://api.github.com/users/${username}`);
    const data = await  user.json();
    displayUserInfo(data);
};

userInfo();

//fetch GH user data, function to display the fetched user info onthe page
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
        <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(div);
    ghRepos(username);
};

const ghRepos = async function (username) {
    const fetchRepoList =await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepoList.json();

    displayInfo(repoData);
};

//shows repos
const displayInfo = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
}; 

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    specificInfo(repoName);
    }
});

const specificInfo = async function (repoName) {
    const repoSpec = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await repoSpec.json();

    //console.log(repoInfo);

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    //console.log(languageData);

    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }

    displayRepo(repoInfo, languages);
};

//display repo languages
const displayRepo = function (repoInfo, languages) {
    backButton.classList.remove("hide");
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    repoContainer.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;

    repoData.append(div);
};

//back button
backButton.addEventListener("click", function () {
    repoContainer.classList.remove("hide");
    repoData.classList.add("hide");
    backButton.classList.add("hide");
});

//input event for search box
filterInput.addEventListener("input", function (e) {
    const searchText =  e.target.value;

    const repos = document.querySelectorAll(".repo");

    const searchLowerText = searchText.toLowerCase();

    for (const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
        if (repoLowerText.includes(searchLowerText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});