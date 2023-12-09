let order = document.querySelector(".order")
let btn = document.querySelector(".btn")
let list = document.querySelector(".list")
let clear = document.querySelector("button")
let numbers = document.querySelector(".counter")
let alert = document.querySelector(".alert")
let counter = document.querySelector(".count")
let yes = document.querySelector(".yes")
let no = document.querySelector(".no")
let items = []


let editElement;
let editFlag = false;
let editID = "";


let countertrue = 0;
let counterfalse = items.length - countertrue;
if (localStorage.getItem("numt")) {
    countertrue = parseInt(localStorage.getItem("numt"));
}
if (localStorage.getItem("numf")) {
    counterfalse = parseInt(localStorage.getItem("numf"));
}

if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
}
getfromlocal()


btn.onclick = function (e) {
    e.preventDefault();
    if (order.value !== "") {
        alertNotification("add a task", "add")
        addOrder(order.value);
        order.value = "";
        count()
    } else {
        alertNotification("please add a task", "remove")
    }
};

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("del")) {
        if (e.target.parentElement.parentElement.classList.contains("done")) {
            --countertrue;
        }
        removeFromlocal(e.target.parentElement.parentElement.getAttribute("data-id"))
        console.log(e.target.parentElement.parentElement)
        e.target.parentElement.parentElement.remove()// delete from the page
        count()
        statusDone(e.target.parentElement.parentElement.getAttribute("data-id"))
        alertNotification("remove a task", "remove")
    }
    if (e.target.classList.contains("item")) {
        statusDone(e.target.getAttribute("data-id"));
        e.target.classList.toggle("done");
        // Update and store countertrue

        countertrue = items.filter((item) => item.stats).length;
        yes.innerHTML = countertrue;
        no.innerHTML = items.length - countertrue;

        localStorage.setItem("numt", JSON.stringify(countertrue));
        localStorage.setItem("numf", JSON.stringify(items.length - countertrue));
    }

});// have the item back if you reload the page


function addOrder(text) {
    let item = {
        id: Date.now(),
        content: text,
        stats: false,
    }
    items.push(item)
    toPage(items)
    addtolocal(items)// localStorage.setItem("nums", JSON.stringify(items.length));
}


function getItemById(itemId) {
    return items.find((item) => item.id == itemId);
}

function updateItem(itemId, newContent) {
    let index = items.findIndex((item) => item.id == itemId);
    if (index !== -1) {
        items[index].content = newContent;
        addtolocal(items);
    }
}
function toPage(items) {
    list.innerHTML = "";
    items.forEach((i) => {
        yes.innerHTML = countertrue;
        no.innerHTML = items.length - countertrue;
        count()
        let div = document.createElement("div")
        let p = document.createElement("p")
        let actions = document.createElement("p")
        let edite = document.createElement("i")
        let delet = document.createElement("i")
        div.setAttribute("data-id", i.id)
        p.setAttribute("data-id", i.id)
        div.className = "item"
        if (i.stats) { div.className = "item done" }
        p.appendChild(document.createTextNode(i.content))
        delet.className = "fas fa-trash del"
        edite.className = "fas fa-edit edit"
        edite.setAttribute("data-id", i.id); // Add data-id attribute for identification
        edite.addEventListener("click", function () {
            if (i.content) {
                order.value = i.content
                order.focus()
                btn.onclick = function () {
                    i.content = order.value
                    addtolocal(items)
                }
            }
        })
        div.appendChild(p)
        actions.appendChild(edite)
        actions.appendChild(delet)
        div.appendChild(actions)
        list.appendChild(div)

    });
}


// let edit = document.querySelector(".edit")


function addtolocal(i) {
    window.localStorage.setItem("items", JSON.stringify(i))
}

function getfromlocal() { // have the item back if you reload the page
    let data = window.localStorage.getItem("items")
    if (data) {
        let tasks = JSON.parse(data)
        toPage(tasks) // if you remove this the items will appear after you add new item after reloading only
    }
}
function removeFromlocal(itemId) {
    items = items.filter((i) => (i.id != itemId)); // this will make loop for all id and will turn the different onces
    addtolocal(items)
}


function alertNotification(text, action) {
    alert.textContent = text;
    alert.classList.add(`${action}`)

    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`${action}`)
    }, 1000)
}

// for (let i = 0; i > items.length; i++) {

// }
function count() {
    if (items.length >= 0) {
        counter.innerHTML = items.length
    }
}


clear.addEventListener("click", function () {
    if (items.length > 0) {
        localStorage.removeItem("numt");
        localStorage.removeItem("numf");
        yes.innerHTML = 0;
        no.innerHTML = 0;
        localStorage.removeItem("items")
        list.innerHTML = "";
        items.length = 0;
        count()
        alertNotification("all tasks removed", "remove")
    }
})


function statusDone(itemId) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id == itemId) {
            if (items[i].stats == false) {
                items[i].stats = true
            } else {
                items[i].stats = false
            }
        }
    }
    toPage(items)
    addtolocal(items)
}