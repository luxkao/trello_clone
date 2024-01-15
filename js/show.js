
function toggle(components) {
    components.forEach(component => {
        if (component.classList.contains('show')){
            component.classList.remove('show');
            component.classList.add('no-show');
        }
        else{
            component.classList.remove('no-show');
            component.classList.add('show');
        }
    });
}

function applyBackgroundColor(color, components){
    components.forEach(component => {
        component.style.backgroundColor = color;
    });
}

export default {toggle, applyBackgroundColor};