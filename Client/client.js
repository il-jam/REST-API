/*
document.addEventListener("DOMContentLoaded", function(event){
    const userInput = document.getElementById("userFilter");
    userInput.addEventListener("click", () => {
        if (userInput.value){
            outputTasksOfUser();
        } else {
            notFound();
        }
    });
})
*/

function getData(){
    return {
        user: document.getElementById("user").value,
        description: document.getElementById("description").value,
        duration: document.getElementById("duration").value,
        date: document.getElementById("date").value
    }
}

async function postTask(){
    const post = await fetch('http://localhost:3000/exercise', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(getData())
    });
}

class Task extends HTMLElement{
    constructor(){
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        var template = `
            
        <div class="column">
            <div class="card">
                
                <div class="card-content">

                    <div class="name-output">
                        <p class="has-text-weight-bold is-uppercase"><slot name='user'><USER</slot></p>
                    </div>

                    <p class="content"><slot name='description'>DESCRIPTION</slot></p>
                    <p ><slot name='duration'>DURATION</slot><slot name='date'>DATE</slot></p>

                </div>
            </div>

        </div>
            
        `;
        this.shadowRoot.innerHTML = template

        const bulmaLink = document.createElement("link");
        bulmaLink.setAttribute("rel", "stylesheet");
        bulmaLink.setAttribute("href","https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css");

        shadow.appendChild(bulmaLink);
    }
}

window.customElements.define('task-out', Task);

function addTask(user, description, duration, date){
    const parentNode = document.getElementById("output");
    const customElement = `
        <task-out>
            
                        <span slot="user">${user}</span>
                        <span slot="description">${description}</span>
                        <span slot="duration">${duration} Min, am </span>
                        <span slot="date">${date}</span>

        </task-out>`;
    parentNode.insertAdjacentHTML("beforeend", customElement);
}

function notFound(){
    const parentNode = document.getElementById("output");
    const customElement = `
        <div class="not-found">
            <h3>Keine Einträge</h3>
        </div>
    `;
    resetOutput();
    parentNode.insertAdjacentHTML("beforeend", customElement);
}

function resetOutput(){
    document.getElementById("output").innerHTML = "";
}



async function outputTasksOfUser(){
    const user = document.getElementById("userFilter").value;
    const url = 'http://localhost:3000/exercise' + '?user=' + user;
    const rawData = await fetch(url);
    rawData.json().then(data =>{
        if (data.docs.length == 0){
            notFound();
        } else {
            
            resetOutput();
            console.log("HIER PASSIERT ES");
            data.docs.forEach(element => {
                addTask(element.user, element.description, element.duration, element.date);
            });
        }
    })
    }
    



