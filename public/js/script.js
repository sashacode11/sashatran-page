// Search icon
document.addEventListener('DOMContentLoaded', () => {
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');

  allButtons.forEach(button => {
    button.addEventListener('click', event => {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      event.currentTarget.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  });

  document.addEventListener('click', event => {
    if (
      !searchBar.contains(event.target) &&
      !Array.from(allButtons).includes(event.target)
    ) {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      searchInput.focus();
    }
  });
});

// Hamburger menu
// document.addEventListener('DOMContentLoaded', function () {
//   const menuIcon = document.querySelector('.menu-icon');
//   const navMenu = document.querySelector('.header__nav ul');

//   menuIcon.addEventListener('click', function () {
//     navMenu.classList.toggle('collapsed');
//   });

// document.querySelectorAll('.nav-link').forEach(n =>
//   n.addEventListener('click', () => {
//     navMenu.classList.remove('collapsed');
//   })
// );
// });

document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.querySelector('.menu-icon');
  const navMenu = document.querySelector('.header__nav ul');

  menuIcon.addEventListener('click', function () {
    navMenu.classList.toggle('collapsed');
    menuIcon.classList.toggle('active');
  });

  // Close the menu and reset the icon when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('collapsed');
      menuIcon.classList.remove('active');
    });
  });
});
