function initFirebase() {
    var firebaseConfig = {
        apiKey: "AIzaSyDgQXWkH0gSO6lJLw1iwKHcyBYNru4YtUU",
        authDomain: "concept-pharmacy.firebaseapp.com",
        projectId: "concept-pharmacy",
        storageBucket: "concept-pharmacy.appspot.com",
        messagingSenderId: "809365545879",
        appId: "1:809365545879:web:2d5fed360c42203d289ad2",
        measurementId: "G-NHDFNQYHZ6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

}

initFirebase()

var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

console.log(sPage)

function checkCookie() {
    var user = getCookie("user");
    var pass = getCookie("pass")
    if (user != "" && pass != "" && sPage != "index.html") {
        window.location.replace("./index.html");
    } else {
        window.location.replace("./login.html");
        alert("Debes iniciar sesion")
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};



if (sPage == "index.html") {

    function GetElementInsideContainer(containerID, childID) {
        var elm = {};
        var elms = document.getElementById(containerID).getElementsByTagName("*");
        for (var i = 0; i < elms.length; i++) {
            if (elms[i].id === childID) {
                elm = elms[i];
                break
            }
        }
        return elm;
    }
    
    function changeURL(id, value) {
        element = GetElementInsideContainer(id, "")
        element.href = value
    }

    window.addEventListener("load", function(){

        

        if (user != "" && pass != "") {
            firebase.auth().signInWithEmailAndPassword(user, pass).then((success) => {
                setCookie("user", user, 30)
                setCookie("pass", pass, 30)
                console.log(firebase.auth().currentUser.email)
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: "Correo o Contraseña incorrectas, porfavor vuelve a iniciar sesion.",
                }).then((value) => {
                    delete_cookie("user")
                    delete_cookie("pass")
                    window.location.replace('./login.html')
                })
            });
            
        } else {
            window.location.replace("./login.html");
        }


        firebase.database().ref('redes-sociales').once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                changeURL(childKey, childData)
            });
        });
    });

    var user = getCookie("user")
    var pass = getCookie("pass")

    
    

    var main = document.getElementById("main")


    var accordion = document.createElement('div')
    accordion.className = "accordion accordion-flush"
    accordion.id = "accordionInfo"

    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    function createAccordionHome(title, text, id) {
        var accordionItem = document.createElement('div')
        accordionItem.className = "accordion-item"

        // HEADER
        var header = document.createElement('h2')
        header.className = "accordion-header"
        header.id = "flush-heading" + id
        var headerButton = document.createElement('button')
        headerButton.className = "accordion-button collapsed"
        headerButton.type = "button"
        headerButton.setAttribute("data-bs-toggle", "collapse")
        headerButton.setAttribute("data-bs-target", "#flush-collapse" + id)
        headerButton.setAttribute("aria-expanded", "false")
        headerButton.setAttribute("aria-controls", "flush-collapse" + id)
        var buttonText = document.createElement("h4")
        buttonText.className = "h4 text-center text-dark mb-3"
        buttonText.innerHTML = title
        headerButton.append(buttonText)

        header.append(headerButton)

        // CONTENT
        var content = document.createElement('div')
        content.className = "accordion-collapse collapse"
        content.id = "flush-collapse" + id
        content.setAttribute("aria-labelledby", "flush-heading" + id)
        content.setAttribute("data-bs-parent", "#accordionInfo")

        for (var i = 0; i < text.length; i++) {
            if (text[i].includes("TITULO: ")) {
                text[i] = text[i].replace("TITULO: ", "")
                var contentText = document.createElement('div')
                contentText.className = "accordion-body"
                //contentText.innerHTML = text[i]
                var _text = document.createElement('h4')
                _text.innerHTML = text[i]
                contentText.append(_text)
            } else {

                var contentText = document.createElement('div')
                contentText.className = "accordion-body"

                if (isValidHttpUrl(text[i])) {
                    var a = document.createElement('a')
                    a.href = text[i]
                    a.innerHTML = text[i]
                    contentText.append(a)
                } else {
                    contentText.innerHTML = text[i]
                }
            }


            content.append(contentText)
        }


        // APPEND VALUES
        accordionItem.append(header)
        accordionItem.append(content)

        accordion.append(accordionItem)
    }

    var a = document.createElement('a')
    a.className = "btn btn-outline-success btn-lg "
    a.href = "./catalogo.html"
    a.style.margin = "20px"
    var h4 = document.createElement('h4')
    h4.innerHTML = "Catalogo"
    a.append(h4)
    

    var br = document.createElement('br')

    accordion.append(a)
    accordion.append(br)
    accordion.append(br)

    firebase.database().ref('informacion').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            createAccordionHome(childData["titulo"], childData["texto"], childKey.toString())
        });
    });

    main.append(accordion)
    main.append(document.createElement('br'))
    main.append(document.createElement('br'))
} else if (sPage == "login.html") {

    var user = getCookie("user")
    var pass = getCookie("pass")

    if (user != "" && pass != "") {
        window.location.replace("./index.html");
    } else {
        //window.location.replace("./login.html");
    }

    // xxxxxxxxxx Email Validation xxxxxxxxxx
    function checkUserEmail() {
        var userEmail = document.getElementById("userEmail");
        var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var flag;
        if (userEmail.value.match(userEmailFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userEmailError").style.display = "block";
        } else {
            document.getElementById("userEmailError").style.display = "none";
        }
    }
    // xxxxxxxxxx Password Validation xxxxxxxxxx
    function checkUserPassword() {
        var userPassword = document.getElementById("userPassword");
        var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;
        var flag;
        if (userPassword.value.match(userPasswordFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userPasswordError").style.display = "block";
        } else {
            document.getElementById("userPasswordError").style.display = "none";
        }
    }
    // xxxxxxxxxx Sign In Email Validation xxxxxxxxxx
    function checkUserSIEmail() {
        var userSIEmail = document.getElementById("userSIEmail");
        var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var flag;
        if (userSIEmail.value.match(userSIEmailFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userSIEmailError").style.display = "block";
        } else {
            document.getElementById("userSIEmailError").style.display = "none";
        }
    }
    // xxxxxxxxxx Sign In Password Validation xxxxxxxxxx
    function checkUserSIPassword() {
        var userSIPassword = document.getElementById("userSIPassword");
        var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;
        var flag;
        if (userSIPassword.value.match(userSIPasswordFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userSIPasswordError").style.display = "block";
        } else {
            document.getElementById("userSIPasswordError").style.display = "none";
        }
    }
    // xxxxxxxxxx Check email or password exsist in firebase authentication xxxxxxxxxx    
    function signIn() {
        var userSIEmail = document.getElementById("userSIEmail").value;
        var userSIPassword = document.getElementById("userSIPassword").value;

        var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;

        var checkUserEmailValid = userSIEmail.match(userSIEmailFormate);
        //var checkUserPasswordValid = userSIPassword.match(userSIPasswordFormate);
        console.log("USEEER SIGN IN FUNCtioN")
        if (checkUserEmailValid == null) {
            return checkUserSIEmail();
        }
        // } else if (checkUserPasswordValid == null) {
        //     return checkUserSIPassword();
        // } 
        else {
            firebase.auth().signInWithEmailAndPassword(userSIEmail, userSIPassword).then((success) => {
                setCookie("user", userSIEmail, 30)
                setCookie("pass", userSIPassword, 30)
                window.location.replace("./index.html");
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: "Correo o Contraseña incorrectas",
                })
            });
        }
    }
    // xxxxxxxxxx Working For Profile Page xxxxxxxxxx
    // xxxxxxxxxx Get data from server and show in the page xxxxxxxxxx
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //   User is signed in.
            let user = firebase.auth().currentUser;
            let uid
            if (user != null) {
                uid = user.uid;
            }
            let firebaseRefKey = firebase.database().ref().child("usuarios").child(uid);
            firebaseRefKey.on('value', (dataSnapShot) => {
                document.getElementById("userPfFullName").innerHTML = dataSnapShot.val().userFullName;
                document.getElementById("userPfSurname").innerHTML = dataSnapShot.val().userSurname;
                // userEmail = dataSnapShot.val().userEmail;
                // userPassword = dataSnapShot.val().userPassword;
                document.getElementById("userPfFb").setAttribute('href', dataSnapShot.val().userFb);
                document.getElementById("userPfTw").setAttribute('href', dataSnapShot.val().userTw);
                document.getElementById("userPfGp").setAttribute('href', dataSnapShot.val().userGp);
                document.getElementById("userPfBio").innerHTML = dataSnapShot.val().userBio;
            })
        } else {
            //   No user is signed in.
        }
    });

} else if (sPage == "registro.html") {

    var user = getCookie("user")
    var pass = getCookie("pass")

    if (user != "" && pass != "") {
        window.location.replace("./index.html");
    }

    // xxxxxxxxxx Working For Sign Up Form xxxxxxxxxx
    // xxxxxxxxxx Full Name Validation xxxxxxxxxx
    function checkUserFullName() {
        var userSurname = document.getElementById("userFullName").value;
        var flag = false;
        if (userSurname === "") {
            flag = true;
        }
        if (flag) {
            document.getElementById("userFullNameError").style.display = "block";
        } else {
            document.getElementById("userFullNameError").style.display = "none";
        }
    }

    function checkUserTel() {
        var userTel = document.getElementById("userTel").value;
        var flag = false;
        if (userTel === "") {
            flag = true;
        }
        if (flag) {
            document.getElementById("userTelError").style.display = "block";
        } else {
            document.getElementById("userTelError").style.display = "none";
        }
    }

    function checkUserInstitucion() {
        var userTel = document.getElementById("userInstitucion").value;
        var flag = false;
        if (userTel === "") {
            flag = true;
        }
        if (flag) {
            document.getElementById("userInstitucionError").style.display = "block";
        } else {
            document.getElementById("userInstitucionError").style.display = "none";
        }
    }

    function checkUserInstitucion() {
        var userTel = document.getElementById("userPuesto").value;
        var flag = false;
        if (userTel === "") {
            flag = true;
        }
        if (flag) {
            document.getElementById("userPuestoError").style.display = "block";
        } else {
            document.getElementById("userPuestoError").style.display = "none";
        }
    }

    function checkUserPuesto() {

    }

    // xxxxxxxxxx User Surname Validation xxxxxxxxxx
    function checkUserSurname() {
        var userSurname = document.getElementById("userSurname").value;
        var flag = false;
        if (userSurname === "") {
            flag = true;
        }
        if (flag) {
            document.getElementById("userSurnameError").style.display = "block";
        } else {
            document.getElementById("userSurnameError").style.display = "none";
        }
    }
    // xxxxxxxxxx Email Validation xxxxxxxxxx
    function checkUserEmail() {
        var userEmail = document.getElementById("userEmail");
        var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var flag;
        if (userEmail.value.match(userEmailFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userEmailError").style.display = "block";
        } else {
            document.getElementById("userEmailError").style.display = "none";
        }
    }
    // xxxxxxxxxx Password Validation xxxxxxxxxx
    function checkUserPassword() {
        var userPassword = document.getElementById("userPassword");
        var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        var flag;
        if (userPassword.value != "") {
            flag = false;
        } else {
            flag = true;
        }
        // if (userPassword.value.match(userPasswordFormate)) {
        //     flag = false;
        // } else {
        //     flag = true;
        // }
        if (flag) {
            document.getElementById("userPasswordError").style.display = "block";
        } else {
            document.getElementById("userPasswordError").style.display = "none";
        }
    }
    // xxxxxxxxxx Check user bio characters. It'll use later xxxxxxxxxx
    function checkUserBio() {
        var userBio = document.getElementById("userBio").value;
        var flag = false;
        if (flag) {
            document.getElementById("userBioError").style.display = "block";
        } else {
            document.getElementById("userBioError").style.display = "none";
        }
    }
    // xxxxxxxxxx Submitting and Creating new user in firebase authentication xxxxxxxxxx
    function signUp() {
        var userFullName = document.getElementById("userFullName").value;
        var userSurname = document.getElementById("userSurname").value;
        var userEmail = document.getElementById("userEmail").value;
        var userPassword = document.getElementById("userPassword").value;
        var userTel = document.getElementById('userTel').value;
        var userInstitucion = document.getElementById('userInstitucion').value;
        var userPuesto = document.getElementById('userPuesto').value;


        var userFullNameFormate = /^([A-Za-z.\s_-])/;
        var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;

        var checkUserFullNameValid = userFullName.match(userFullNameFormate);
        var checkUserEmailValid = userEmail.match(userEmailFormate);
        //var checkUserPasswordValid = userPassword.match(userPasswordFormate);

        if (checkUserFullNameValid == null) {
            return checkUserFullName();
        } else if (userSurname === "") {
            return checkUserSurname();
        } else if (checkUserEmailValid == null) {
            return checkUserEmail();
        } else {
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
                var user = firebase.auth().currentUser;
                var uid;
                if (user != null) {
                    uid = user.uid;
                }
                var firebaseRef = firebase.database().ref();
                var userData = {
                    nombre: userFullName,
                    apellido: userSurname,
                    email: userEmail,
                    telefono: userTel,
                    institucion: userInstitucion,
                    puesto: userPuesto
                }
                firebaseRef.child("usuarios").child(uid).set(userData);

                setCookie("user", userEmail, 30)
                setCookie("pass", userPassword, 30)

                Swal.fire('Cuenta Creada', '¡Tu cuenta ha sido creada exitosamente!', ).then((value) => {
                    setTimeout(function () {
                        window.location.replace("https://mabadinakach.github.io/Concept-Pharmacy/index.html");
                    }, 1000)
                });
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: "Ya existe una cuenta con este correo",
                })
            });
        }
    }
    // xxxxxxxxxx Working For Sign In Form xxxxxxxxxx
    // xxxxxxxxxx Sign In Email Validation xxxxxxxxxx
    function checkUserSIEmail() {
        var userSIEmail = document.getElementById("userSIEmail");
        var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var flag;
        if (userSIEmail.value.match(userSIEmailFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userSIEmailError").style.display = "block";
        } else {
            document.getElementById("userSIEmailError").style.display = "none";
        }
    }
    // xxxxxxxxxx Sign In Password Validation xxxxxxxxxx
    function checkUserSIPassword() {
        var userSIPassword = document.getElementById("userSIPassword");
        var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;
        var flag;
        if (userSIPassword.value.match(userSIPasswordFormate)) {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            document.getElementById("userSIPasswordError").style.display = "block";
        } else {
            document.getElementById("userSIPasswordError").style.display = "none";
        }
    }
    // xxxxxxxxxx Get data from server and show in the page xxxxxxxxxx
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //   User is signed in.
            let user = firebase.auth().currentUser;
            let uid
            if (user != null) {
                uid = user.uid;
            }
            let firebaseRefKey = firebase.database().ref().child(uid);
            firebaseRefKey.on('value', (dataSnapShot) => {
                document.getElementById("userPfFullName").innerHTML = dataSnapShot.val().userFullName;
                document.getElementById("userPfSurname").innerHTML = dataSnapShot.val().userSurname;
                // userEmail = dataSnapShot.val().userEmail;
                // userPassword = dataSnapShot.val().userPassword;
                document.getElementById("userPfFb").setAttribute('href', dataSnapShot.val().userFb);
                document.getElementById("userPfTw").setAttribute('href', dataSnapShot.val().userTw);
                document.getElementById("userPfGp").setAttribute('href', dataSnapShot.val().userGp);
                document.getElementById("userPfBio").innerHTML = dataSnapShot.val().userBio;
            })
        } else {
            //   No user is signed in.
        }
    });
    // xxxxxxxxxx Working For Sign Out xxxxxxxxxx
} else if(sPage == "admin.html") {
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
        keyboard: false,
        backdrop: 'static'
      })

      myModal.show()

    var myOffcanvas = document.getElementById('offcanvasWithBackdrop')


    var table = document.getElementById("myTable")

    function getData() {
        var count = 0
        firebase.database().ref('usuarios').once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                
                count += 1
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();

                
                var tr = document.createElement('tr')
                var th = document.createElement('th')
                th.scope = "row"
                th.innerHTML = count
                var td1 = document.createElement('td')
                td1.innerHTML = childData["nombre"] + " " + childData["apellido"]
                var td2 = document.createElement('td')
                var emailTd = document.createElement('a')
                emailTd.innerHTML = childData["email"]
                emailTd.href = "mailto:"+childData["email"]
                td2.append(emailTd) 
                var td3 = document.createElement('td')
                var telTd = document.createElement('a')
                telTd.innerHTML = childData["telefono"]
                telTd.href = "tel:"+childData["telefono"]
                td3.append(telTd) 
                var td4 = document.createElement('td')
                td4.innerHTML = childData["institucion"]
                var td5 = document.createElement('td')
                td5.innerHTML = childData["puesto"]
                
                tr.append(th)
                tr.append(td1)
                tr.append(td2)
                tr.append(td3)
                tr.append(td4)
                tr.append(td5)
                
                table.append(tr)
            });
        });
    }

    function signInAdmin() {
        var adminEmail = document.getElementById("adminEmail").value;
        var adminPass = document.getElementById("adminPass").value;

        if (adminEmail == "admin" && adminPass == "admin123456") {
            Swal.fire({
                type: 'successfull',
                title: '¡Bienvenido Admin!',
            }).then((value) => {
                setTimeout(function () {
                    myModal.hide()
                    // var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
                    // bsOffcanvas.show()
                    getData()
                }, 1000)
            });
        } else {
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: "Correo o Contraseña incorrectas",
            })
        }


    }
} else if (sPage == "catalogo.html") {
    var main = document.getElementById("main-catalogo")

    var accordion = document.createElement('div')
    accordion.className = "accordion accordion-flush"
    accordion.id = "accordionInfo"
    accordion.style.bg = "Red"

    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    function createAccordion(title, text, imagen, logo, imagenUso,  id) {
        var accordionItem = document.createElement('div')
        accordionItem.className = "accordion-item"

        // HEADER
        var header = document.createElement('h2')
        header.className = "accordion-header"
        header.id = "flush-heading" + id
        var headerButton = document.createElement('button')
        headerButton.className = "accordion-button collapsed"
        headerButton.type = "button"
        headerButton.setAttribute("data-bs-toggle", "collapse")
        headerButton.setAttribute("data-bs-target", "#flush-collapse" + id)
        headerButton.setAttribute("aria-expanded", "false")
        headerButton.setAttribute("aria-controls", "flush-collapse" + id)
        var buttonText = document.createElement("h4")
        buttonText.className = "h4 text-center text-dark mb-3"
        buttonText.innerHTML = title
        headerButton.append(buttonText)

        header.append(headerButton)

        // CONTENT
        var content = document.createElement('div')
        content.className = "accordion-collapse collapse"
        content.id = "flush-collapse" + id
        content.setAttribute("aria-labelledby", "flush-heading" + id)
        content.setAttribute("data-bs-parent", "#accordionInfo")

        var img = document.createElement('img')
        img.src = imagen
        var pImg = document.createElement('p')
        pImg.className = "text-center"
        pImg.append(img)

        content.append(pImg)

        for (var i = 0; i < text.length; i++) {
            if (text[i].includes("TITULO: ")) {
                text[i] = text[i].replace("TITULO: ", "")
                var contentText = document.createElement('div')
                contentText.className = "accordion-body"
                //contentText.innerHTML = text[i]
                var _text = document.createElement('h4')
                _text.innerHTML = text[i]
                contentText.append(_text)
            } else {

                var contentText = document.createElement('div')
                contentText.className = "accordion-body"

                if (isValidHttpUrl(text[i])) {
                    var a = document.createElement('a')
                    a.href = text[i]
                    a.innerHTML = text[i]
                    contentText.append(a)
                } else {
                    contentText.innerHTML = text[i]
                }
            }


            content.append(contentText)
        }

        var logoImg = document.createElement('img')
        logoImg.src = logo
        var pLogoImg = document.createElement('p')
        pLogoImg.className = "text-center"
        pLogoImg.append(logoImg)

        var usoImg = document.createElement('img')
        usoImg.src = imagenUso
        var pUsoImg = document.createElement('p')
        pUsoImg.className = "text-center"
        pUsoImg.append(usoImg)

        content.append(pLogoImg)
        content.append(pUsoImg)


        // APPEND VALUES
        accordionItem.append(header)
        accordionItem.append(content)
        

        accordion.append(accordionItem)
    }



    firebase.database().ref('catalogo').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            if (childData["tipo"] == "acordion") {
                createAccordion(childData["titulo"], childData["texto"], childData["imagen"], childData["marcaImagen"], childData["usoImagen"], childKey.toString())
            } else if (childData["tipo"] == "imagen") {
                
                var img = document.createElement('img')
                img.src = childData["imagen"]
                var pImg = document.createElement('p')
                pImg.className = "text-center"
                pImg.append(img)
                accordion.append(pImg)

            } else if (childData["tipo"] == "video") {
                var br = document.createElement('br')

                var _text = document.createElement('h4')
                _text.innerHTML = childData["titulo"]
                
                var iFrame = document.createElement('iframe')
                iFrame.src = childData["video"]
                iFrame.width = "300"
                iFrame.height = "315"
                var pFrame = document.createElement('p')
                pFrame.className = "text-center"
                pFrame.append(iFrame)

                accordion.append(br)
                accordion.append(_text)
                accordion.append(pFrame)
            }
            
        });
    });

    main.append(accordion)
    main.append(document.createElement('br'))
    main.append(document.createElement('br'))
}