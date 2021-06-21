let time = 30
getRoots();

let list = $('div[id=list]');

list.on('click', 'button[name=edit]', function (e) {
    let id = e.currentTarget.id
    let rootName = e.currentTarget.getAttribute('data-name')
    let modal = $('#addRoot')
    modal.find('h5').html('Edit root')
    $('div.form-group').show()
    modal.modal('show')
    modal.find('input[name="name"]').val(rootName)
    modal.find('input[name="id"]').val(id)
    document.getElementById("form-submit").name = 'edit';
});

list.on('click', 'button[name=add]', function (e) {
    document.getElementById("form-submit").name = 'add';
    let id = e.currentTarget.id
    let modal = $('#addRoot')
    modal.find('h5').html('Create root')
    $('div.form-group').show()
    modal.modal('show')
    id ? modal.find('input[name="id"]').val(id) : null;
});

list.on('click', 'button[name=delete]', function (e) {
    document.getElementById("form-submit").name = 'delete';
    let id = e.target.id
    let modal = $('#addRoot')
    modal.find('h5').html('Delete root')
    $('div.form-group').hide()
    $('div.confirm-deletion').show()
    modal.find('input[name="id"]').val(id)
    modal.modal('show')
});

list.on('click', 'span', function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
});

function createTree(obj) {
    let container = document.getElementById('list');
    container.append(createTreeDom(obj));

}

function createTreeDom(obj, path = null) {
    if (!obj) return;
    let ul;
    if (path === null) {
        ul = create('ul', {
            'id': 'myUL'
        })
    } else {
        ul = create('ul', {
            'id': 'ul-item-' + path,
            'cls': true
        })
    }
    for (let key in obj) {
        let li = create('li', obj[key].path)
        let childrenUl = createTreeDom(obj[key].children, obj[key].path);
        create('buttons', {
            'id': obj[key].id,
            'li': li,
            'name': obj[key].name
        })
        if (childrenUl) {
            let span = create('span')
            li.prepend(obj[key].name + ' ');
            li.prepend(span);
            li.append(childrenUl);
        } else {
            li.prepend(obj[key].name + ' ');
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

$('#addRoot').on('show.bs.modal', function () {
    timer(time);
})

function timer(seconds) {
    interval = setInterval(function () {
        seconds--;
        $('span.countdown').text(seconds);
        if (seconds === 0) {
            clearInterval(interval);
            $('#addRoot').modal('toggle');
        }
    }, 1000);
}

$("#addRoot").on("hidden.bs.modal", function () {
    clearInterval(interval);
    $(this).find("input").val('');
    $(this).find("span.countdown").text(time);
});

$('#form-submit').on('click', function (e) {
    e.preventDefault();
    switch (e.currentTarget.name) {
        case 'add':
            $.post(`create`, $('form').serialize(), (response) => {
                $('#addRoot').modal('hide');
                let data = JSON.parse(response)
                add(data)
            }).fail(function (error) {
                console.log(error)
            })
            break
        case 'edit':
            $.post(`edit`, $('form').serialize(), (response) => {
                $('#addRoot').modal('hide');
                let nameRoot = $('input[name=name]').val()
                let id = $('input[name=id]').val()
                let arr = $("li[id$=" + id + "]")[0].childNodes
                for (const el of arr) {
                    if (el.nodeValue) {
                        el.nodeValue = nameRoot + ' '
                        break
                    }
                }
            }).fail(function (error) {
                console.log(error)
            })
            break
        case 'delete':
            deleteNode($('form')[0].id.value);
            $('#addRoot').modal('hide')
            $('div.confirm-deletion').hide()
            break
    }
})

function deleteNode(id) {
    if (id) {
        $.get(`delete/` + id, (response) => {
            let rmLi = $("li[id$=" + id + "]").remove()
            let parId = rmLi[0].id.replace(/(.*)-.*/, "$1")
            let ulId = $("ul[id$=" + parId + "]")[0];
            (ulId && ulId.getElementsByTagName('li').length < 1)
                ?
                (
                    $("li[id$=" + parId + "]")[0].getElementsByTagName('span')[0].remove(),
                        ulId.remove()
                )
                : false
        })
    }
}

function add(data) {
    let ulPath = data.path.replace(/(.*)-.*/, "$1");
    let ul = data.pid ? $("ul[id$=" + ulPath + "]")[0] : $("ul[id='myUL']")[0];
    if (!ul && data.pid) {
        let span = create('span')
        let parentLi = $("li[id$=" + ulPath + "]")[0];
        parentLi.prepend(span)
        ul = create('ul', {
            'cls': true,
            'id': 'ul-item-' + ulPath
        })
        parentLi.appendChild(ul);
    }
    let li = create('li', data.path)
    let text = document.createTextNode(data.name + ' ')
    li.appendChild(text)
    create('buttons', {
        'id': data.id,
        'li': li,
        'name': data.name
    })
    ul.appendChild(li)
}

function create(tag, params = false) {
    switch (tag) {
        case 'span':
            let span = document.createElement('span')
            span.classList.add('caret')
            return span
        case 'li':
            let li = document.createElement('li')
            li.id = params
            return li;
        case 'ul':
            let ul = document.createElement('ul')
            params['id'] ? ul.id = params['id'] : false
            params['cls'] ? ul.classList.add('nested') : false;
            return ul;
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
            add.setAttribute("id", params['id']);
            add.setAttribute("name", "add")
            add.append('+');

            let remove = document.createElement('button');
            remove.classList.add("custom-btn");
            remove.setAttribute("name", "delete")
            remove.append('-');
            remove.setAttribute("id", params['id']);

            let edit = document.createElement('button');
            edit.classList.add("custom-btn");
            edit.setAttribute("name", "edit")
            edit.setAttribute("id", params['id'])
            edit.setAttribute("data-name", params['name'])
            edit.appendChild(svg)
            params['li'].appendChild(add);
            add.insertAdjacentHTML('afterend', "&nbsp;")
            params['li'].appendChild(remove);
            remove.insertAdjacentHTML('afterend', "&nbsp;")
            params['li'].appendChild(edit);
            return params['li'];
    }
}