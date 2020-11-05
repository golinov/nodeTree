getRoots();
let butDelete = document.getElementsByName("delete");
let toggler = document.getElementsByClassName("caret");
function createTree(obj) {
    let container = document.getElementById('list');
    container.append(createTreeDom(obj));
    let i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
    let j;
    for (j = 0; j < butDelete.length; j++) {
        butDelete[j].addEventListener("click", function () {
            let id = $(this).data('whatever')
            $.get(`delete/` + id, (response) => {
                $("li[id$=" + id + "]").remove()
            })
        });
    }
}

function createTreeDom(obj, path = null) {
    if (!obj) return;
    let ul = render('ul')
    if (path === null) {
        ul.id = "myUl"
    } else {
        ul.classList.add("nested"),
            ul.id = 'ul-item-' + path
    }
    for (let key in obj) {
        let li = document.createElement('li');
        li.id = 'li-item-' + obj[key].path
        let childrenUl = createTreeDom(obj[key].children, obj[key].path);
        if (childrenUl) {
            let span = document.createElement('span');
            span.classList.add("caret")
            span.innerHTML = obj[key].name;
            li.appendChild(span);
            render('buttons', obj[key].id, li)
            li.append(childrenUl);
        } else {
            li.innerHTML = obj[key].name;
            render('buttons', obj[key].id, li)
        }
        ul.append(li);
    }

    return ul;
}

function getRoots() {
    $.get(`getRoots`, (response) => {
        let data = JSON.parse(response)
        console.log(data)
        createTree(data);
    })
}

$('#addRoot').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let pid = button.data('id')
    console.log(pid)
    let modal = $(this)
    pid ? modal.find('input[name="pid"]').val(pid) : null;
    timer(10);
})

$('#form-submit').on('click', function (e) {
    e.preventDefault();
    $.post(`create`, $('form').serialize(), (response) => {
        $('#addRoot').modal('hide');
        let data = JSON.parse(response)
        let ulPath = data.path.replace(/(.*)-.*/, "$1");
        let ul = $("ul[id$=" + ulPath + "]");
        let li = document.createElement('li')
        li.id = 'li-item-'+data.path
        let text = document.createTextNode(data.name)
        li.appendChild(text)
        render('buttons', data.id, li)
        ul[0].appendChild(li)
    }).fail(function (error) {
        console.log(error)
    })
})

$("#addRoot").on("hidden.bs.modal", function () {
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

function render(tag, params = false, li = false) {
    switch (tag) {
        case 'li':
            return li
        case 'ul':
            return document.createElement('ul')
        case 'buttons':
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            svg.setAttribute("viewBox", "0 0 16 16");
            svg.setAttribute("y", "150");
            svg.setAttribute("width", "0.7em");
            svg.setAttribute("height", "0.7em");
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("class", "bi bi-pencil-fill");

            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill-rule", "evenodd");
            path.setAttribute("d",
                "M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z");
            svg.appendChild(path);

            let add = document.createElement('button');
            add.classList.add("custom-btn");
            add.setAttribute("data-toggle", "modal");
            add.setAttribute("data-target", "#addRoot");
            add.setAttribute("data-id", params);
            add.append('+');

            let remove = document.createElement('button');
            remove.classList.add("custom-btn");
            remove.setAttribute("name", "delete")
            remove.append('-');
            remove.setAttribute("data-whatever", params);

            let edit = document.createElement('button');
            edit.classList.add("custom-btn");
            edit.appendChild(svg)
            li.appendChild(add);
            li.appendChild(remove);
            li.appendChild(edit);
            return li;
    }
}