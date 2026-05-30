document.getElementById('year').textContent = new Date().getFullYear();

const BIBTEX = {
  futuhi2026learning: `@inproceedings{futuhi2026learning,
  title={Learning Admissible Heuristics for A*: Theory and Practice},
  author={Futuhi, Ehsan and Sturtevant, Nathan R.},
  booktitle={Proceedings of the Fourteenth International Conference on Learning Representations (ICLR)},
  year={2026},
}`,
};

function showBibToast() {
  let toast = document.getElementById('bib-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bib-toast';
    toast.className = 'bib-toast';
    toast.textContent = 'BibTeX copied to clipboard';
    document.body.appendChild(toast);
  }
  toast.classList.add('visible');
  clearTimeout(showBibToast._timer);
  showBibToast._timer = setTimeout(() => toast.classList.remove('visible'), 2000);
}

document.querySelectorAll('.bibtex-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const bib = BIBTEX[link.dataset.bib];
    if (!bib) return;

    try {
      await navigator.clipboard.writeText(bib);
      showBibToast();
    } catch {
      window.prompt('Copy BibTeX:', bib);
    }
  });
});
