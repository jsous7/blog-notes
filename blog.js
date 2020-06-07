$( document ).ready(function() {
    loadPosts();

    const form = document.getElementById("form");
    form.addEventListener("submit", ev => {
        ev.preventDefault();
        tinyMCE.triggerSave();
        createPost();
        tinymce.activeEditor.setContent('');
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
    });
});

tinymce.init({
    selector: 'textarea',
    plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker link code',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
    toolbar: 'insertfile image link | code',
    tinycomments_mode: 'embedded',
    forced_root_block : false,
});

function loadPosts(){
    findAll().then(serverResponse =>{
        let amount = serverResponse.getElementsByTagName("id").length;
        for (i=amount-1; i > 0; i--) {
            var id = serverResponse.getElementsByTagName("id")[i].childNodes[0].nodeValue;
            var title = serverResponse.getElementsByTagName("title")[i].childNodes[0].nodeValue;
            var author = serverResponse.getElementsByTagName("author")[i].childNodes[0].nodeValue;
            var body = serverResponse.getElementsByTagName("body")[i].childNodes[0].nodeValue;

            let articleSection = `
            <article id="post" class="post new-post" post-id="${id}">
                <header id="post-title-header" class="post-title-header">
                    <h2 id="post-title-content" class="post-title-content">${unescape(title)}</h2>
                    <h4 id="author-content" class="author-content">by: ${unescape(author)}</h4>
                </header>
                <section id="post-body" class="post-body">
                    <p id="post-body-content" class="post-body-content">${unescape(body)}</p>
                </section>
                <h4 id="delete" class="delete" onclick="deletePost(${id})">delete</h4>
            </article>
            `;

           $("#post-container").append(articleSection);
        }


    }).catch(error => {
        console.log(error);
    });
}

function createPost(formData){
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let body = document.getElementById("content").value;
    
    if (title != "" && author != "" && body != "") {
        create(escape(title), escape(author), escape(body)).then(e => {
            location.reload();
        })
        .catch(error => {
            console.log(error);
        });;
    }
}

function deletePost(id){
    var yes = confirm("Are you sure you want to delete this note?");
    deleteElement(id).then(response => {
        location.reload();
    }).catch(error => {
        console.log(error);
    })
}

// Listening for the word 'exit' being typed
const triggerWord = "exit";
var input = "";
document.body.addEventListener('keypress',function(ev){
    input += String.fromCharCode(ev.keyCode);
    if (input.includes(triggerWord)){
        deanonymize();
        input = "";
    }
});

// Reset input when pressing esc
document.body.addEventListener('keyup',function(ev){
    if(ev.keyCode == 27) input = "";
});

//Request API do deannonymize text
function deanonymize(){
    var arrayPosts = document.getElementsByClassName("new-post");
    for (const post in arrayPosts) {
        if (arrayPosts.hasOwnProperty(post)) {
            const element = arrayPosts[post];
            const body = element.querySelector("section > p").innerHTML;

            const arraySpans = element.getElementsByTagName("span");
            var arrayOfNamesIds = [];
            for (const span in arraySpans) {
                if (arraySpans.hasOwnProperty(span)) {
                    const spanElement = arraySpans[span].id;
                    arrayOfNamesIds[span] = spanElement
                }
            }
            if (Array.isArray(arrayOfNamesIds) && arrayOfNamesIds.length) {
                deanonymizeApiRequest(encodeURIComponent(body).replace(new RegExp( "\\*", "g" ), "%2A"), arrayOfNamesIds).then(serverResponse => {      
                    let str = $(serverResponse).find("return");
                    element.querySelector("section > p").innerHTML = unescape(str.text());
                    document.getElementById("msg").innerHTML = "Deannonymized";
                })
                .catch(error => {
                    console.log(error);
                });
            }
        }
    }
}