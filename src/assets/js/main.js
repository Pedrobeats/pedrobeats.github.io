// main.js - Interações leves para o site

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Mobile Toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('nav-open');
            document.body.classList.toggle('menu-open');
        });

        // Fechar ao clicar em um link
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
            });
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!primaryNav.contains(e.target) && !mobileToggle.contains(e.target) && primaryNav.classList.contains('nav-open')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // 2. Sombra suave no Header ao rolar
    const header = document.querySelector('.site-header');
    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 15) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // 3. Botão de Copiar Código em blocos de pre/code
    const codeBlocks = document.querySelectorAll('.article-content pre');
    codeBlocks.forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.setAttribute('aria-label', 'Copiar código');
        copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copiar</span>
        `;

        copyBtn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const textToCopy = code ? code.innerText : pre.innerText;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copiado!</span>
                `;
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copiar</span>
                    `;
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar código:', err);
            }
        });

        wrapper.appendChild(copyBtn);
    });
});
