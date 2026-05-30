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

async function copyText(text, toastMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyToast(toastMessage);
  } catch {
    window.prompt('Copy to clipboard:', text);
  }
}

document.querySelectorAll('.bibtex-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const bib = BIBTEX[link.dataset.bib];
    if (!bib) return;
    await copyText(bib, 'BibTeX copied to clipboard');
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
