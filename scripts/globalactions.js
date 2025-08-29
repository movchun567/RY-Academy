const logoutButton = document.querySelector('.logout-btn');

logoutButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../template/index.html';
});