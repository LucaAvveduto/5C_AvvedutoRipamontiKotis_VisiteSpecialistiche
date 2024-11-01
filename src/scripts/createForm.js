import { parseConfiguration } from "./jsonParser.js";

export function createForm(parentElement) {
    let data = [];
    let callback = null;
    return {
        setLabels: (labels) => { data = labels;},  
        onsubmit: (callbackInput) => { callback = callbackInput},
        render: () => {
            let types = ["date","number","text"];
            let html = "<div class='modal-body'>";
            const opt = generateOptions().then((op) => { 
            html += data.map((name,index) => { 
                return types[index] === "number" ? 
                `<select class="form-select" id='` + name + `' aria-label="Default select example">
                    <option selected>Orario</option>`
                   + op + "</select>" :
                    "<div class='label'>" + name + "<input type='" + types[index] +"' class='form-control' id='" + name + "'/></div>";
            }).join('\n') + "</div>";
            html += 
                `<div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="cancel" data-bs-dismiss="modal">Cancel</button>
                    <button id='submit' class='btn btn-success'>Submit</button>
                </div>`
            ;
            parentElement.innerHTML = html;
            document.querySelector("#submit").onclick = () => {
                const result = data.map((name) => {
                    return document.querySelector("#" + name).value;
                });
                data.forEach((val) => {
                    const node = document.getElementById(val);
                    if(node.tagName === "SELECT") {
                        const def = document.querySelector("#" + val +" option[selected]");
                        node.value = def.value; 
                    } 
                    else node.value = "";
                });
                callback(result);
            }
        }).catch(console.error)
        },
    };
};

function getJson() {
    return new Promise((resolve, reject) => {
        return parseConfiguration("../../config.json").then((parsedConfig) => {resolve(parsedConfig)}).catch(reject);
    })
}

function generateOptions() {
    let firstItem;
    let lastItem;
    return new Promise((resolve, reject) => {
        getJson().then((json) => {
            firstItem = json.hours[0];
            lastItem = json.hours[json.hours.length - 1];
            let result = "";
            const template = "<option value='%val'>%val</option>"
            for (let i = firstItem; i <= lastItem; i++) {
                result += template.replaceAll("%val", i);
            }
            resolve(result);
        }).catch(reject);
    })
}