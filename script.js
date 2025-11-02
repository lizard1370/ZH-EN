(async function () {
  const res = await fetch('./data/translations.json');
  if (!res.ok) return;
  const rawData = await res.json();

  document.querySelectorAll('.translatable').forEach((el) => {
    const text = el.textContent.trim();
    const entry = rawData[text];
    if (!entry) return;

    el.setAttribute('data-zh', text);
    el.setAttribute('data-en', entry.english);

    const newHTML = text.replace(/[\p{L}·]+/gu, (word) => {
      const esc = (str) => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      return `<span class="word" data-word="${esc(word)}">
                ${esc(word)}
                <span class="tooltip">
                  <b>English:</b> ${esc(entry.english)}<br>
                  <b>Definition:</b> ${esc(entry.definition || '')}
                </span>
              </span>`;
    });
    el.innerHTML = newHTML;
  });

  document.addEventListener('click', (e) => {
    const clickedWord = e.target.closest('.word');
    document.querySelectorAll('.word.active').forEach((w) => { if (w !== clickedWord) w.classList.remove('active'); });
    if (clickedWord) clickedWord.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word')) document.querySelectorAll('.word.active').forEach((w) => w.classList.remove('active'));
  }, true);

  const btn = document.getElementById('toggleLangBtn');
  let showEnglish = false;

  btn.addEventListener('click', () => {
    showEnglish = !showEnglish;
    btn.classList.toggle('active', showEnglish);

    document.querySelectorAll('.translatable').forEach((el) => {
      el.textContent = showEnglish ? el.getAttribute('data-en') : el.getAttribute('data-zh');
    });

    if (!showEnglish) {
      document.querySelectorAll('.translatable').forEach((el) => {
        const text = el.textContent.trim();
        const entry = rawData[text];
        if (!entry) return;

        const newHTML = text.replace(/[\p{L}·]+/gu, (word) => {
          const esc = (str) => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return `<span class="word" data-word="${esc(word)}">
                    ${esc(word)}
                    <span class="tooltip">
                      <b>English:</b> ${esc(entry.english)}<br>
                      <b>Definition:</b> ${esc(entry.definition || '')}
                    </span>
                  </span>`;
        });
        el.innerHTML = newHTML;
      });
    }
  });
})();
