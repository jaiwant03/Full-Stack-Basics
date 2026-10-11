// ============================================================
// script.js — AI-Powered Full Stack Developer Portfolio Logic
// Handles navigation, theme switching, dialog modal, copy tools,
// project filtering, mobile drawer & dynamic toast notifications.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Toast Notification Utility ---------- */
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimeout;

  function showToast(title, message, icon = '✓') {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  /* ---------- Theme Toggle (Dark / Light) ---------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const rootHtml = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('jk_portfolio_theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootHtml.setAttribute('data-theme', newTheme);
      localStorage.setItem('jk_portfolio_theme', newTheme);
      showToast('Theme Updated', `Switched to ${newTheme} mode.`, newTheme === 'dark' ? '🌙' : '☀️');
    });
  }

  /* ---------- Mobile Sidebar Drawer ---------- */
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const openSidebarBtn = document.getElementById('openSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  if (openSidebarBtn) openSidebarBtn.addEventListener('click', openMobileSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  /* ---------- Sidebar Tab Navigation ---------- */
  const navButtons = document.querySelectorAll('.sidenav button');
  const views = document.querySelectorAll('.view');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      views.forEach(v => {
        const isActive = v.id === target;
        v.classList.toggle('active', isActive);
      });

      // Move focus for accessibility
      const heading = document.querySelector(`#${target} .section-title`);
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }

      // Close mobile drawer if open
      closeMobileSidebar();

      // Smooth scroll back up on small screens
      if (window.innerWidth <= 860) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Project Category Filtering ---------- */
  const filterBtns = document.querySelectorAll('.project-filter-group .filter-btn');
  const projectCards = document.querySelectorAll('.project-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // 'all', 'ai', 'web'

      projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInView 0.3s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Copy Email to Clipboard ---------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'jaisam710@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Copied to Clipboard!', email, '📋');
        }).catch(() => {
          copyFallback(email);
        });
      } else {
        copyFallback(email);
      }
    });
  }

  function copyFallback(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('Copied to Clipboard!', text, '📋');
    } catch (err) {
      showToast('Email Address', text, '✉️');
    }
    document.body.removeChild(input);
  }

  /* ---------- Enquiry Modal Dialog ---------- */
  const dialog = document.getElementById('contactDialog');
  const openContactBtns = [
    document.getElementById('openContact'),
    document.getElementById('openContact2'),
    document.getElementById('openEnquiryBtn')
  ];
  const cancelBtn = document.getElementById('cancelDialog');
  const cancelIcon = document.getElementById('cancelDialogIcon');
  const form = document.getElementById('contactForm');
  const msgInput = document.getElementById('msgInput');
  const charCount = document.getElementById('charCount');

  openContactBtns.forEach(b => {
    if (b) {
      b.addEventListener('click', () => {
        if (dialog && typeof dialog.showModal === 'function') {
          dialog.showModal();
        }
      });
    }
  });

  function closeDialog() {
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  if (cancelBtn) cancelBtn.addEventListener('click', closeDialog);
  if (cancelIcon) cancelIcon.addEventListener('click', closeDialog);

  // Close when clicking dialog backdrop
  if (dialog) {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeDialog();
      }
    });
  }

  // Live Character Counter
  if (msgInput && charCount) {
    msgInput.addEventListener('input', () => {
      charCount.textContent = msgInput.value.length;
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('nameInput');
      const emailInput = document.getElementById('emailInput');

      const name = nameInput ? nameInput.value.trim() : 'Friend';
      closeDialog();

      showToast(
        'Enquiry Submitted!',
        `Thank you ${name}! Your message has been received. Jaiwant will reply soon.`,
        '✨'
      );

      form.reset();
      if (charCount) charCount.textContent = '0';
    });
  }

  /* ---------- Resume View / Download ---------- */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast(
        'Resume Preview',
        'Profile of Jaiwant Karrun SA — B.Tech AI & DS, KPR Institute (9.13 CGPA). Contact jaisam710@gmail.com for the full PDF copy.',
        '📄'
      );
    });
  }

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});