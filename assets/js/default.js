// nav toggle
var categoryElem = document.querySelector('.categories-container');

document.querySelector('.categories-container .nav-toggle')
.onclick = function() {
    categoryElem.classList.toggle('show');
};

document.querySelector('.nav-container .nav-toggle')
.onclick = function() {
    categoryElem.classList.toggle('show');
};
