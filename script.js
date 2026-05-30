document.getElementById('year').textContent = new Date().getFullYear();

const COPY_LINKS = {
  futuhi2026parallel: 'https://www.youtube.com/watch?v=naV-qD9pCok&t=1s',
};

function getBibEntry(key) {
  const template = document.getElementById(`bib-${key}`);
  if (!template) return null;
  return template.content.textContent.trim();
}

function showCopyToast(message) {
  let toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.className = 'bib-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showCopyToast._timer);
  showCopyToast._timer = setTimeout(() => toast.classList.remove('visible'), 2000);
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

async function copyText(text, toastMessage) {
  try {
    await copyToClipboard(text);
    showCopyToast(toastMessage);
  } catch {
    showBibModal(text);
  }
}

function showBibModal(bib) {
  let modal = document.getElementById('bib-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bib-modal';
    modal.className = 'bib-modal';
    modal.innerHTML = `
      <div class="bib-modal-content" role="dialog" aria-labelledby="bib-modal-title" aria-modal="true">
        <div class="bib-modal-header">
          <h3 id="bib-modal-title">BibTeX</h3>
          <button type="button" class="bib-modal-close" aria-label="Close">×</button>
        </div>
        <pre class="bib-modal-text"></pre>
        <button type="button" class="bib-modal-copy">Copy to clipboard</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.bib-modal-close').addEventListener('click', hideBibModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) hideBibModal();
    });
    modal.querySelector('.bib-modal-copy').addEventListener('click', async () => {
      const text = modal.querySelector('.bib-modal-text').textContent;
      await copyText(text, 'BibTeX copied to clipboard');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideBibModal();
    });
  }

  modal.querySelector('.bib-modal-text').textContent = bib;
  modal.classList.add('visible');
}

function hideBibModal() {
  const modal = document.getElementById('bib-modal');
  if (modal) modal.classList.remove('visible');
}

document.querySelectorAll('.bibtex-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const bib = getBibEntry(link.dataset.bib);
    if (!bib) return;
    showBibModal(bib);
  });
});

document.querySelectorAll('.copy-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = link.dataset.copy || COPY_LINKS[link.dataset.link];
    if (!url) {
      showCopyToast('Presentation link not set yet');
      return;
    }
    await copyText(url, 'Presentation link copied to clipboard');
  });
});

(function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav a');
  const sections = [...document.querySelectorAll('main section[id]')];

  function updateActiveNav() {
    const headerOffset = 80;
    let currentId = sections[0]?.id || '';

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerOffset) {
        currentId = section.id;
      }
    }

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();
