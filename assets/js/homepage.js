//query selectors for dom manipulation
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSeaerchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make request to the url   
    fetch(apiUrl)
    .then(function(response) {
        //if the desired username look up exists and returns a non 404 error
        if (response.ok) {
        //convert response to json
            response.json().then(function(data) {
                //pass data and user info to displayRepos
                displayRepos(data, user);
            });
        }
        else {
            alert("Error: GitHub User Not Found");
        }
    })
    
    //deals with rejected promises (fetch request failed for one reaosn or another)
    .catch(function(error) {
        
        //notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
}  

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        //pass input to getUserRepo function
        getUserRepos(username);
        //reset text field value to nothing
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a GitHub username");
    }
}

var displayRepos = function(repos, searchTerm) {
    console.log(repos);
    console.log(searchTerm);
    
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //clear old content
    repoContainerEl.textContent = "";
    repoSeaerchTerm.textContent = searchTerm;

    for (var i = 0; i < repos.length; i++) {
        //format repo to capture exactly what we need from the json
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>a" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}

//retrieve langauge specific repos 
var getFeaturedRepo = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GitHub User Not Found");
        }
    });

}

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    if (language) {
        getFeaturedRepo(language);

        //clear old content since api fetch could take long so this executes first
        repoContainerEl.textContent = "";
    }
}

getUserRepos();

//event listeners
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);