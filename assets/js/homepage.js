var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make request to the url   
    fetch(apiUrl).then(function(response) {
        //convert response to json
        response.json().then(function(data) {
            console.log(data);
        });
    });
}  

getUserRepos("jorge-gasca");