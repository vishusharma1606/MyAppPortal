document.addEventListener('DOMContentLoaded', function () {
  // close buttons
  document.querySelectorAll('.flash .close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = btn.parentElement;
      p.style.transition = 'opacity 180ms';
      p.style.opacity = '0';
      setTimeout(function () { p.remove(); }, 200);
    });
  });

  // auto-dismiss after 5s
  setTimeout(function () {
    document.querySelectorAll('.flash').forEach(function (el) {
      el.style.transition = 'opacity 300ms';
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentElement) el.remove(); }, 350);
    });
  }, 5000);
});

// dropdown toggle for user menu
document.addEventListener('click', function (e) {
  var toggle = e.target.closest('[data-dropdown-toggle]');
  if (toggle) {
    var menu = document.querySelector(toggle.getAttribute('data-dropdown-toggle'));
    if (menu) menu.classList.toggle('open');
    return;
  }
  // close any open dropdowns when clicking outside
  document.querySelectorAll('.dropdown.open').forEach(function (d) {
    if (!d.contains(e.target)) d.classList.remove('open');
  });
});

