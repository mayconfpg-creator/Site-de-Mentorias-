/* ==========================================================================
   PLATAFORMA PREMIUM DE MENTORIAS VIP — DÉBORAH LOURES
   LÓGICA PRINCIPAL DO CLIENTE (APP.JS)
   ========================================================================== */

let allMentorias = [];
let activeCategory = 'Todas';
let searchTerm = '';
let currentSelectedMentoria = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadMentorias();
    setupEventListeners();
    setupRoiSimulator();
});

// Carregamento de Mentorias do Supabase
async function loadMentorias() {
    const gridEl = document.getElementById('mentoriasGrid');
    if (!gridEl) return;
    
    gridEl.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top: 10px;">Carregando formações VIP...</p></div>';
    
    try {
        allMentorias = await window.MentoriaDB.getMentorias();
        renderMentorias();
        renderCategoryFilters();
    } catch (e) {
        console.error('Erro ao carregar mentorias:', e);
        gridEl.innerHTML = '<p style="text-align: center; color: red;">Erro ao carregar formações. Tente recarregar a página.</p>';
    }
}

// Renderização Dinâmica dos Filtros de Categoria
function renderCategoryFilters() {
    const filterContainer = document.getElementById('categoryPills');
    if (!filterContainer) return;
    
    const categories = ['Todas', ...new Set(allMentorias.map(m => m.categoria))];
    
    filterContainer.innerHTML = categories.map(cat => `
        <button class="cat-pill ${cat === activeCategory ? 'active' : ''}" onclick="setCategory('${cat}')">
            ${cat === 'Todas' ? '<i class="fa-solid fa-layer-group"></i>' : ''} ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategoryFilters();
    renderMentorias();
}

// Renderização dos Cards de Mentoria
function renderMentorias() {
    const gridEl = document.getElementById('mentoriasGrid');
    if (!gridEl) return;
    
    const filtered = allMentorias.filter(m => {
        const matchesCat = activeCategory === 'Todas' || m.categoria === activeCategory;
        const matchesSearch = !searchTerm || 
            m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (m.subtitulo && m.subtitulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (m.publico_alvo && m.publico_alvo.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        gridEl.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted); background: #FFF; border-radius: 16px; border: 1px dashed var(--border-soft);"><i class="fa-solid fa-magnifying-glass fa-2x" style="color: var(--primary);"></i><h3 style="margin-top: 10px; color: var(--text-dark);">Nenhuma mentoria encontrada</h3><p>Tente buscar por outro termo ou categoria.</p></div>';
        return;
    }

    gridEl.innerHTML = filtered.map(m => {
        const modulosQtd = m.mentoria_modulos ? m.mentoria_modulos.length : 0;
        const bonusQtd = m.mentoria_bonus ? m.mentoria_bonus.length : 0;
        const precoPixFmt = Number(m.preco_pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const parcelaFmt = Number(m.parcelas_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return `
            <div class="mentoria-card ${m.destaque ? 'featured-card' : ''}" id="card-${m.slug}">
                <div>
                    <div class="card-top-row">
                        <span class="card-badge" style="background: rgba(184, 151, 108, 0.15); color: var(--primary-dark);">
                            <i class="fa-solid ${m.icone || 'fa-gem'}"></i> ${m.badge_tag || m.categoria}
                        </span>
                        <span class="card-duration">
                            <i class="fa-regular fa-clock"></i> ${m.duracao_dias} ${m.duracao_dias === 1 ? 'Dia' : 'Dias'} (${m.duracao_horas}h)
                        </span>
                    </div>

                    <h3 class="card-title">${m.titulo}</h3>
                    <p class="card-subtitle">${m.subtitulo || ''}</p>

                    <div class="card-highlights-box">
                        <strong>🎯 Para quem é:</strong> ${m.publico_alvo ? m.publico_alvo.substring(0, 110) + '...' : 'Profissionais da estética.'}
                    </div>

                    <div style="display: flex; gap: 10px; margin-bottom: 16px; font-size: 11.5px; color: var(--text-muted);">
                        <span><i class="fa-solid fa-list-check" style="color: var(--primary);"></i> ${modulosQtd} Tópicos Práticos</span>
                        <span><i class="fa-solid fa-gift" style="color: var(--primary);"></i> ${bonusQtd} ${bonusQtd === 1 ? 'Bônus VIP' : 'Bônus VIPs'}</span>
                    </div>
                </div>

                <div>
                    <div class="card-pricing-box">
                        <div class="price-pix-row">
                            <span class="price-pix-val">${precoPixFmt}</span>
                            <span class="price-pix-tag"><i class="fa-solid fa-bolt"></i> PIX à vista</span>
                        </div>
                        <div class="price-installments-row">
                            ou ${m.parcelas_qtd || 10}x de <span>${parcelaFmt}</span> no cartão
                        </div>
                    </div>

                    <div class="card-actions-grid">
                        <button class="btn-card-details" onclick="openDetailsModal('${m.id}')">
                            <i class="fa-solid fa-eye"></i> Ver Ementa
                        </button>
                        <button class="btn-card-lead" onclick="openLeadModal('${m.id}')">
                            <i class="fa-brands fa-whatsapp"></i> Garantir Vaga
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Configuração de Eventos
function setupEventListeners() {
    const searchInput = document.getElementById('searchMentoria');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            renderMentorias();
        });
    }

    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', handleLeadSubmit);
    }
}

