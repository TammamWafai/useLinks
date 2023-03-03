
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function buildLinksTable(linksTable, linksTableHeader, message) {
    try {
        const response = await fetch("/k/tammamWafai", {
            method: "GET"

        });
        const data = await response.json();
        var children = [linksTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                linksTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.links.length; i++) {

                    let rowHTML = `<td>${data.links[i].platform}</td><td><a href="https://${data.links[i].url}">${data.links[i].url}</a></td> `;
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
    // const logoff = document.getElementById("logoff");
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
    document.addEventListener("startDisplay", async () => {
        showing = logonRegister;
        if (1) {
            // data = parseJwt(token)
            // console.log(data)
            // titleH1.innerHTML = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} Links`;
            //if the user is logged in
            // logoff.style.display = "block";
            const count = await buildLinksTable(
                linksTable,
                linksTableHeader,
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


});
