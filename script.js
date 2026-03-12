import firebaseConfig from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (document.getElementById("confirm-password")) { 
    
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const errorText = document.getElementById("message-error");
    const signUpForm = document.querySelector("form");

    signUpForm.addEventListener("submit", async function(event){
        event.preventDefault();
        
        errorText.style.display = "none";
        confirmPasswordInput.classList.remove("input-error");

        if (passwordInput.value !== confirmPasswordInput.value) {
            errorText.textContent = "Password and confirmation do not match.";
            errorText.style.display = "block";
            confirmPasswordInput.classList.add("input-error");
            return; 
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            alert("Account created successfully!");
            window.location.href = "index.html"; 
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            errorText.style.display = "block";
            
            if(errorCode === 'auth/email-already-in-use') {
                errorText.textContent = "E-mail already exists.";
            } else if (errorCode === 'auth/weak-password') {
                errorText.textContent = "Password is too weak. It must be at least 6 characters.";
            } else {
                errorText.textContent = errorMessage;
            }
        }
    });
}
if (!document.getElementById("confirm-password") && document.querySelector("form")) {
    
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            
                window.location.href = "dashboard.html";     
        } catch (error) {
            alert("Login failed: Verify your email and password.");
            console.error(error.code, error.message);
        }
    });
}

const togglePassword = document.getElementById("togglePassword");
if(togglePassword) {
    const passwordField = document.getElementById("password");
    
    togglePassword.addEventListener("click", function() {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
if(toggleConfirmPassword) {
    const passwordField = document.getElementById("confirm-password");
    
    toggleConfirmPassword.addEventListener("click", function() {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}

onAuthStateChanged(auth, (user) => {
    
    if (window.location.pathname.includes("dashboard.html") && !user) {
        window.location.href = "index.html"; 
    }

    if (window.location.pathname.includes("dashboard.html") && user) {
        const emailSpan = document.getElementById("user-email");
        emailSpan.textContent = user.email; 
    }
});

const logoutBtn = document.getElementById("logout-button");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html"; 
    });
}


const kanbanBtn = document.getElementById("kanban-button");

if (kanbanBtn) {
    kanbanBtn.addEventListener("click", () => {
        window.location.href = "kanban.html"; 
    });
}