// Modal de Detalhes da Mentoria
function openDetailsModal(id) {
    const m = allMentorias.find(item => item.id === id);
    if (!m) return;

    currentSelectedMentoria = m;
    const modalBody = document.getElementById('detailsModalBody');
    const modalTitle = document.getElementById('detailsModalTitle');
    
    if (modalTitle) modalTitle.innerText = m.titulo;

    const modulosHtml = (m.mentoria_modulos || []).map((mod, idx) => `
        <div style="background: var(--bg-sand); border: 1px solid var(--border-soft); border-radius: 8px; padding: 12px 14px; margin-bottom: 8px;">
            <strong style="color: var(--primary-dark); font-size: 13px; display: block; margin-bottom: 2px;">
                ${idx + 1}. ${mod.titulo}
            </strong>
            <p style="font-size: 12px; color: var(--text-dark); margin: 0; line-height: 1.45;">${mod.descricao}</p>
        </div>
    `).join('');

    const bonusHtml = (m.mentoria_bonus || []).map(b => `
        <div style="background: linear-gradient(135deg, #FCFBF9, #F6EFE6); border: 1.5px solid var(--accent-gold); border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;">
            <strong style="color: var(--text-dark); font-size: 13px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-gift" style="color: var(--primary);"></i> ${b.titulo}
            </strong>
            <p style="font-size: 12px; color: var(--text-dark); margin-top: 4px; line-height: 1.4;">${b.descricao}</p>
        </div>
    `).join('');

    const precoPixFmt = Number(m.preco_pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const parcelaFmt = Number(m.parcelas_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (modalBody) {
        modalBody.innerHTML = `
            <div style="margin-bottom: 18px;">
                <span class="card-duration" style="margin-bottom: 10px;">
                    <i class="fa-regular fa-clock"></i> Carga Horária: ${m.duracao_dias} ${m.duracao_dias === 1 ? 'Dia' : 'Dias'} (${m.duracao_horas}h de prática individual)
                </span>
                <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5; margin-top: 8px;">${m.subtitulo || ''}</p>
            </div>

            <div style="background: #FDF9F3; border-left: 4px solid var(--primary); padding: 12px 14px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                <strong style="color: var(--primary-dark); font-size: 12.5px; display: block; margin-bottom: 2px;">🎯 Público-Alvo:</strong>
                <p style="font-size: 12.5px; color: var(--text-dark); margin: 0;">${m.publico_alvo || ''}</p>
            </div>

            <h4 style="font-size: 14px; color: var(--text-dark); font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-book-open" style="color: var(--primary);"></i> Grade Curricular & Conteúdo Prático:
            </h4>
            <div style="margin-bottom: 20px;">
                ${modulosHtml || '<p style="font-size: 12px; color: var(--text-muted);">Módulos sob consulta.</p>'}
            </div>

            ${bonusHtml ? `
                <h4 style="font-size: 14px; color: var(--text-dark); font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-star" style="color: var(--primary);"></i> Bônus Inclusos:
                </h4>
                <div style="margin-bottom: 20px;">${bonusHtml}</div>
            ` : ''}

            <div style="background: var(--bg-dark); color: #FFF; border-radius: 14px; padding: 20px; border: 1.5px solid var(--accent-gold); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--primary-light); font-weight: 800;">Valor da Mentoria</div>
                        <div style="font-size: 28px; font-weight: 800; color: #FFF;">${precoPixFmt} <span style="font-size: 12px; color: #86EFAC; font-weight: 700;">no PIX</span></div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12.5px; color: #E2DBD5;">ou ${m.parcelas_qtd || 10}x de <strong style="color: var(--primary-light); font-size: 16px;">${parcelaFmt}</strong></div>
                    </div>
                </div>
                ${m.roi_descricao ? `
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; font-size: 12px; color: #D6CCC2; display: flex; align-items: flex-start; gap: 6px;">
                        <i class="fa-solid fa-calculator" style="color: var(--primary-light); margin-top: 2px;"></i>
                        <span><strong>Retorno Rápido:</strong> ${m.roi_descricao}</span>
                    </div>
                ` : ''}
            </div>

            <button class="btn-submit-primary" onclick="closeModal('detailsModal'); openLeadModal('${m.id}')">
                <i class="fa-brands fa-whatsapp"></i> Quero Garantir Minha Vaga Nesta Mentoria
            </button>
        `;
    }

    openModal('detailsModal');
}

// Modal de Captura de Lead
function openLeadModal(id) {
    const m = allMentorias.find(item => item.id === id) || allMentorias[0];
    currentSelectedMentoria = m;
    
    const leadCourseSelect = document.getElementById('leadCourse');
    if (leadCourseSelect) {
        leadCourseSelect.innerHTML = allMentorias.map(item => `
            <option value="${item.id}" ${item.id === m.id ? 'selected' : ''}>${item.titulo}</option>
        `).join('');
    }

    openModal('leadModal');
}

// Envio do Lead & Redirecionamento para o WhatsApp
async function handleLeadSubmit(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnSubmitLead');
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    }

    const nome = document.getElementById('leadName').value.trim();
    const whatsapp = document.getElementById('leadWhatsapp').value.trim();
    const mentoriaId = document.getElementById('leadCourse').value;
    const duvida = document.getElementById('leadMessage').value.trim();

    const selectedM = allMentorias.find(item => item.id === mentoriaId) || currentSelectedMentoria;

    const leadPayload = {
        nome,
        whatsapp,
        mentoria_id: selectedM ? selectedM.id : null,
        mentoria_nome: selectedM ? selectedM.titulo : 'Mentoria Geral',
        mensagem: duvida,
        status: 'novo',
        origem: 'site_mentoria_v2'
    };

    // Salva no Supabase
    await window.MentoriaDB.saveLead(leadPayload);

    showToast('Inscrição enviada com sucesso! Redirecionando...');

    // Mensagem formatada para o WhatsApp
    const msgText = encodeURIComponent(
        `Olá Profa. Déborah Loures! Meu nome é ${nome}. Tenho interesse na *${selectedM ? selectedM.titulo : 'Mentoria VIP'}*! ${duvida ? 'Minha dúvida: ' + duvida : 'Gostaria de agendar minha data.'}`
    );

    const waUrl = `https://wa.me/5562991501876?text=${msgText}`;

    setTimeout(() => {
        closeModal('leadModal');
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Falar Direto com a Déborah Loures';
        }
        window.open(waUrl, '_blank');
    }, 800);
}

