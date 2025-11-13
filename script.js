(async function () {
  const res = await fetch('./data/translations.json');
  if (!res.ok) return;
  const rawData = await res.json();

  const esc = (str) =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const renderZh = (text) => {
    return text.replace(/[\p{L}\u4e00-\u9fff·]+/gu, (word) => {
      const translation = rawData[word]?.english || '(no translation)';
      const definition = rawData[word]?.definition || '';
      return `<span class="word" data-word="${esc(word)}">
                ${esc(word)}
                <span class="tooltip">
                  <a class="gt-title" href="https://translate.google.com/?sl=zh-CN&tl=en&text=${encodeURIComponent(
                    word
                  )}" target="_blank" rel="noopener noreferrer">
                    Google Translate
                  </a><br>
                  ${esc(translation)}<br>
                  <small>${esc(definition)}</small>
                </span>
              </span>`;
    });
  };

  const buildEnglishText = (text) => {
    return text.replace(/[\p{L}\u4e00-\u9fff·]+/gu, (word) => {
      const t = rawData[word]?.english || word;
      return esc(t);
    });
  };

  document.querySelectorAll('.translatable').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('data-zh', text);
    el.setAttribute('data-en', buildEnglishText(text));
    el.innerHTML = renderZh(text);
  });

  let _resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => setContainerHeight(), 150);
  });

  const toggleBtn = document.getElementById('toggleLangBtn');
  let showingEn = false;
  toggleBtn.addEventListener('click', () => {
    showingEn = !showingEn;
    toggleBtn.classList.toggle('active', showingEn);
    document.querySelectorAll('.translatable').forEach((el) => {
      if (showingEn) el.textContent = el.getAttribute('data-en') || '';
      else el.innerHTML = renderZh(el.getAttribute('data-zh') || '');
    });
    document.querySelectorAll('.word.active').forEach((w) => w.classList.remove('active'));
  });

  document.addEventListener('click', (e) => {
    const clickedWord = e.target.closest('.word');
    document.querySelectorAll('.word.active').forEach((w) => {
      if (w !== clickedWord) w.classList.remove('active');
    });
    if (clickedWord) {
      clickedWord.classList.toggle('active');
      const tooltip = clickedWord.querySelector('.tooltip');
      if (tooltip) {
        requestAnimationFrame(() => {
          const rect = tooltip.getBoundingClientRect();
          if (rect.top < 0) {
            tooltip.classList.add('below');
          } else if (rect.bottom > window.innerHeight) {
            tooltip.classList.remove('below');
          }
        });
      }
    }
  });

  document.addEventListener(
    'click',
    (e) => {
      if (!e.target.closest('.word'))
        document.querySelectorAll('.word.active').forEach((w) => w.classList.remove('active'));
    },
    true
  );
})();
