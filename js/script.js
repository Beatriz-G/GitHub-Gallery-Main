//div with a class of overview
const overview = document.querySelector(".overview");
//Github user name
const username = "Beatriz-G";
//variable selecting the unordered list to display the repos list
const repoList = document.querySelector(".repo-list");


//async function to fetch information from GH profile
const fetchInfo = async function () {
    const user = await fetch(`https://api.github.com/users/${username}`);

    const data = await  user.json();
    displayUserInfo(data);
};

fetchInfo();

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
    ghRepos();
};

const ghRepos = async function () {
    const fetchRepoList =await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const fetchData = await fetchRepoList.json();

    displayInfo(fetchData);
};

const displayInfo = function (repos) {
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
}; 