// Simulador de Faturamento
function setupRoiSimulator() {
    const slider = document.getElementById('simSlider');
    const sliderVal = document.getElementById('simSliderVal');
    const simRevenue = document.getElementById('simRevenue');
    const simProfit = document.getElementById('simProfit');
    const simBreakeven = document.getElementById('simBreakeven');

    if (!slider) return;

    function updateSimulation() {
        const clientsPerWeek = parseInt(slider.value);
        if (sliderVal) sliderVal.innerText = `${clientsPerWeek} cliente${clientsPerWeek > 1 ? 's' : ''}/semana (${clientsPerWeek * 4}/mês)`;

        const ticketMedio = 220; // Médio entre limpeza avançada e microagulhamento
        const custoInsumo = 25;
        const totalMensal = clientsPerWeek * 4 * ticketMedio;
        const lucroLiquido = clientsPerWeek * 4 * (ticketMedio - custoInsumo);

        if (simRevenue) simRevenue.innerText = totalMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (simProfit) simProfit.innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let diasRetorno = 'Em menos de 10 dias';
        if (clientsPerWeek === 1) diasRetorno = 'Em aprox. 30 dias';
        else if (clientsPerWeek === 2) diasRetorno = 'Em aprox. 18 dias';
        else if (clientsPerWeek >= 3 && clientsPerWeek <= 5) diasRetorno = 'Em 10 a 14 dias';
        else diasRetorno = 'Em menos de 7 dias';

        if (simBreakeven) simBreakeven.innerText = diasRetorno;
    }

    slider.addEventListener('input', updateSimulation);
    updateSimulation();
}

// Helpers de Modal & Toast
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

function showToast(msg) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #86EFAC;"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

window.openDetailsModal = openDetailsModal;
window.openLeadModal = openLeadModal;
window.openModal = openModal;
window.closeModal = closeModal;
window.setCategory = setCategory;
window.showToast = showToast;

