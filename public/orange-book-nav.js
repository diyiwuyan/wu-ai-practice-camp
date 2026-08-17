(() => {
  const books = [
    { code: 'WPS', title: 'WPS AI 橙皮书', detail: '8 个项目 · 12 张任务卡', meta: '本站新版', href: '/wps-ai-orange-book/', current: true },
    { code: 'WB', title: 'WorkBuddy 橙皮书', detail: 'WorkBuddy 实战使用指南', meta: 'GitHub Pages ↗', href: 'https://diyiwuyan.github.io/workbuddy-orange-book/', external: true },
    { code: 'CX', title: 'Codex 橙皮书', detail: '从安装到实战案例', meta: 'GitHub Pages ↗', href: 'https://diyiwuyan.github.io/codex-orange-book/', external: true },
    { code: 'DSH', title: 'DeepSeek Harness 橙皮书', detail: '安装、模式、插件与实战案例', meta: '飞书手册 ↗', href: 'https://guowang888.feishu.cn/wiki/VXE1wvSfZiyheskHLgic15BAnZ2', external: true },
  ];

  function buildMenu() {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.querySelector('.orange-book-nav')) return;
    const knowledge = [...nav.querySelectorAll('a')].find((link) => link.textContent.trim() === '知识库');
    if (!knowledge) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'orange-book-nav';
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '橙皮书系列 <span>⌄</span>';
    const menu = document.createElement('div');
    menu.className = 'orange-book-menu';
    menu.setAttribute('role', 'menu');
    books.forEach((book) => {
      const link = document.createElement('a');
      link.className = `orange-book-menu-item${book.current ? ' current' : ''}`;
      link.href = book.href;
      link.setAttribute('role', 'menuitem');
      if (book.external) { link.target = '_blank'; link.rel = 'noreferrer'; }
      link.innerHTML = `<i>${book.code}</i><span><b>${book.title}</b><small>${book.detail}</small></span><em>${book.meta}</em>`;
      menu.appendChild(link);
    });
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = wrapper.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
    wrapper.addEventListener('mouseleave', () => { wrapper.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('click', (event) => { if (!wrapper.contains(event.target)) { wrapper.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); } });
    wrapper.append(button, menu);
    nav.insertBefore(wrapper, knowledge);
  }

  buildMenu();
  const observer = new MutationObserver(buildMenu);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
