(() => {
  'use strict';
  const progress = document.getElementById('reading-progress');
  const back = document.getElementById('back-to-top');
  let scrollQueued = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${Math.min(100, Math.max(0, max > 0 ? window.scrollY / max * 100 : 0))}%`;
    back.classList.toggle('visible', window.scrollY > 700);
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive:true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  back.addEventListener('click', () => window.scrollTo({ top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle.addEventListener('click', () => {
    const opened = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opened));
    mobileMenu.hidden = !opened;
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileMenu.hidden = true; menuToggle.setAttribute('aria-expanded','false'); }));
  const tokenTabs = [...document.querySelectorAll('[data-token]')];
  const tokenTitle = document.getElementById('token-title');
  const tokenDescription = document.getElementById('token-description');
  const coinContainer = document.getElementById('token-coins');
  const tokenPanel = document.getElementById('panel-token');
  const tokenData = {
    nft: ['Три разных цифровых объекта','Каждый токен имеет уникальный идентификатор. Токен №01 не равнозначен токену №02: за ними могут стоять разные метаданные и права.'],
    fungible: ['Три равноценных единицы','Взаимозаменяемые токены одного вида эквивалентны друг другу: одну единицу можно заменить другой без изменения её функционального значения.']
  };
  tokenTabs.forEach(tab => tab.addEventListener('click', () => {
    const key = tab.dataset.token;
    tokenTabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
    tokenTitle.textContent = tokenData[key][0]; tokenDescription.textContent = tokenData[key][1];
    coinContainer.classList.toggle('fungible', key === 'fungible');
    coinContainer.querySelectorAll('span').forEach((node, i) => { node.textContent = key === 'fungible' ? '●' : `0${i+1}`; });
    tokenPanel.setAttribute('aria-labelledby', tab.id);
  }));
  const stepData = [
    ['Создаётся цифровой объект','Автор или организация готовит объект и метаданные: название, описание, ссылку на содержимое и сведения об эмитенте. Истинность исходных данных проверяется вне блокчейна.'],
    ['Смарт-контракт выпускает токен','Выпуск, или minting, создаёт уникальную запись. Смарт-контракт определяет разрешённые операции, а сеть фиксирует подтверждённую транзакцию.'],
    ['Токен хранится под контролем владельца','Пользователь управляет цифровым адресом с помощью ключей и кошелька. Файл, на который указывают метаданные NFT, может храниться отдельно от блокчейна.'],
    ['Запись проверяют или передают','Совместимое приложение может проверить идентификатор токена, его владельца и историю операций. Передача токена не обязательно означает передачу авторских прав.']
  ];
  const stepButtons = [...document.querySelectorAll('.step-button')];
  stepButtons.forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.step);
    stepButtons.forEach(b => { b.classList.toggle('active', b===btn); b.setAttribute('aria-pressed',String(b===btn)); });
    document.getElementById('step-count').textContent = String(i+1).padStart(2,'0');
    document.getElementById('step-title').textContent = stepData[i][0];
    document.getElementById('step-text').textContent = stepData[i][1];
  }));
  stepButtons[0].setAttribute('aria-pressed','true');
  const choices = [...document.querySelectorAll('.quiz-options button')];
  const feedback = document.getElementById('quiz-feedback');
  choices.forEach(choice => choice.addEventListener('click', () => {
    choices.forEach(c=>c.classList.remove('correct','incorrect'));
    const ok = choice.dataset.correct === 'true';
    choice.classList.add(ok ? 'correct' : 'incorrect');
    feedback.textContent = ok ? 'Верно! Общий проверяемый реестр особенно полезен независимым участникам, которым нужен согласованный механизм учёта.' : 'Не совсем. Подумайте, когда участникам особенно важно подтверждать операции без единого доверенного оператора.';
  }));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealNodes = [...document.querySelectorAll('.story-body h2,.story-body h3,.research-card,.toc-list a,.feature-title,.conclusion-item')];
    revealNodes.forEach(el=>el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);} }), {threshold:.06,rootMargin:'0px 0px 65px 0px'});
    revealNodes.forEach(node=>observer.observe(node));
  }
})();
