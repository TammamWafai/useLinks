
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function buildLinksTable(linksTable, linksTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/links", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        var children = [linksTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                linksTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.links.length; i++) {
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.links[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.links[i]._id}>delete</button></td>`;
                    let rowHTML = `<td>${data.links[i].platform}</td><td>${data.links[i].url}</td> ${editButton}${deleteButton}`;
                    // <td>${data.links[i].status}</td>
                    let rowEntry = document.createElement("tr");
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                linksTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (err) {
        message.textContent = "A communication error occurred.";
        return 0;
    }
}

//section 1
document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const username = document.getElementById("username");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const links = document.getElementById("links");
    const linksTable = document.getElementById("links-table");
    const linksTableHeader = document.getElementById("links-table-header");
    const addLink = document.getElementById("add-link");
    const editLink = document.getElementById("edit-link");
    const platform = document.getElementById("platform");
    const url = document.getElementById("url");
    // const status = document.getElementById("status");
    const addingLink = document.getElementById("adding-link");
    const linksMessage = document.getElementById("links-message");
    const editCancel = document.getElementById("edit-cancel");

    const titleH1 = document.getElementById("titleH1")
    // section 2 
    let showing = logonRegister;
    let token = null;
    document.addEventListener("startDisplay", async () => {
        showing = logonRegister;
        token = localStorage.getItem("token");
        if (token) {
            data = parseJwt(token)
            console.log(data)
            titleH1.innerHTML = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} Links`;
            //if the user is logged in
            logoff.style.display = "block";
            const count = await buildLinksTable(
                linksTable,
                linksTableHeader,
                token,
                message
            );
            if (count > 0) {
                linksMessage.textContent = "";
                linksTable.style.display = "block";
            } else {
                linksMessage.textContent = "There are no links to display for this user.";
                linksTable.style.display = "none";
            }
            links.style.display = "block";
            showing = links;


        } else {
            logonRegister.style.display = "block";
        }
    });

    var thisEvent = new Event("startDisplay");
    document.dispatchEvent(thisEvent);
    var suspendInput = false;

    document.addEventListener("click", async (e) => {
        if (suspendInput) {
            return; // we don't want to act on buttons while doing async operations
        }
        if (e.target.nodeName === "BUTTON") {
            message.textContent = "";
        }
        if (e.target === logoff) {
            localStorage.removeItem("token");
            titleH1.innerHTML = "Logged off"
            token = null;
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            linksTable.replaceChildren(linksTableHeader); // don't want other users to see
            message.textContent = "You are logged off.";
        } else if (e.target === logon) {
            showing.style.display = "none";
            logonDiv.style.display = "block";
            showing = logonDiv;
        } else if (e.target === register) {
            showing.style.display = "none";
            registerDiv.style.display = "block";
            showing = registerDiv;
        } else if (e.target === logonCancel || e.target == registerCancel) {
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            email.value = "";
            password.value = "";
            name.value = "";
            username.value = ""
            email1.value = "";
            password1.value = "";
            password2.value = "";
        } else if (e.target === logonButton) {
            suspendInput = true;
            try {
                const response = await fetch("/api/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value,
                    }),
                });
                const data = await response.json();
                if (response.status === 200) {
                    message.textContent = `Logon successful.  Welcome ${data.user.name}`;
                    titleH1.innerHTML = `${data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1)} Links`
                    token = data.token;
                    localStorage.setItem("token", token);
                    console.log(localStorage)
                    showing.style.display = "none";
                    thisEvent = new Event("startDisplay");
                    email.value = "";
                    password.value = "";
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = data.msg;
                }
            } catch (err) {
                message.textContent = "A communications error occurred.";
            }
            suspendInput = false;
        } else if (e.target === registerButton) {
            if (password1.value != password2.value) {
                message.textContent = "The passwords entered do not match.";
            } else {
                suspendInput = true;
                try {
                    const response = await fetch("/api/v1/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name.value,
                            username: username.value,
                            email: email1.value,
                            password: password1.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = `Registration successful.  Welcome ${data.user.name}`;
                        token = data.token;
                        localStorage.setItem("token", token);
                        showing.style.display = "none";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                        name.value = "";
                        username.value = "";
                        email1.value = "";
                        password1.value = "";
                        password2.value = "";
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communications error occurred.";
                }
                suspendInput = false;
            }
        } // section 4
        else if (e.target === addLink) {
            showing.style.display = "none";
            editLink.style.display = "block";
            showing = editLink;
            delete editLink.dataset.id;
            platform.value = "";
            url.value = "";
            status.value = "pending";
            addingLink.textContent = "add";
        } else if (e.target === editCancel) {
            showing.style.display = "none";
            platform.value = "";
            url.value = "";
            status.value = "pending";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
        } else if (e.target === addingLink) {

            if (!editLink.dataset.id) {
                // this is an attempted add
                suspendInput = true;
                try {
                    const response = await fetch("/api/v1/links", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            platform: platform.value,
                            url: url.value,
                            // status: status.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        //successful create
                        message.textContent = "The link entry was created.";
                        showing.style.display = "none";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                        platform.value = "";
                        url.value = "";
                        // status.value = "pending";
                    } else {
                        // failure
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communication error occurred.";
                }
                suspendInput = false;
            } else {
                // this is an update
                suspendInput = true;
                try {
                    const linkID = editLink.dataset.id;
                    const response = await fetch(`/api/v1/links/${linkID}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            platform: platform.value,
                            url: url.value,
                            // status: status.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = "The entry was updated.";
                        showing.style.display = "none";
                        platform.value = "";
                        url.value = "";
                        // status.value = "pending";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {

                    message.textContent = "A communication error occurred.";
                }
            }
            suspendInput = false;
        } // section 5
        else if (e.target.classList.contains("editButton")) {
            editLink.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/links/${e.target.dataset.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    platform.value = data.link.platform;
                    url.value = data.link.url;
                    // status.value = data.link.status;
                    showing.style.display = "none";
                    showing = editLink;
                    showing.style.display = "block";
                    addingLink.textContent = "update";
                    message.textContent = "";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The links entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
        else if (e.target.classList.contains("deleteButton")) {
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/links/${e.target.dataset.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {

                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                    message.textContent = "The link entry was deleted.";
                    showing.style.display = "none";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The links entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
    })
});
