import { Question } from "./question";
import { isValid, createModal } from "./utils";
import { getAuthForm, authWithEmailAndPassword } from "./auth";
import "./style.css";


/* Elemnts */

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

/* Listeners */

window.addEventListener('load', Question.renderList);

form.addEventListener('submit', submitFormHandler);

input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value);
});

modalBtn.addEventListener('click', openModal);

/* ========================================================= */

function submitFormHandler(event) {
    event.preventDefault();

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true;
        // Async request to server to save question

        createQuestion(question);
    }
}

/* ****************************Async request to server to save question********************************* */

async function createQuestion(data) {
    let response = await Question.create(data);

    console.log("Ok");
    input.value = '';
    input.className = '';
    submitBtn.disabled = false;
}

/* -----------------------Open Modal----------------------------- */

function openModal() {
    createModal('Авторизация', getAuthForm());
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true });
}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;

    authWithEmailAndPassword(email, password)
        .then(token => Question.fetch(token))
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    console.log(content);
    if (typeof content === 'string') {
        createModal('Ошибка!', content);
    } else {
        createModal('Список вопросов', Question.listToHTML(content));
    }
}
