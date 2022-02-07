
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    function addValue(selector) {

        const wrapper = document.querySelector(selector);
        const idArr = wrapper.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
        const checkbox = wrapper.querySelector(idArr[0]);
        const search = document.querySelector(idArr[1]);
        const contListCantries = document.querySelector(idArr[2]);
        const selectedCantries = document.querySelector(idArr[3]);
        const listCantries = [...contListCantries.children[0].children];
        
        checkbox.addEventListener('input', (e) => {
            if (!e.target.checked) {
                wrapper.style.opacity = 0.5;
            } else {
                wrapper.style.opacity = '';
            }
        });

        const dell = function () {
            const wrapsBtns = listCantries.filter(item => item
                .getAttribute('value') === this.parentNode
                .getAttribute('data-value'));

            wrapsBtns.forEach(tr => {
                const btn = tr.querySelector('a');
                btn.classList.remove('btn-danger');
                btn.textContent = 'add';
            });
            this.parentNode.remove();
        }

        search.addEventListener('input', (e) => {
            listCantries.forEach(item => {
                if (!item.querySelectorAll('td')[1].textContent.toLowerCase().startsWith(e.target.value.toLowerCase())) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            });
        });

        const btnAction = (e, code, cant) => {
            let btn = e.target;
            if (btn.textContent === 'add') {
                const div = document.createElement('div');
                div.classList.add('selected', 'btn-primary')
                div.setAttribute('data-value', code);
                div.innerHTML = `
                <span>${cant}</span>
                <x>&times;</x>`;
                div.querySelector('x').addEventListener('click', dell);
                selectedCantries.appendChild(div);
                btn.textContent = 'del';
            } else {
                btn.textContent = 'add';
                 [...selectedCantries.children].forEach(item => {
                if (item.getAttribute('data-value') === code) {
                    item.remove();
                }
            });
            }
            btn.classList.toggle('btn-danger');
        }

        listCantries.forEach(item => {
            item.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const code = e.target.parentNode.parentNode.getAttribute('value');
                const cant = e.target.parentNode.parentNode.querySelectorAll('td')[1].textContent;
                btnAction(e, code, cant);

            });
        });

    }

    addValue('[data-cantries]');
    addValue('[data-languages]');


    function setData(selector, reg = /\*/) {
        const wrap = document.querySelector(selector);
        const idArr = wrap.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
        const showCheckbox = wrap.querySelector(idArr[0]);
        const cont = wrap.querySelector(idArr[1]);
        const input = cont.querySelector(idArr[2]);
        const inputSubmit = cont.querySelector(idArr[3]);

        showCheckbox.addEventListener('input', (e) => {
            if (!e.target.checked) {
                wrap.style.opacity = 0.5;
            } else {
                wrap.style.opacity = '';
            }
        });
        
        input.addEventListener('focus', () => {
           input.classList.remove('placehold');
        });

        input.addEventListener('blur', () => {
           input.classList.add('placehold');
        });

        function checkedInclIp(dataValue, cb) {
            const dataList = [...cont.querySelectorAll("[data-value]")];
            const dataFilter = dataList.filter(ipItem => ipItem.querySelector('span').textContent === dataValue);
            if (dataFilter.length === 0) {
                cb();
            } else {
                signal(8, dataValue);
            }
        }

        function signal(i=6, sel) {
            setTimeout(() => {
                cont.querySelector(`[data-value="${sel}"]`).classList.toggle('dang');
                i--;
                if (i > 0) signal(i, sel);
            }, 100);
        };
        
        function createBlock() {
            const newData = document.createElement('div');
            const dataValue = input.textContent;
            newData.classList.add('selected', 'btn-primary');
            newData.setAttribute('data-value', dataValue);
            newData.innerHTML = `
                <span>${dataValue}</span>
                <x>&times;</x>`;
            newData.querySelector('x').addEventListener('click', (e) => e.target.parentNode.remove());
            input.textContent = '';
            cont.insertBefore(newData, input);
            inputSubmit.value += dataValue;
        }
        
        input.addEventListener('keypress', (e) => {
            if (e.key.match(reg)) {
                e.preventDefault();
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                checkedInclIp(input.textContent, createBlock);
                
            }
        });
        
    }

    setData('[data-ip]', /[^0-9 . :]/ig);
    setData('[data-host]');

    function blackPage(selector) {
        const wrap = document.querySelector(selector);
        const idArr = wrap.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
        const search = wrap.querySelector(idArr[0]);
        const tree = wrap.querySelector(idArr[1]);
        let i = 0;
        let arrayLink = [];
        const pathForm = () => {
            let path = '';
            return function pars(elem) {
                if (elem.parentNode.nodeName !== 'DIV') {
                    const parent = elem.parentNode;
                    if (parent.nodeName === 'LI' && parent.querySelector('[data-dir]')) {
                        path = parent.querySelector('[data-dir]').getAttribute('data-dir')+path;
                    }
                    pars(parent);
                }
                return path;
            }
        }
        const showBranch = (elem) => {
            const parent = elem.parentNode;
             if (parent.nodeName !== 'DIV') {
                 if (parent.offsetWidth == 0) parent.style.display = 'block';
               
                showBranch(parent);
            }
        }
        const hideBranch = (tree) => {
            const chil = tree.children;
            if (chil.length != 0) {
                [...chil].forEach(item => {
                    if (item.style.display) item.removeAttribute('style')
                    hideBranch(item);
                });
            }
        }





        function parserTree(elem) {
            const child = elem.children;
            
            if (child.length > 0) {
                for(let i = 0; i < child.length; i++) {
                    if (child[i].tagName === 'LI' && child[i].querySelector('ul')) {
                        const a_item = child[i].querySelector('a');
                        const ul_item = child[i].querySelector('ul');
                        a_item.setAttribute('data-dir', a_item.textContent+'/')
                        a_item.innerHTML = `<em></em>` + a_item.innerHTML;
                        a_item.addEventListener('click', (e) => {
                            e.preventDefault();
                            ul_item.style.display = ul_item.offsetWidth == 0 ? 'block' : '';
                            a_item.querySelector('em').classList.toggle('active');
                        });
                        if (!child[i].nextElementSibling) {
                            child[i].children[1].querySelectorAll('li').forEach(li => li.className = 'last');
                        }
                    }
                    if (child[i].tagName === 'LI' && !child[i].querySelector('ul')) {
                        const a_item = child[i].querySelector('a');
                        a_item.setAttribute('data-value', pathForm()(a_item)+ a_item.textContent);
                        arrayLink.push(a_item);

                        a_item.innerHTML = `<i>select</i>` + a_item.innerHTML;
                        a_item.addEventListener('click', (e) => {
                            e.preventDefault();
                            console.log(a_item.getAttribute('data-value'));
                            if (a_item.className ==='') {
                                arrayLink.forEach(link => {
                                    link.className = '';
                                    link.querySelector('i').textContent = 'select'
                                });
                                a_item.className = 'current';
                                a_item.querySelector('i').textContent = 'cancel'
                            } else {
                                a_item.className = '';
                                a_item.querySelector('i').textContent = 'select'
                            }
                        });
                    }
                    parserTree(child[i]);
                }
            }
        }

        parserTree(tree);


        search.addEventListener('input', (e) => {
            const keyord = e.target.value;
            hideBranch(tree);
            arrayLink.forEach(link => {
                const check = link.textContent.replace('select', '');
                if (check.startsWith(keyord) && keyord !== '') {
                    // console.log(link.textContent.replace('select', ''))
                    showBranch(link);
                }
            })
        });


        // console.log(document.querySelector('i'))
        
    }

    blackPage("[data-blackPage]");





    function formSubmit(selector)  {
        const form = document.querySelector(selector);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let formData = new FormData(form);

            fetch('http://test.ru', {
                method: 'POST',
                headers: {
                    // 'Content-type': 'application/x-www-form-urlencoded'
                    // 'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(res => console.log(res));
        });
    }

    formSubmit('form');


});
