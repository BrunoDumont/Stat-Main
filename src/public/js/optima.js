//initial optima domain
const host = 'http://localhost:8000';

const id = getParameterByName('id');
const utm = getParameterByName('utm_content');
let storage_id = getParameterByName('storage_id');
const landing_id = getParameterByName('landing_id');
const isLanding = getParameterByName('isLanding');
/*
    if use landing with redirect you should init function flow to make A/B test
*/

function flow(){
    const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xhr = new XHR();
    xhr.open("POST", host + "/api/v1/flow", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
        const answer = JSON.parse(xhr.responseText);
        window.open(answer['landing_url'],"_self")
    };
    xhr.send(JSON.stringify({
        'id':  id,
        'utm_content': utm
    }));
}

function landing(props){
    if(isLanding === 'true'){
        workWithLanding(props)
    }else{
        workWithPrelanding()
    }
}

function workWithLanding(props){
    const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xhr = new XHR();
    xhr.open("POST", host + "/api/v1/landing", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({id, storage_id, landing_id}));

    xhr.onload = function () {
        const answer = JSON.parse(xhr.responseText);
        if(answer.storage_id){
            storage_id = answer.storage_id
        }
    };

    const btn = document.querySelector('#submit, .submit')
    btn.addEventListener('click', function (){
        let name = getInputValue('name')
        const birth = getInputValue('birth')
        const phone = getInputValue('phone')
        const comment = getInputValue('comment')
        let isSend = true
        if(props.validate){
            const validationObj = { name, birth, phone, comment }
            isSend = test(props.validate, validationObj)
        }
        if(isSend){
            const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            const xhr = new XHR();
            xhr.open("POST", host + "/api/v1/landingLead", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                const answer = JSON.parse(xhr.responseText);
                if(answer['success'] && props['thanksUrl']){
                    window.open(props['thanksUrl'],"_self")
                }
            };
            xhr.send(JSON.stringify({
                id,
                storage_id,
                name,
                birth,
                phone,
                comment
            }));
        }
    })
}

function workWithPrelanding() {
    const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xhr = new XHR();
    const button = document.querySelector('#submit, .submit')
    xhr.open("POST", host + "/api/v1/prelanding", true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function () {
        const answer = JSON.parse(xhr.responseText);
        if(button){
            button.addEventListener('click', function (){
                window.open(answer['landing_url'],"_self")
            })
        }
    };

    xhr.send(JSON.stringify({
        id,
        storage_id,
        landing_id
    }));
}

function getInputValue(selector){
    let elem$ = document.querySelector(`#${selector}, .${selector}, input[name=${selector}]`)
    let result = null
    if(elem$) result = elem$.value
    return result
}

function test(validate, validationObj){
    if (Array.isArray(validate)){
        for(let i = 0; i < validate.length; i++){
            const value = validationObj[validate[i]]
            if(!value || value.trim() === ''){
               return false
            }
        }
    }
    return true
}

function getParameterByName(value) {
    const name = value.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}