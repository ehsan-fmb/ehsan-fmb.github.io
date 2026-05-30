document.getElementById('year').textContent = new Date().getFullYear();

const BIBTEX = {
  futuhi2026learning: `@inproceedings{futuhi2026learning,
  title={Learning Admissible Heuristics for A*: Theory and Practice},
  author={Futuhi, Ehsan and Sturtevant, Nathan R.},
  booktitle={Proceedings of the Fourteenth International Conference on Learning Representations (ICLR)},
  year={2026},
}`,
  futuhi2026parallel: `@inproceedings{futuhi2026parallel,
  title={A Parallel CPU-GPU Framework for Batching Heuristic Operations in Depth-First Heuristic Search},
  author={Futuhi, Ehsan and Sturtevant, Nathan R},
  booktitle={Proceedings of the AAAI Conference on Artificial Intelligence},
  volume={40},
  number={43},
  pages={36919--36927},
  year={2026}
}`,
};

const COPY_LINKS = {
  futuhi2026parallel: 'https://www.youtube.com/watch?v=naV-qD9pCok&t=1s',
};

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
    const bib = BIBTEX[link.dataset.bib];
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
