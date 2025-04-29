const toggleLabel = document.getElementById('darkmode-toggle');

toggleLabel.onchange = (event) => {
  event.stopPropagation();

  const isDark = event.target.checked;

  const darkModeEvent = new CustomEvent('darkmode:toggle', {
    bubbles: true,
    detail: { enabled: isDark }
  });

  toggleLabel.dispatchEvent(darkModeEvent);
};

document.body.addEventListener('darkmode:toggle', (event) => {
  const enabled = event.detail.enabled;

  if (enabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
