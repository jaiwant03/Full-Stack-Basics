// ============================================================
// script.js — sidebar navigation, resume button and the
// enquiry dialog.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sidebar tab navigation ---------- */
  const navButtons = document.querySelectorAll('.sidenav button');
  const views = document.querySelectorAll('.view');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      views.forEach(v => v.classList.toggle('active', v.id === target));

      // move focus to the section heading for keyboard/screen-reader users
      const heading = document.querySelector(`#${target} .section-title`);
      if (heading) heading.setAttribute('tabindex', '-1'), heading.focus();
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Enquiry dialog ---------- */
  const dialog = document.getElementById('contactDialog');
  const openBtns = [document.getElementById('openContact'), document.getElementById('openContact2')];
  const cancelBtn = document.getElementById('cancelDialog');
  const form = document.getElementById('contactForm');
  const msgInput = document.getElementById('msgInput');
  const charCount = document.getElementById('charCount');

  openBtns.forEach(b => b && b.addEventListener('click', () => dialog.showModal()));
  if (cancelBtn) cancelBtn.addEventListener('click', () => dialog.close());

  if (msgInput && charCount) {
    msgInput.addEventListener('input', () => {
      charCount.textContent = msgInput.value.length;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      // In a real deployment, wire this up to an email service or backend.
      // For now we just confirm receipt and close the dialog.
      setTimeout(() => {
        alert('Thanks! Your message has been noted (wire this form up to your email service to actually send it).');
      }, 0);
    });
  }

  /* ---------- Resume button placeholder ---------- */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      alert('Add a link to your resume PDF on this button (e.g. href to /resume.pdf).');
    });
  }
});