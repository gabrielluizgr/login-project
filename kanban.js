import firebaseConfig from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; 
    }
});

window.logout = async function() {
    await signOut(auth);
}

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
            doingColumn.appendChild(card); 
        } else {
            doneColumn.appendChild(card);
        }
    });
});

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