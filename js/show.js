
function toggle(component) {
    if (component.classList.contains('show')){
        component.classList.remove('show');
        component.classList.add('no-show');
    }
    else{
        component.classList.remove('no-show');
        component.classList.add('show');
    }
}

export default {toggle};