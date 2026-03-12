// 1. IMPORTANDO AS FERRAMENTAS DO GOOGLE (VERSÃO WEB/URL)
import firebaseConfig from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// 3. INICIANDO O SISTEMA
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----------------------------------------------------------
// LÓGICA DO CADASTRO 
// ----------------------------------------------------------
// Verifica se estamos na página de cadastro procurando pelo campo de confirmação
if (document.getElementById("confirm-password")) { 
    
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const errorText = document.getElementById("message-error");
    const signUpForm = document.querySelector("form");

    signUpForm.addEventListener("submit", async function(event){
        event.preventDefault();
        
        // Limpa erros anteriores
        errorText.style.display = "none";
        confirmPasswordInput.classList.remove("input-error");

        // Validação local (Senhas iguais)
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorText.textContent = "Password and confirmation do not match.";
            errorText.style.display = "block";
            confirmPasswordInput.classList.add("input-error");
            return; 
        }

        // Se passou, tenta criar no Google
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            // Se der certo:
            alert("Account created successfully!");
            window.location.href = "index.html"; 
        } catch (error) {
            // Se der erro
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

// ----------------------------------------------------------
// LÓGICA DO LOGIN
// ----------------------------------------------------------
// Só roda se NÃO tiver confirmação de senha (ou seja, tela de login)
if (!document.getElementById("confirm-password") && document.querySelector("form")) {
    
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            
            // SUCESSO!
            // Se der certo:
                window.location.href = "dashboard.html"; // Agora mandamos ele pro dashboard!       
            // Aqui seria o redirecionamento para o dashboard
        } catch (error) {
            alert("Login failed: Verify your email and password.");
            console.error(error.code, error.message);
        }
    });
}

// ----------------------------------------------------------
// LÓGICA DO OLHINHO
// ----------------------------------------------------------
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

// ----------------------------------------------------------
// LÓGICA DO DASHBOARD (Área VIP)
// ----------------------------------------------------------

// O "onAuthStateChanged" é um vigilante. Ele roda toda vez que a página carrega
// para ver se tem um usuário logado no navegador.
onAuthStateChanged(auth, (user) => {
    
    // 1. Lógica de PROTEÇÃO DA ROTA
    // Se estou no dashboard MAS não tem usuário logado...
    if (window.location.pathname.includes("dashboard.html") && !user) {
        window.location.href = "index.html"; // Chuta pro login
    }

    // 2. Lógica de EXIBIÇÃO
    // Se estou no dashboard E tem usuário...
    if (window.location.pathname.includes("dashboard.html") && user) {
        const emailSpan = document.getElementById("user-email");
        emailSpan.textContent = user.email; // Mostra o e-mail na tela
    }
});

// 3. Lógica do BOTÃO SAIR (Logout)
const logoutBtn = document.getElementById("logout-button");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html"; // Volta pro login
    });
}

//4. Lógica do BOTÃO GO TO KANBAN
const kanbanBtn = document.getElementById("kanban-button");

if (kanbanBtn) {
    kanbanBtn.addEventListener("click", () => {
        window.location.href = "kanban.html"; // Redireciona para o Kanban
    });
}