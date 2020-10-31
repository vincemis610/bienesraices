const api = 'https://haunted-mausoleum-45629.herokuapp.com/';

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


// === VERIFICAR USUARIO LOGEADO === //
verifyUser =() => {
    firebase.auth().onAuthStateChanged(async (user) => {
        let log = await user;
        if (!log) {
            console.log('Si no eiste');
            if (!window.location.href.includes('welcome')) {
                window.location.href = 'welcome.html';
            }
        } else {
            document.getElementById('userlogin').innerHTML = `<strong style="color: white">${log.email}</strong>`
        }
        
    })
};

// === VALIDAR CORREO ENVIADO === //
verifyMail = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
        let log = await user;
        localStorage.setItem('verified', log.emailVerified);
        let m = localStorage.getItem('verified');
        console.log(m);
        if (m) {
            window.location.href = 'index.html';
        }
    })
}


// === INICIAR SESION === //
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

                var opts = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch(`${api}login`, opts)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    localStorage.setItem('_data', result.token);
                    localStorage.setItem('role', result.user.role);
                    window.location.href = 'index.html';
                })
                .catch(error => console.log('error', error));
                
            })
            .catch(function(error) {
                console.log(error);
                let errorCode = error.code;
                let msg = document.getElementById('errorlogin');
                if (errorCode === 'auth/wrong-password') {
                    msg.innerHTML= `<span style="color: red;">Contrasenia incorrecta</span>`
                    msg.style.display = 'inline';
                }
                if( errorCode === "auth/user-not-found"){
                    msg.innerHTML= `<span style="color: red;">Usuario no registrado</span>`;
                    msg.style.display = 'inline';
                }
            });
    }
}

// === CERRAR SESION === //
logoutUser = () => {
    firebase.auth().signOut().then(function() {
        localStorage.removeItem('_data');
        localStorage.removeItem('role');
        localStorage.removeItem('verified');
        window.location.href = "welcome.html";
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
};

// === ENVIAR CORREO === //
const verificationEmail = () => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    });
};


// === REGISTRAR USUARIO === //
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
            console.log('Usuario en firease exitoso');
            console.log(userCredentials);
            verificationEmail();

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("name", username);
            urlencoded.append("email", email);
            urlencoded.append("pass", pass);
            urlencoded.append("role", role);

            var opts = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch(`${api}register`, opts)
            .then(response => response.json())
            .then(result => {
                let content = document.getElementById('tab-content');
                
                content.innerHTML = `<div class="tab-body active">
                                <div class="img-log">
                                    <img src="https://selftour-user-profile.s3.amazonaws.com/default.png" width="150" height="auto">
                                </div>
                                <div class="mx-4">
                                    <span style="color: red;">Favor de validar correo con el link!</span>
                                </div>
                            
                                <div class="px-4 my-5">
                                    <button class="btn btn-primary btn-block" id="signup" onclick=" window.location.reload()">Aceptar</button>
                                </div>
                            </div>`;

                localStorage.setItem( '_data', result.tkn )
                localStorage.setItem( 'role', result.user.role )
                localStorage.setItem('verified', userCredentials.user.emailVerified)
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