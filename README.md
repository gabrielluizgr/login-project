🔐 Login System with Firebase
Projeto de tela de login moderna e funcional, integrada ao ecossistema Firebase para gerenciamento de usuários.

🛠️ Tecnologias Utilizadas
Front-end: HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+).

Back-end: Firebase Authentication.

Hosting: Firebase Hosting.

✨ Funcionalidades
[x] Cadastro de novos usuários.

[x] Login com e-mail e senha.

[x] Persistência de sessão (o usuário não precisa logar toda hora).

[x] Design responsivo para dispositivos móveis.

## 🚀 Como configurar o Firebase

Para rodar este projeto localmente, você precisará:

1. Criar um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ativar o [Firestore/Realtime Database].
3. Criar um arquivo chamado `config.js` na raiz do projeto.
4. Copiar suas credenciais do Firebase e colar no `config.js` seguindo o modelo abaixo:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  // ... outras configs
};
export default firebaseConfig;