// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB1xaLsD-vTMCqFR_dkVA-NE42xg2Y_K9k",
    authDomain: "loginprop610.firebaseapp.com",
    databaseURL: "https://loginprop610.firebaseio.com",
    projectId: "loginprop610",
    storageBucket: "loginprop610.appspot.com",
    messagingSenderId: "819035794902",
    appId: "1:819035794902:web:ebd5354a98b61a144f8877"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let dt = localStorage.getItem('_data');
console.log(dt)
if (dt == null) {
    console.log('Hola');
    window.location.href = 'welcome.html';
}

// === CHECK LOGIN USER === //
verifyUser =() => {
    firebase.auth().onAuthStateChanged(async (user) => {
        let log = await user;
        if(log) {
            console.log(log);
            if (log.emailVerified === false) {
                document.getElementById('tab-content').innerHTML = `
                    
                <div class="tab-body active">
                    <div class="img-log">
                        <img src="https://selftour-user-profile.s3.amazonaws.com/default.png" width="150" height="auto">
                    </div>
                    <div class="mx-4">
                        <span style="color: red;">Favor de validar correo con el link!</span>
                    </div>
                   
                    <div class="px-4 my-5">
                        <button class="btn btn-primary btn-block" id="signup" onclick=" window.location.reload()">Aceptar</button>
                    </div>
                </div>
                `;
            } else {
                let r = localStorage.getItem('role');
                console.log(r);
                //window.location.href = "index.html";
            }
        } else {
            if (!window.location.href.includes("welcome")) {
                window.location.href = "welcome.html";
            }
            
        }
    })
}

verifyUser();


// === USER AND PASS SIGNIN === //
const credentialsSignin = () => {
    if (!firebase.auth().currentUser) {
        var email = document.getElementById('logmail').value;
        var password = document.getElementById('logpass').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((UserCredential) => {
                console.log(UserCredential.user.uid);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("_uid", UserCredential.user.uid);
                urlencoded.append("email", email);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch("http://localhost:3000/login", requestOptions)
                .then(response => response.json())
                .then(result => {
                    let tkn = result.token;
                    localStorage.setItem('_data', tkn);

                    if (result.user.role === 'vendedor') {
                        window.location.href = "propiedad.html";
                    }
                    window.location.reload();
                })
                .catch(error => console.log('error', error));
                
            })
            .catch(function(error) {
                console.log(error)
                let errorCode = error.code;
                let msg = document.getElementById('errorlogin');
                if (errorCode === 'auth/wrong-password') {
                    msg.style.display = 'inline';
                }
            });
    }
}

// === CREAR USUARIO FORM === //
const createUser = () => {
        let email = document.getElementById('email').value;
        let username = document.getElementById('username').value;
        let pass = document.getElementById('password').value; 
        let role = document.getElementById('role').value;

    
        if (!validateEmail(email)) {
            console.log('El correo no tiene el formato correcto');
        }
    
        firebase.auth().createUserWithEmailAndPassword(email, pass)
            .then((userCredentials) => {
                //console.log(userCredentials.user.uid);
                verificationEmail();

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("name", email);
                urlencoded.append("email", username);
                urlencoded.append("pass", pass);
                urlencoded.append("role", role);

                var opts = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch("http://localhost:3000/register", opts)
                .then(response => response.json())
                .then(result => {
                    let content = document.getElementById('tab-content');
                    console.log(result.user.role);
                    localStorage.setItem( '_data', result.tkn )
                    localStorage.setItem( 'role', result.user.role )
                    if (result.user.role === 'vendedor') {
                        //window.location.href = "addProp.html";
                    } 
                    //window.location.reload();
                })
                .catch(error => console.log('error', error));

                
            })
            .catch((err) => {
                let error = err.code;
                let msg = err.message;
                let duplicate = document.getElementById('duplicate');
                /* console.log(error, msg); */
                if (error === 'auth/email-already-in-use') {
                    duplicate.innerHTML = `<span style="padding: 10px; color: red;">El correo esta en uso</span>`;
                    duplicate.style.display = 'inline';
                }
            })
};

const verificationEmail = () => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    });
}

// === VALIDAR CORREO === //
const validateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

logoutUser = () => {
    firebase.auth().signOut().then(function() {
        localStorage.removeItem('_data');
        window.location.href = "welcome.html";
      }).catch(function(error) {
        // An error happened.
      });
}