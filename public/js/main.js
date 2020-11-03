function createTree(obj) {
    $('div.list').html(createTreeDom(obj, true));
    let toggler = document.getElementsByClassName("caret");
    let i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
    let butDelete = document.getElementsByName("delete");
    let j;
    for (j = 0; j < butDelete.length; j++) {
        butDelete[j].addEventListener("click", function () {
            let id = $(this).data('whatever')
            $.get(`delete/`+id, (response) => {
                console.log(response)
                getRoots();
            })
        });
    }
}

function createTreeDom(obj, id = false) {
    if (!obj) return;
    let ul = document.createElement('ul');
    id ? ul.id = "myUl" : ul.classList.add("nested");

    for (let key in obj) {
        let li = document.createElement('li');
        let childrenUl = createTreeDom(obj[key].children);
        let add = document.createElement('button');
        let remove = document.createElement('button');
        let edit = document.createElement('button');
        add.classList.add("custom-btn");
        edit.classList.add("custom-btn");
        remove.classList.add("custom-btn");
        remove.setAttribute("name","delete")
        add.setAttribute("data-toggle", "modal");
        add.setAttribute("data-target", "#addRoot");
        add.setAttribute("data-whatever", obj[key].id);
        remove.setAttribute("data-whatever", obj[key].id);
        if (childrenUl) {
            let span = document.createElement('span');
            span.classList.add("caret")
            span.innerHTML = obj[key].name;
            li.appendChild(span);
            li.appendChild(add);
            add.append('+');
            li.appendChild(remove);
            remove.append('-');
            li.append(childrenUl);
        } else {
            li.innerHTML = obj[key].name;
            li.appendChild(add);
            add.append('+');
            li.appendChild(remove);
            remove.append('-');
        }

        ul.append(li);
    }

    return ul;
}

function getRoots() {
    $.get(`getRoots`, (response) => {
        let data = JSON.parse(response)
        createTree(data);
    })
}

$('#addRoot').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let pid = button.data('whatever')
    let modal = $(this)
    pid ? modal.find('input[name="pid"]').val(pid) : null;
    timer(10);
})

$('#form-submit').on('click', function (e) {
    e.preventDefault();

    $.post(`create`, $('form').serialize(), (response) => {
        $('#addRoot').modal('hide');
        getRoots();
        console.log(response)
    }).fail(function (error) {
        console.log(error)
    })
})

$("#addRoot").on("hidden.bs.modal", function(){
    clearInterval(interval);
    $(this).find("input").val('');
    $(this).find("span.countdown").text('10');
});

function timer(seconds) {
    interval = setInterval(function () {
        seconds--;
        $('span.countdown').text(seconds);
        if (seconds == 0) {
            clearInterval(interval);
            $('#addRoot').modal('toggle');
        }
    }, 1000);
}

getRoots();



