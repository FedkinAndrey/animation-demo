document.querySelectorAll('.card-toggle').forEach(function(cardToggle) {
  cardToggle.addEventListener('click', function() {
    document.querySelectorAll('.card-toggle').forEach(function(toggle) {
      toggle.classList.remove('active');
    });
    this.classList.add('active');

    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.remove('active');
      card.querySelector('.card-content').style.zIndex = '';
    });

    const parentCard = this.closest('.card');
    parentCard.classList.add('active');
    parentCard.querySelector('.card-content').style.zIndex = 1;
  });
});

document.querySelectorAll('input,textarea').forEach(function(input) {
  input.addEventListener('blur', function() {
    if (this.value) {
      this.parentNode.classList.add('filled');
    } else {
      this.parentNode.classList.remove('filled');
    }
  });
});
document.querySelector('.contact').addEventListener('click', function() {
  document.querySelector('.contact-form').classList.toggle('active');
});
document.querySelector('.contact-form input[type=submit], .contact-form .close').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.contact-form').classList.toggle('active');
});
