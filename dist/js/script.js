
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    (function() {

        const data = {
            domain: document.querySelector('#domain').value,
            countries: {},
            language: {},
            whiteListIp: {},
            whiteListHost: {},
            blackPage: '',
            forceBlock: document.querySelector('#forceBlock').checked,
            upload: null,
            safePage: document.querySelector('#safePage').value
        };
        const regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?! 0)(?:(?! 0[^.]|255)[ 0-9]{1,3}\.){3}(?! 0|255)[ 0-9]{1,3})(?:\/[a-zа-я0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
        const domainInput = document.querySelector('#domain');
        const safePageInput = document.querySelector('#safePage');
        const blackPageValid = document.querySelector('#bp');

        function addObjItem(obj, key, value) {
            obj[key] = value;
        }

        function delObjItem(obj, key) {
            delete obj[key];
        }

        function errorSignal(elem) {
            const div = document.createElement('div');
            div.setAttribute('data-signal', '');
            div.style.cssText = `
                width: max-content;
                padding: 3px;
                line-height: 12px;
                text-align: center;
                border-color: #fff;
                border: 2px solid black;
                border-radius: 3px;`;
            div.textContent = `${elem.value } не валидный!`;
            if (!elem.parentNode.querySelector('[data-signal]')) {
                elem.parentNode.appendChild(div);
                setTimeout(() => div.remove(), 2000);
            }
        }
        
        function inValidInput(input, reg=/[^*]/, cb=(()=> {})) {
            if (!reg.test(input.value) || input.value == '') {
                // input.focus();
                input.classList.add('warn');
                cb(input);
            }
        }

        (function() {
            safePageInput.addEventListener('input', (e) => {
                if (safePageInput.classList.contains('warn')) safePageInput.classList.remove('warn');
                data.safePage = e.target.value;
            });
            
            domainInput.addEventListener('input', (e) => {
                if (domainInput.classList.contains('warn') && regURL.test(domainInput.value)) domainInput.classList.remove('warn');
                data.domain = e.target.value;
            });

            domainInput.addEventListener('blur', () => {
                inValidInput(domainInput, regURL);
            });
            
            safePageInput.addEventListener('blur', () => {
                if (safePageInput.value == '') safePageInput.classList.add('warn');
                
            });

            document.querySelector('#forceBlock').addEventListener('click', (e) => {
                data.forceBlock = e.target.checked;
            });
        })();

        
        

        function addValue(selector, obj) {

            const wrapper = document.querySelector(selector);
            const idArr = wrapper.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
            const checkbox = wrapper.querySelector(idArr[0]);
            const search = document.querySelector(idArr[1]);
            const contList = document.querySelector(idArr[2]);
            const selectedItem = document.querySelector(idArr[3]);
            const btnGetAll = document.querySelector(idArr[4]);
            const btnDelAll = document.querySelector(idArr[5]);
            const listItem = [...contList.children[0].children];
            let active = checkbox.checked;
            
            
            checkbox.addEventListener('click', () => {
                active = checkbox.checked;
                if (active) {
                    wrapper.style.opacity = '';
                    contList.parentNode.style.overflow = '';
                    search.removeAttribute('disabled');
                    [...selectedItem.children].forEach(item => {
                        const dataArray = item.getAttribute('data-value').split(' ');
                        addObjItem(obj, dataArray[0], dataArray[1]);
                    });
                } else {
                    for (let key in obj) {
                        delObjItem(obj, key);
                    }
                    contList.parentNode.style.overflow = 'hidden';
                    wrapper.style.opacity = 0.5;
                    search.setAttribute('disabled', '');
                }
            });

            btnGetAll.addEventListener('click', () => {
                listItem.forEach(item => {
                    if (!item.querySelector('a').getAttribute('data-add')) {
                        item.querySelector('a').click();
                    }
                });
            });
            
            btnDelAll.addEventListener('click', () => {
                listItem.forEach(item => {
                    if (item.querySelector('a').getAttribute('data-add')) {
                        item.querySelector('a').click();
                    }
                });
            });

            const delItem = (thisItem, key) => {
                if (active){
                    const wrapsBtns = listItem.filter(item => item
                        .getAttribute('value') === thisItem
                        .getAttribute('data-value').split(' ')[1]);
                        
                    wrapsBtns.forEach(tr => {
                        const btn = tr.querySelector('a');
                        btn.classList.remove('btn-secondary');
                        btn.classList.add('btn-light');
                        btn.removeAttribute('data-add');
                        btn.textContent = 'add';
                    });
                    delObjItem(obj, key);
                    thisItem.remove();
                }
            };

            search.addEventListener('input', () => {
                listItem.forEach(item => {
                    if (!item.querySelectorAll('td')[1].getAttribute('data-text').toLowerCase()
                    .startsWith(search.value.toLowerCase())) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = '';
                    }
                });
            });

            const toggleNewItem = (btn, code, cont) => {
                if (!btn.getAttribute('data-add')) {
                    btn.setAttribute('data-add', 'true');
                    const div = document.createElement('div');
                    div.classList.add('selected', 'bg-primary');
                    div.setAttribute('data-value', cont+' '+code);
                    div.innerHTML = `
                    <span>${cont}</span>
                    <x>&times;</x>`;
                    div.querySelector('x').addEventListener('click', () => delItem(div, cont));
                    selectedItem.appendChild(div);
                    addObjItem(obj, cont, code);
                    btn.textContent = 'del';
                } else {
                    btn.removeAttribute('data-add');
                    btn.textContent = 'add';
                    delObjItem(obj, cont);
                    [...selectedItem.children].forEach(item => {
                    if (item.getAttribute('data-value') === cont+' '+code) {
                        item.remove();
                    }
                });
                }
                btn.classList.toggle('btn-secondary');
                btn.classList.toggle('btn-light');
            };

            listItem.forEach(item => {
                const a_item = item.querySelector('a');
                a_item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (active) {
                        const code = item.getAttribute('value');
                        const cont = item.querySelectorAll('td')[1].getAttribute('data-text');
                        toggleNewItem(a_item, code, cont);
                    }
                });
            });
        }

        addValue('[data-contries]', data.countries);
        addValue('[data-languages]', data.language);


        function setData({selector, reg = /[*]/, regTest=/[^*]/, obj}) {
            const wrap = document.querySelector(selector);
            const idArr = wrap.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
            const showCheckbox = wrap.querySelector(idArr[0]);
            const cont = wrap.querySelector(idArr[1]);
            const input = cont.querySelector(idArr[2]);
            let active = showCheckbox.checked;
            const random = (len) => {
                let key = '';
                for (let i = 0; i < len; i++) {
                    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    str = str.split('').sort(() => Math.random() - 0.5).join('').slice(0, 1);
                    key += str;
                }
                return key;
            }

            showCheckbox.addEventListener('input', () => {
                active = showCheckbox.checked;
                if (active) {
                    wrap.style.opacity = '';
                    input.setAttribute('contenteditable', '');
                    cont.querySelectorAll('[data-value]').forEach(item => {
                        const dataArray = item.getAttribute('data-value').split(' ');
                        addObjItem(obj, dataArray[0], dataArray[1]);
                    });
                } else {
                    for (let key in obj) {
                        delObjItem(obj, key);
                    }
                    input.removeAttribute('contenteditable');
                    wrap.style.opacity = 0.5;
                }
            });
            
            input.addEventListener('focus', () => {
            input.classList.remove('placehold');
            });

            input.addEventListener('blur', () => {
            input.classList.add('placehold');
            });

            function checkedInclData(dataValue, cb) {
                const dataList = [...cont.querySelectorAll("[data-value]")];
                const dataFilter = dataList.filter(item => item.getAttribute('data-value').slice(5) === dataValue);
                if (dataFilter.length === 0) {
                    cb();
                } else {
                    signal(8, dataFilter[0].getAttribute('data-value'));
                }
            }

            function signal(i=6, sel) {
                setTimeout(() => {
                    cont.querySelector(`[data-value="${sel}"]`).classList.toggle('bg-danger');
                    i--;
                    if (i > 0) signal(i, sel);
                }, 100);
            };
            
            function createBlock() {
                const newData = document.createElement('div');
                const dataValue = input.textContent;
                const key = random(4);
                newData.classList.add('selected', 'btn-primary');
                newData.setAttribute('data-value', key+' '+dataValue);
                newData.innerHTML = `
                    <span>${dataValue}</span>
                    <x>&times;</x>`;
                newData.querySelector('x').addEventListener('click', (e) => {
                    if (active) {
                        delObjItem(obj, key);
                        e.target.parentNode.remove();
                    }
                });
                input.textContent = '';
                cont.insertBefore(newData, input);
                addObjItem(obj, key, dataValue);
            }
            
            input.addEventListener('keypress', (e) => {

                if (e.key.match(reg) || e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                }
                if (e.key === 'Enter' && input.textContent !== '' && regTest.test(input.textContent)) {
                    e.preventDefault();
                    checkedInclData(input.textContent, createBlock);
                    
                }
            });
            
        }

        setData({
            selector: '[data-ip]',
            obj: data.whiteListIp,
            regTest: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            reg: /[^0-9 .]/
        });
        setData({
            selector:'[data-host]',
            obj: data.whiteListHost,
            regTest: regURL
        });

        function blackPage(selector) {
            const wrap = document.querySelector(selector);
            const idArr = wrap.getAttribute(selector.replace(/\[|\]/g, '')).split(' ');
            const search = wrap.querySelector(idArr[0]);
            const tree = wrap.querySelector(idArr[1]);
            let arrayLink = [];
            let arrayLi = [];
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
                    if (parent.offsetWidth == 0) {
                        parent.style.display = 'block';
                        const em_item = parent.querySelector('em');
                        if (em_item) em_item.classList.add('active');
                    }
                
                    showBranch(parent);
                }
            }
            
            const hiddeBranch = (tree) => {
                const chil = tree.children;
                if (chil.length != 0) {
                    [...chil].forEach(item => {
                        if (item.style.display) item.removeAttribute('style');
                        hiddeBranch(item);
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
                            ul_item.style.display = ul_item.offsetWidth == 0 ? 'block' : '';
                            arrayLi.push(child[i]);
                            a_item.setAttribute('data-dir', a_item.textContent+'/')
                            a_item.innerHTML = `<em class="active"></em>` + a_item.innerHTML;
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
                            arrayLi.push(child[i]);
                            arrayLink.push(a_item);

                            a_item.innerHTML = `<i>select</i>` + a_item.innerHTML;
                            a_item.addEventListener('click', (e) => {
                                e.preventDefault();
                                if (a_item.className ==='') {
                                    arrayLink.forEach(link => {
                                        link.className = '';
                                        link.querySelector('i').textContent = 'select'
                                    });
                                    data.blackPage = a_item.getAttribute('data-value');
                                    blackPageValid.className = '';
                                    a_item.className = 'current';
                                    a_item.querySelector('i').textContent = 'cancel'
                                } else {
                                    data.blackPage = '';
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
                hiddeBranch(tree);
                arrayLi.forEach(link => {
                    const em_item = link.querySelector('em');
                    if (em_item) em_item.classList.remove('active');
                    link.style.display = keyord !== '' ? 'none' : '';
                });
                arrayLink.forEach(link => {
                    const check = link.textContent.replace('select', '');
                    if (check.startsWith(keyord) && keyord !== '') {
                        showBranch(link);
                        link.style.display = '';
                    }
                })
            });


            // console.log(document.querySelector('i'))
            
        }

        blackPage("[data-blackPage]");

        (function() {
            document.querySelector('[data-upload-true]')
                .addEventListener('click', () => {
                    data.upload = true;
                });
    
            document.querySelector('[data-upload-false]')
                .addEventListener('click', () => {
                    data.upload = false;
                });
        })()


        function formSubmit(selector)  {
            const form = document.querySelector(selector);

            form.addEventListener('invalid', (e) => {
                e.target.classList.add('warn');
            }, true);

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (data.blackPage == '') {
                    blackPageValid.className = 'warn';
                } else if (!regURL.test(domainInput.value)) {
                    domainInput.classList.add('inputSignal');
                    domainInput.onanimationend = () => {
                        domainInput.classList.remove('inputSignal')
                        domainInput.onanimationend = false;
                    }
                } else if(data.safePage == '') {
                    safePageInput.classList.add('warn');
                } else {

                    const formData = {};

                    for (let k in data) {
                        if (typeof(data[k]) === 'object') {
                            if (Object.values(data[k]).length !== 0) {
                                formData[k] = Object.values(data[k]);
                            }
                        } else {
                            formData[k] = data[k];
                        }
                    }

                    console.log(formData);
    
                    // fetch('http://test.ru', {
                    //     method: 'POST',
                    //     headers: {
                    //         // 'Content-type': 'application/x-www-form-urlencoded'
                    //         'Content-type': 'application/json'
                    //     },
                    //     body: JSON.stringify(formData)
                    //     // body: formData
                    // })
                    // .then(res => res.json())
                    // // .then(res => res.text())
                    // .then(res => console.log(res));
                }


            });
        }

        formSubmit('form');
    })()

});
