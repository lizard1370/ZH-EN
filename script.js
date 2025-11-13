(async function () {
  const res = await fetch('./data/translations.json');
  if (!res.ok) return;
  const rawData = await res.json();

<<<<<<< HEAD
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
=======
  const languages = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian',
    it: 'Italian',
    pt: 'Portuguese'
  };

  document.querySelectorAll('.translatable').forEach((el) => {
    const text = el.textContent.trim();
    const entry = rawData[text];
    if (!entry) return;

    // Store all translations in data attributes
    el.setAttribute('data-zh', text);
    Object.keys(languages).forEach(lang => {
      el.setAttribute(`data-${lang}`, entry[lang] || '');
    });

    const newHTML = text.replace(/[\p{L}·]+/gu, (word) => {
      const esc = (str) => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      let tooltipContent = Object.entries(languages)
        .map(([code, name]) => `<b>${name}:</b> ${esc(entry[code] || '')}`)
        .join('<br>');
      tooltipContent += `<br><b>Definition:</b> ${esc(entry.definition || '')}`;
      
      return `<span class="word" data-word="${esc(word)}">
                ${esc(word)}
                <span class="tooltip">
                  ${tooltipContent}
>>>>>>> 4aa905a1cd5f771492d63220e3e210384227f68d
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
<<<<<<< HEAD
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
=======
    document.querySelectorAll('.word.active').forEach((w) => { if (w !== clickedWord) w.classList.remove('active'); });
    if (clickedWord) clickedWord.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word')) document.querySelectorAll('.word.active').forEach((w) => w.classList.remove('active'));
  }, true);

  const langSelect = document.createElement('select');
  langSelect.id = 'languageSelector';
  langSelect.className = 'language-select';
  
  // Add language options
  const defaultOption = document.createElement('option');
  defaultOption.value = 'zh';
  defaultOption.textContent = 'Chinese (Original)';
  langSelect.appendChild(defaultOption);
  
  Object.entries(languages).forEach(([code, name]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    langSelect.appendChild(option);
  });
  
  // Insert the language selector before the first translation box
  document.querySelector('.translator-container').insertAdjacentElement('beforebegin', langSelect);
  
  // Handle language changes
  langSelect.addEventListener('change', () => {
    const selectedLang = langSelect.value;
    
    document.querySelectorAll('.translatable').forEach((el) => {
      const text = selectedLang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute(`data-${selectedLang}`);
      if (!text) return;
      
      if (selectedLang === 'zh') {
        const entry = rawData[text];
        if (!entry) return;
        
        const newHTML = text.replace(/[\p{L}·]+/gu, (word) => {
          const esc = (str) => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          let tooltipContent = Object.entries(languages)
            .map(([code, name]) => `<b>${name}:</b> ${esc(entry[code] || '')}`)
            .join('<br>');
          tooltipContent += `<br><b>Definition:</b> ${esc(entry.definition || '')}`;
          
          return `<span class="word" data-word="${esc(word)}">
                    ${esc(word)}
                    <span class="tooltip">
                      ${tooltipContent}
                    </span>
                  </span>`;
        });
        el.innerHTML = newHTML;
      } else {
        el.textContent = text;
      }
    });
>>>>>>> 4aa905a1cd5f771492d63220e3e210384227f68d
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
