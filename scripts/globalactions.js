const logoutButton = document.querySelector('.logout-btn');

logoutButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../template/index.html';
});

const darkModeButton = document.querySelector('.dark-mode-btn');
function initDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

darkModeButton.addEventListener('click', toggleDarkMode);
document.addEventListener('DOMContentLoaded', initDarkMode);
