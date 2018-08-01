var key = '?api_key=f3754f54a647c3b3e1a8cc28028c910b',
    movie_id = 447332;



/*==== XMLHttpRequest case ====*/

function xmlRequest(url, number) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            console.log('sth goes wrong')
        } else {
            var response = JSON.parse(xhr.response);

            switch(number) {
                case 1:
                    document.getElementById('movie-name').innerText = response.title;
                    xmlRequest('https://api.themoviedb.org/3/movie/' + movie_id + '/credits' + key, 2);
                    break
                case 2:
                    document.getElementById('team-size').innerText = response.crew.length;
                    var person_id = (response.crew[0]).id;
                    xmlRequest('https://api.themoviedb.org/3/person/' + person_id + key, 3);
                    break
                case 3:
                    document.getElementById('member-name').innerText = response.name;
                    image_path = response.profile_path;
                    document.getElementById('member-picture').src = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + image_path + key;
                    break
                default:
                    console.log(response)

            }
        }
    }
}

xmlRequest('https://api.themoviedb.org/3/movie/' + movie_id + key, 1);



/*==== Promises case ====*/


function promiseRequest(url) {

    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;

            if (xhr.status != 200) {
                var error = new Error(this.statusText);
                reject(error);
            } else {
                resolve(JSON.parse(this.response))
            }
        }
    })
}

promiseRequest('https://api.themoviedb.org/3/movie/' + movie_id + key)
    .then(function(response) {
          document.getElementById('movie-name').innerText = response.title;
          return promiseRequest('https://api.themoviedb.org/3/movie/' + movie_id + '/credits' + key)
    }).then(function(response) {
          document.getElementById('team-size').innerText = response.crew.length;
          var person_id = (response.crew[0]).id;
          return promiseRequest('https://api.themoviedb.org/3/person/' + person_id + key);
     }).then(function(response) {
          document.getElementById('member-name').innerText = response.name;
          image_path = response.profile_path;
          document.getElementById('member-picture').src = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + image_path + key;
     }).catch(function(error) {
          console.log(error);
});


/*==== Generator case ====*/

var person_id = null; // I know it a bad approach

function generatorRequest(url) {

    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;

            if (xhr.status != 200) {
                var error = new Error(this.statusText);
                reject(error);
            } else {
                resolve(JSON.parse(this.response))
            }
        }
    })
}

function* getData() {
    yield generatorRequest('https://api.themoviedb.org/3/movie/' + movie_id + key);
    yield generatorRequest('https://api.themoviedb.org/3/movie/' + movie_id + '/credits' + key);
    yield generatorRequest('https://api.themoviedb.org/3/person/' + person_id + key);

}

var generator = getData();

generator.next().value.then(function(response) {
    document.getElementById('movie-name').innerText = response.title;
    generator.next().value.then(function(response) {
        document.getElementById('team-size').innerText = response.crew.length;
        person_id = (response.crew[0]).id;
        generator.next().value.then(function(response) {
            document.getElementById('member-name').innerText = response.name;
            image_path = response.profile_path;
            document.getElementById('member-picture').src = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + image_path + key;
        })
    })
})