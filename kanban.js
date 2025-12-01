// 1. IMPORTS COM AUTH E FIRESTORE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK94nq3W55nW0UV8Z2e7arSOzNRPQ1mdc",
  authDomain: "login-project-7dcfc.firebaseapp.com",
  projectId: "login-project-7dcfc",
  storageBucket: "login-project-7dcfc.firebasestorage.app",
  messagingSenderId: "947459225980",
  appId: "1:947459225980:web:524de4e93cac8d03280cf9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // INICIA O AUTH

// --- SEGURANÇA (VIGILANTE) ---
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; // Chuta pra fora se não tiver logado
    }
});

// FUNÇÃO DE LOGOUT (Para o botão Sair funcionar)
window.logout = async function() {
    await signOut(auth);
}

// --- LÓGICA DO KANBAN ---

// 1. Adicionar tarefa
const form = document.getElementById("form-add");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("input-new-task").value;
    
    if (text.trim() === "") return;

    try {
        await addDoc(collection(db, "kanban"),{
            title: text,
            status: "todo",
            date: new Date()
        });
        document.getElementById("input-new-task").value = "";
    } catch (error) {
        console.error("Error", error);
    }
});

// 2. Listar tarefas
onSnapshot(collection(db, "kanban"), (snapshot) =>{
    const todoColumn = document.getElementById("column-todo");
    const doingColumn = document.getElementById("column-doing");
    const doneColumn = document.getElementById("column-done");

    todoColumn.innerHTML = "";
    doingColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    snapshot.forEach((document) =>{
        const task = document.data();
        const id = document.id;

        const card = createCardHTML(id, task.title, task.status);

        if (task.status === "todo") {
            todoColumn.appendChild(card);
        } else if (task.status === "doing") {
            // CORREÇÃO: Mudei de 'colDoing' para 'doingColumn'
            doingColumn.appendChild(card); 
        } else {
            doneColumn.appendChild(card);
        }
    });
});

// 3. Função para gerar o HTML do card
function createCardHTML(id, title, status) {
    const div = document.createElement("div");
    div.classList.add("task-card");

    let buttonsHTML = "";

    if (status === "todo") {
        buttonsHTML = `<i class="fa-solid fa-arrow-right" style="color: #ffc107;" onclick="moveTask('${id}', 'doing')"></i>`;
    }
    else if (status === "doing") {
        buttonsHTML = `<i class="fa-solid fa-arrow-left" style="color: #dc3545;" onclick="moveTask('${id}', 'todo')"></i>
                       <i class="fa-solid fa-arrow-right" style="color: #28a745;" onclick="moveTask('${id}', 'done')"></i>`; // Mudei cor pra verde
    }
    else {
        // CORREÇÃO: Traduzi 'moverTarefa' -> 'moveTask' e 'deletarTarefa' -> 'deleteTask'
        buttonsHTML = `
            <i class="fa-solid fa-arrow-left" style="color: #ffc107;" onclick="moveTask('${id}', 'doing')"></i>
            <i class="fa-solid fa-trash" style="color: #dc3545;" onclick="deleteTask('${id}')"></i>`;
    }
    
    div.innerHTML = `
        <strong>${title}</strong>
        <div class="actions">
        ${buttonsHTML}
        </div>
    `;
    return div;
}

// 4. Funções globais
window.moveTask = async function(id, newStatus) {
    const taskRef = doc(db, "kanban", id);
    await updateDoc(taskRef, {
        status: newStatus
    });
}

window.deleteTask = async function(id) {
    if(confirm("Are you sure you want to delete this task?")) {
        await deleteDoc(doc(db, "kanban", id));
    };
}