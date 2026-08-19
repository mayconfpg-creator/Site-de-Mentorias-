/* ==========================================================================
   PLATAFORMA PREMIUM DE MENTORIAS VIP — DÉBORAH LOURES
   STUDIO ADMINISTRATIVO VIP & LIVE PREVIEW CMS (ADMIN-DASHBOARD.JS)
   ========================================================================== */

let adminMentorias = [];
let adminLeads = [];
let currentStudioStep = 1;

// Lista de credenciais válidas para o Administrador
const VALID_CREDENTIALS = [
    { email: 'mayconfg3569@gmail.com', pass: '3569Proview@#' },
    { email: 'admin', pass: '3569Proview@#' },
    { email: 'admin', pass: '1876' }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
});

// Verificação de Sessão do Admin
function checkAdminSession() {
    const isAuth = sessionStorage.getItem('vip_admin_auth') === 'true';
    if (isAuth) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    loadDashboardData();
}

// Manipulador de Login
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();

    const isMatch = (user === 'mayconfg3569@gmail.com' || user === 'admin') && 
                    (pass === '3569Proview@#' || pass === '1876');

    if (isMatch) {
        sessionStorage.setItem('vip_admin_auth', 'true');
        sessionStorage.setItem('vip_admin_user', user || 'mayconfg3569@gmail.com');
        showToast('Bem-vindo ao Studio VIP!');
        showDashboard();
    } else {
        alert('❌ Usuário ou senha incorretos! Verifique os dados digitados.');
    }
}

// Manipulador de Logout
function handleAdminLogout() {
    if (confirm('Deseja realmente sair do Studio?')) {
        sessionStorage.removeItem('vip_admin_auth');
        sessionStorage.removeItem('vip_admin_user');
        showToast('Você saiu do painel.');
        showLogin();
    }
}

// Alternador de Abas Principais
function switchDashboardTab(tabName) {
    document.querySelectorAll('.admin-tab-pane').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetPane = document.getElementById(`pane-${tabName}`);
    if (targetPane) targetPane.style.display = 'block';

    const targetBtn = document.getElementById(`tabBtn-${tabName}`);
    if (targetBtn) targetBtn.classList.add('active');

    if (tabName === 'mentorias') renderDashboardMentorias();
    if (tabName === 'leads') renderDashboardLeads();
}

// Carregamento Geral dos Dados do Supabase
async function loadDashboardData() {
    try {
        adminMentorias = await window.MentoriaDB.getAllMentoriasAdmin();
        adminLeads = await window.MentoriaDB.getLeads();

        renderDashboardMentorias();
        renderDashboardLeads();
    } catch (e) {
        console.error('Erro ao carregar dados do dashboard:', e);
    }
}

// ==========================================================================
// SEÇÃO DE MENTORIAS (LISTAGEM & QUICK ACTIONS)
// ==========================================================================

function renderDashboardMentorias() {
    const tbody = document.getElementById('dashMentoriasTbody');
    if (!tbody) return;

    if (!adminMentorias || adminMentorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 25px; color: var(--text-muted);">Nenhuma formação cadastrada ainda.</td></tr>';
        return;
    }

    tbody.innerHTML = adminMentorias.map(m => {
        const precoPixFmt = Number(m.preco_pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const parcelaFmt = Number(m.parcelas_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return `
            <tr>
                <td>
                    <strong style="color: #FFF; font-size: 13.5px;"><i class="fa-solid ${m.icone || 'fa-gem'}" style="color: var(--primary); margin-right: 6px;"></i> ${m.titulo}</strong>
                    <div style="font-size: 11px; color: var(--text-muted);">${m.slug}</div>
                </td>
                <td><span style="background: rgba(184, 151, 108, 0.15); color: var(--primary-light); padding: 3px 8px; border-radius: 4px; font-size: 11px;">${m.categoria}</span></td>
                <td>${m.duracao_dias}d (${m.duracao_horas}h)</td>
                <td><strong style="color: #86EFAC;">${precoPixFmt}</strong></td>
                <td>${m.parcelas_qtd || 10}x ${parcelaFmt}</td>
                <td>
                    <span class="status-tag ${m.ativo ? 'status-fechado' : 'status-atendimento'}">
                        ${m.ativo ? 'Ativa' : 'Pausada'}
                    </span>
                </td>
                <td>
                    <button onclick="editMentoriaInStudio('${m.id}')" title="Abrir no Studio VIP" style="background: linear-gradient(135deg, #DFC8A8, #B8976C); color: #12100E; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11.5px; font-weight: 800; margin-right: 4px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Editar no Studio
                    </button>
                    <button onclick="toggleMentoria('${m.id}', ${!m.ativo})" title="${m.ativo ? 'Pausar' : 'Ativar'}" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255,255,255,0.15); color: ${m.ativo ? '#FBBF24' : '#86EFAC'}; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11.5px; margin-right: 4px;">
                        <i class="fa-solid ${m.ativo ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button onclick="deleteMentoriaConfirm('${m.id}', '${m.titulo}')" title="Excluir" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239,68,68,0.3); color: #F87171; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11.5px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================================================
// STUDIO VIP — CONTROLES & WIZARD INTELIGENTE
// ==========================================================================

let currentPreviewMode = 'card';

function setPreviewMode(mode) {
    currentPreviewMode = mode;
    const cardEl = document.getElementById('previewCardContainer');
    const modalEl = document.getElementById('previewModalContainer');
    const btnCard = document.getElementById('btnPrevCard');
    const btnModal = document.getElementById('btnPrevModal');

    if (mode === 'modal') {
        if (cardEl) cardEl.style.display = 'none';
        if (modalEl) modalEl.style.display = 'block';
        if (btnCard) btnCard.classList.remove('active');
        if (btnModal) btnModal.classList.add('active');
    } else {
        if (cardEl) cardEl.style.display = 'block';
        if (modalEl) modalEl.style.display = 'none';
        if (btnCard) btnCard.classList.add('active');
        if (btnModal) btnModal.classList.remove('active');
    }
    updateLivePreview();
}

function goToStudioStep(step) {
    currentStudioStep = step;
    document.querySelectorAll('.studio-step-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.studio-step-btn').forEach(btn => btn.classList.remove('active'));

    const section = document.getElementById(`studioStep-${step}`);
    if (section) section.classList.add('active');

    const btn = document.getElementById(`stepBtn-${step}`);
    if (btn) btn.classList.add('active');

    // Troca inteligente da prévia em tempo real:
    // Passos 1, 2 e 3 -> Card Preview
    // Passo 4 (Grade & Bônus) -> Ementa Completa Preview
    if (step === 4) {
        setPreviewMode('modal');
    } else {
        setPreviewMode('card');
    }
}

// Seleção de Chip de Categoria
function selectCategoryChip(cat) {
    const hiddenCat = document.getElementById('studioCategoriaVal');
    const customInput = document.getElementById('studioCustomCategory');
    
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('selected'));
    
    if (cat === 'Outra') {
        customInput.style.display = 'block';
        customInput.focus();
        hiddenCat.value = customInput.value || 'Personalizada';
    } else {
        customInput.style.display = 'none';
        hiddenCat.value = cat;
    }

    event.target.classList.add('selected');
    updateLivePreview();
}

// Seleção de Ícone
function selectStudioIcon(iconName) {
    document.getElementById('studioIconeVal').value = iconName;
    document.querySelectorAll('.icon-opt-btn').forEach(b => b.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    updateLivePreview();
}

// Seleção de Duração
function selectDurationPreset(dias, horas) {
    document.getElementById('studioDuracaoDias').value = dias;
    document.getElementById('studioDuracaoHoras').value = horas;

    document.querySelectorAll('.duration-pick-card').forEach(c => c.classList.remove('selected'));
    if (dias === 1) document.getElementById('durCard-1').classList.add('selected');
    if (dias === 2) document.getElementById('durCard-2').classList.add('selected');

    updateLivePreview();
}

// Cálculo Automático de Parcelas
function autoCalculateInstallments() {
    const pixVal = parseFloat(document.getElementById('studioPrecoPix').value) || 0;
    const parcelasQtd = parseInt(document.getElementById('studioParcelasQtd').value) || 10;
    
    // Acréscimo padrão de 10% para cartão
    const totalCartao = pixVal * 1.10;
    const valorParcela = totalCartao / parcelasQtd;

    document.getElementById('studioPrecoCartao').value = totalCartao.toFixed(2);
    document.getElementById('studioParcelasValor').value = valorParcela.toFixed(2);

    updateLivePreview();
}

// Atualização da Prévia em Tempo Real (Live Preview Reactivity Completa)
function updateLivePreview() {
    const titulo = document.getElementById('studioTitulo')?.value.trim() || 'Nome da Mentoria';
    const subtitulo = document.getElementById('studioSubtitulo')?.value.trim() || 'Subtítulo do curso e diferencial exclusivo.';
    const publico = document.getElementById('studioPublicoAlvo')?.value.trim() || 'Iniciantes ou profissionais que buscam excelência.';
    const customCat = document.getElementById('studioCustomCategory');
    const categoria = customCat && customCat.style.display !== 'none' && customCat.value.trim()
        ? customCat.value.trim()
        : (document.getElementById('studioCategoriaVal')?.value || 'Formação Base');
    const icone = document.getElementById('studioIconeVal')?.value || 'fa-gem';
    
    const dias = parseInt(document.getElementById('studioDuracaoDias')?.value) || 1;
    const horas = parseInt(document.getElementById('studioDuracaoHoras')?.value) || 8;

    const precoPix = parseFloat(document.getElementById('studioPrecoPix')?.value) || 0;
    const parcelasQtd = parseInt(document.getElementById('studioParcelasQtd')?.value) || 10;
    const parcelasValor = parseFloat(document.getElementById('studioParcelasValor')?.value) || 0;
    const roi = document.getElementById('studioRoiDescricao')?.value.trim() || 'Recuperação rápida do investimento com poucos atendimentos.';

    // Coleta módulos
    const modEls = document.querySelectorAll('#studioModulosContainer .module-item-studio');
    const modulosList = Array.from(modEls).map((el, idx) => ({
        num: idx + 1,
        titulo: el.querySelector('.mod-titulo')?.value.trim() || `Módulo ${idx + 1}`,
        desc: el.querySelector('.mod-desc')?.value.trim() || ''
    }));

    // Coleta bônus
    const bonusEls = document.querySelectorAll('#studioBonusContainer .bonus-item-studio');
    const bonusList = Array.from(bonusEls).map((el, idx) => ({
        num: idx + 1,
        titulo: el.querySelector('.bonus-titulo')?.value.trim() || `Bônus VIP ${idx + 1}`,
        desc: el.querySelector('.bonus-desc')?.value.trim() || ''
    }));

    // 1. Atualiza Card Preview
    const prevTitle = document.getElementById('prevTitle');
    if (prevTitle) prevTitle.innerText = titulo;

    const prevSub = document.getElementById('prevSubtitle');
    if (prevSub) prevSub.innerText = subtitulo;

    const prevPub = document.getElementById('prevPublico');
    if (prevPub) prevPub.innerText = publico.length > 80 ? publico.substring(0, 80) + '...' : publico;

    const prevCat = document.getElementById('prevCategory');
    if (prevCat) prevCat.innerText = categoria;

    const prevIcon = document.getElementById('prevIcon');
    if (prevIcon) prevIcon.className = `fa-solid ${icone}`;

    const prevDur = document.getElementById('prevDuration');
    if (prevDur) prevDur.innerHTML = `<i class="fa-regular fa-clock"></i> ${dias} ${dias === 1 ? 'Dia' : 'Dias'} (${horas}h)`;

    const prevPricePix = document.getElementById('prevPricePix');
    if (prevPricePix) prevPricePix.innerText = precoPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const prevPriceInst = document.getElementById('prevPriceInstallments');
    if (prevPriceInst) prevPriceInst.innerHTML = `ou ${parcelasQtd}x de <strong style="color: var(--primary-light);">${parcelasValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> no cartão`;

    const prevModCount = document.getElementById('prevModCount');
    if (prevModCount) prevModCount.innerText = modulosList.length;

    const prevBonusCount = document.getElementById('prevBonusCount');
    if (prevBonusCount) prevBonusCount.innerText = bonusList.length;

    // 2. Atualiza Modal / Ementa Preview
    const prevModalTitle = document.getElementById('prevModalTitle');
    if (prevModalTitle) prevModalTitle.innerText = titulo;

    const prevModalSub = document.getElementById('prevModalSubtitle');
    if (prevModalSub) prevModalSub.innerText = subtitulo;

    const prevModalPub = document.getElementById('prevModalPublico');
    if (prevModalPub) prevModalPub.innerText = publico;

    const prevModalCat = document.getElementById('prevModalCategory');
    if (prevModalCat) prevModalCat.innerText = categoria;

    const prevModalIco = document.getElementById('prevModalIcon');
    if (prevModalIco) prevModalIco.className = `fa-solid ${icone}`;

    const prevModalDur = document.getElementById('prevModalDuration');
    if (prevModalDur) prevModalDur.innerHTML = `<i class="fa-regular fa-clock"></i> ${dias} ${dias === 1 ? 'Dia' : 'Dias'} (${horas}h de prática)`;

    const prevModalPix = document.getElementById('prevModalPricePix');
    if (prevModalPix) prevModalPix.innerText = precoPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const prevModalInst = document.getElementById('prevModalPriceInstallments');
    if (prevModalInst) prevModalInst.innerText = `ou ${parcelasQtd}x de ${parcelasValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no cartão`;

    const prevModalRoi = document.getElementById('prevModalRoi');
    if (prevModalRoi) prevModalRoi.innerHTML = `<strong>Retorno Rápido:</strong> ${roi}`;

    // Renderiza lista de módulos na ementa
    const prevModalMods = document.getElementById('prevModalModulosList');
    if (prevModalMods) {
        if (modulosList.length === 0) {
            prevModalMods.innerHTML = '<p style="font-size: 11px; color: var(--text-muted);">Nenhum módulo adicionado ainda.</p>';
        } else {
            prevModalMods.innerHTML = modulosList.map(m => `
                <div style="background: var(--bg-sand); border: 1px solid var(--border-soft); border-radius: 6px; padding: 7px 9px; margin-bottom: 5px;">
                    <strong style="color: var(--primary-dark); font-size: 11.5px; display: block;">${m.num}. ${m.titulo}</strong>
                    ${m.desc ? `<p style="font-size: 11px; color: var(--text-dark); margin: 0; line-height: 1.35;">${m.desc}</p>` : ''}
                </div>
            `).join('');
        }
    }

    // Renderiza lista de bônus na ementa
    const prevModalBons = document.getElementById('prevModalBonusList');
    if (prevModalBons) {
        if (bonusList.length === 0) {
            prevModalBons.innerHTML = '<p style="font-size: 11px; color: var(--text-muted);">Nenhum bônus adicionado.</p>';
        } else {
            prevModalBons.innerHTML = bonusList.map(b => `
                <div style="background: linear-gradient(135deg, #FCFBF9, #F6EFE6); border: 1px solid var(--accent-gold); border-radius: 6px; padding: 7px 9px; margin-bottom: 5px;">
                    <strong style="color: var(--text-dark); font-size: 11.5px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-gift" style="color: var(--primary); font-size: 10px;"></i> ${b.titulo}
                    </strong>
                    ${b.desc ? `<p style="font-size: 11px; color: var(--text-dark); margin-top: 2px; line-height: 1.3;">${b.desc}</p>` : ''}
                </div>
            `).join('');
        }
    }
}

// Iniciar Criação de Nova Mentoria no Studio
function startNewMentoriaStudio() {
    document.getElementById('studioHeaderTitle').innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> Criar Nova Mentoria no Studio';
    document.getElementById('studioMentoriaId').value = '';
    document.getElementById('studioFullForm').reset();
    
    document.getElementById('studioModulosContainer').innerHTML = '';
    document.getElementById('studioBonusContainer').innerHTML = '';

    // Módulos iniciais de exemplo
    addStudioModulo('Módulo 1: Fundamentos e Avaliação Clínica', 'Abordagem diagnóstica e seleção de dermocosméticos.');
    addStudioModulo('Módulo 2: Prática Hands-On Individual', 'Execução prática completa no modelo com supervisão direta.');
    addStudioBonus('Apostila Clínica & Protocolos Prontos', 'Manual técnico passo a passo para consulta.');

    goToStudioStep(1);
    switchDashboardTab('editor');
    updateLivePreview();
}

// Editar Mentoria no Studio
function editMentoriaInStudio(id) {
    const m = adminMentorias.find(item => item.id === id);
    if (!m) return;

    document.getElementById('studioHeaderTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Editando: ${m.titulo}`;
    document.getElementById('studioMentoriaId').value = m.id;
    document.getElementById('studioTitulo').value = m.titulo;
    document.getElementById('studioCategoriaVal').value = m.categoria;
    document.getElementById('studioIconeVal').value = m.icone || 'fa-gem';
    document.getElementById('studioDuracaoDias').value = m.duracao_dias;
    document.getElementById('studioDuracaoHoras').value = m.duracao_horas;
    document.getElementById('studioPrecoPix').value = m.preco_pix;
    document.getElementById('studioPrecoCartao').value = m.preco_cartao;
    document.getElementById('studioParcelasQtd').value = m.parcelas_qtd;
    document.getElementById('studioParcelasValor').value = m.parcelas_valor;
    document.getElementById('studioSubtitulo').value = m.subtitulo || '';
    document.getElementById('studioPublicoAlvo').value = m.publico_alvo || '';
    document.getElementById('studioRoiDescricao').value = m.roi_descricao || '';

    // Módulos
    const modContainer = document.getElementById('studioModulosContainer');
    modContainer.innerHTML = '';
    if (m.mentoria_modulos && m.mentoria_modulos.length > 0) {
        m.mentoria_modulos.forEach(mod => addStudioModulo(mod.titulo, mod.descricao));
    } else {
        addStudioModulo('Módulo 1: Prática Clínica', 'Execução prática no paciente modelo.');
    }

    // Bônus
    const bonusContainer = document.getElementById('studioBonusContainer');
    bonusContainer.innerHTML = '';
    if (m.mentoria_bonus && m.mentoria_bonus.length > 0) {
        m.mentoria_bonus.forEach(b => addStudioBonus(b.titulo, b.descricao));
    }

    goToStudioStep(1);
    switchDashboardTab('editor');
    updateLivePreview();
}

// Adicionar Módulo no Studio
function addStudioModulo(titulo = '', desc = '') {
    const container = document.getElementById('studioModulosContainer');
    const index = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'module-item-studio';
    div.innerHTML = `
        <div class="module-item-studio-header">
            <span class="module-item-studio-num">Módulo ${index}</span>
            <button type="button" class="btn-remove-item" onclick="this.closest('.module-item-studio').remove(); updateLivePreview();" title="Remover"><i class="fa-solid fa-trash"></i></button>
        </div>
        <input type="text" class="mod-titulo" placeholder="Título da Aula / Tópico Prático" value="${titulo}" style="margin-bottom: 8px; font-weight: 700;" oninput="updateLivePreview()" required>
        <textarea class="mod-desc" rows="2" placeholder="O que o aluno aprende neste módulo..." oninput="updateLivePreview()">${desc}</textarea>
    `;
    container.appendChild(div);
    updateLivePreview();
}

// Adicionar Bônus no Studio
function addStudioBonus(titulo = '', desc = '') {
    const container = document.getElementById('studioBonusContainer');
    const div = document.createElement('div');
    div.className = 'module-item-studio bonus-item-studio';
    div.style.borderLeftColor = 'var(--accent-gold)';
    div.innerHTML = `
        <div class="module-item-studio-header">
            <span class="module-item-studio-num" style="color: var(--accent-gold);"><i class="fa-solid fa-gift"></i> Bônus VIP</span>
            <button type="button" class="btn-remove-item" onclick="this.closest('.module-item-studio').remove(); updateLivePreview();" title="Remover"><i class="fa-solid fa-trash"></i></button>
        </div>
        <input type="text" class="bonus-titulo" placeholder="Nome do Bônus VIP" value="${titulo}" style="margin-bottom: 8px; font-weight: 700;" oninput="updateLivePreview()" required>
        <textarea class="bonus-desc" rows="2" placeholder="Detalhes do bônus..." oninput="updateLivePreview()">${desc}</textarea>
    `;
    container.appendChild(div);
    updateLivePreview();
}

// Salvar Mentoria no Studio
async function handleSaveStudioMentoria(e) {
    e.preventDefault();
    const btn = document.getElementById('btnStudioSave');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando no Supabase...';

    const id = document.getElementById('studioMentoriaId').value || undefined;
    const titulo = document.getElementById('studioTitulo').value.trim();
    
    // Gera slug amigável
    let slug = titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-').replace(/^-|-$/g, '');

    const categoria = document.getElementById('studioCustomCategory').style.display !== 'none' && document.getElementById('studioCustomCategory').value.trim()
        ? document.getElementById('studioCustomCategory').value.trim()
        : (document.getElementById('studioCategoriaVal').value || 'Formação Base');

    const payload = {
        titulo,
        slug,
        categoria,
        icone: document.getElementById('studioIconeVal').value || 'fa-gem',
        duracao_dias: parseInt(document.getElementById('studioDuracaoDias').value) || 1,
        duracao_horas: parseInt(document.getElementById('studioDuracaoHoras').value) || 8,
        preco_pix: parseFloat(document.getElementById('studioPrecoPix').value) || 0,
        preco_cartao: parseFloat(document.getElementById('studioPrecoCartao').value) || 0,
        parcelas_qtd: parseInt(document.getElementById('studioParcelasQtd').value) || 10,
        parcelas_valor: parseFloat(document.getElementById('studioParcelasValor').value) || 0,
        subtitulo: document.getElementById('studioSubtitulo').value.trim(),
        publico_alvo: document.getElementById('studioPublicoAlvo').value.trim(),
        roi_descricao: document.getElementById('studioRoiDescricao').value.trim(),
        ativo: true
    };

    if (id) payload.id = id;

    try {
        const res = await window.MentoriaDB.upsertMentoria(payload);
        if (!res.success) throw new Error(res.error ? res.error.message : 'Erro ao salvar');

        const savedId = res.data ? res.data[0].id : id;

        if (savedId && window.supabaseClient) {
            // Módulos
            const modEls = document.querySelectorAll('#studioModulosContainer .module-item-studio');
            const modData = Array.from(modEls).map((el, idx) => ({
                mentoria_id: savedId,
                ordem: idx + 1,
                titulo: el.querySelector('.mod-titulo').value.trim(),
                descricao: el.querySelector('.mod-desc').value.trim()
            })).filter(m => m.titulo);

            // Bônus
            const bonusEls = document.querySelectorAll('#studioBonusContainer .bonus-item-studio');
            const bonusData = Array.from(bonusEls).map((el, idx) => ({
                mentoria_id: savedId,
                ordem: idx + 1,
                titulo: el.querySelector('.bonus-titulo').value.trim(),
                descricao: el.querySelector('.bonus-desc').value.trim()
            })).filter(b => b.titulo);

            await window.supabaseClient.from('mentoria_modulos').delete().eq('mentoria_id', savedId);
            if (modData.length > 0) {
                await window.supabaseClient.from('mentoria_modulos').insert(modData);
            }

            await window.supabaseClient.from('mentoria_bonus').delete().eq('mentoria_id', savedId);
            if (bonusData.length > 0) {
                await window.supabaseClient.from('mentoria_bonus').insert(bonusData);
            }
        }

        showToast('Mentoria salva e publicada com sucesso!');
        await loadDashboardData();
        switchDashboardTab('mentorias');
    } catch (err) {
        console.error(err);
        alert('Erro ao publicar: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar e Publicar no Site';
    }
}

// Pausar / Ativar
async function toggleMentoria(id, newStatus) {
    const res = await window.MentoriaDB.upsertMentoria({ id, ativo: newStatus });
    if (res.success) {
        showToast(newStatus ? 'Mentoria ativada no site!' : 'Mentoria pausada!');
        await loadDashboardData();
    }
}

// Excluir
async function deleteMentoriaConfirm(id, titulo) {
    if (confirm(`Tem certeza que deseja EXCLUIR a mentoria "${titulo}"? Essa ação não pode ser desfeita.`)) {
        const res = await window.MentoriaDB.deleteMentoria(id);
        if (res.success) {
            showToast('Mentoria excluída.');
            await loadDashboardData();
        } else {
            alert('Erro ao excluir mentoria.');
        }
    }
}

// ==========================================================================
// SEÇÃO DE LEADS (CRM)
// ==========================================================================

function renderDashboardLeads() {
    const tbody = document.getElementById('dashLeadsTbody');
    if (!tbody) return;

    if (!adminLeads || adminLeads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 25px; color: var(--text-muted);">Nenhum contato recebido pelo site ainda.</td></tr>';
        return;
    }

    tbody.innerHTML = adminLeads.map(l => {
        const dataFmt = new Date(l.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
        const waClean = (l.whatsapp || '').replace(/\\D/g, '');
        const waText = encodeURIComponent(`Olá ${l.nome}! Tudo bem? Sou da equipe da Profa. Déborah Loures. Vi seu interesse na mentoria ${l.mentoria_nome || 'VIP'}. Gostaria de tirar dúvidas ou agendar sua data?`);
        const waLink = `https://wa.me/55${waClean}?text=${waText}`;

        return `
            <tr>
                <td><strong style="color: #FFF;">${l.nome}</strong></td>
                <td><a href="${waLink}" target="_blank" style="color: #86EFAC; font-weight: 700; text-decoration: none;"><i class="fa-brands fa-whatsapp"></i> ${l.whatsapp}</a></td>
                <td><span style="background: rgba(184, 151, 108, 0.15); color: var(--primary-light); padding: 3px 8px; border-radius: 4px; font-size: 11px;">${l.mentoria_nome || 'Geral'}</span></td>
                <td><small style="color: var(--text-muted);">${dataFmt}</small></td>
                <td>
                    <select onchange="handleLeadStatusChange('${l.id}', this.value)" style="background: #24201D; color: #FFF; border: 1px solid rgba(184, 151, 108, 0.3); padding: 5px 8px; font-size: 11.5px; border-radius: 6px; outline: none;">
                        <option value="novo" ${l.status === 'novo' ? 'selected' : ''}>Novo</option>
                        <option value="em_atendimento" ${l.status === 'em_atendimento' ? 'selected' : ''}>Em Atendimento</option>
                        <option value="fechado" ${l.status === 'fechado' ? 'selected' : ''}>Fechado (Aluna VIP)</option>
                        <option value="cancelado" ${l.status === 'cancelado' ? 'selected' : ''}>Perdido / Cancelado</option>
                    </select>
                </td>
                <td>
                    <a href="${waLink}" target="_blank" style="background: #22C55E; color: #12100E; padding: 6px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                        <i class="fa-brands fa-whatsapp"></i> Chamar
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

async function handleLeadStatusChange(id, newStatus) {
    const res = await window.MentoriaDB.updateLeadStatus(id, newStatus);
    if (res.success) {
        showToast('Status da aluna atualizado!');
    }
}

// Salvar Configurações Gerais
async function handleSaveConfig(e) {
    e.preventDefault();
    showToast('Configurações salvas!');
}

// Helper Toast
function showToast(msg) {
    let toast = document.getElementById('dashToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dashToast';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #86EFAC;"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// Expor funções globais
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.switchDashboardTab = switchDashboardTab;
window.setPreviewMode = setPreviewMode;
window.goToStudioStep = goToStudioStep;
window.selectCategoryChip = selectCategoryChip;
window.selectStudioIcon = selectStudioIcon;
window.selectDurationPreset = selectDurationPreset;
window.autoCalculateInstallments = autoCalculateInstallments;
window.updateLivePreview = updateLivePreview;
window.startNewMentoriaStudio = startNewMentoriaStudio;
window.editMentoriaInStudio = editMentoriaInStudio;
window.addStudioModulo = addStudioModulo;
window.addStudioBonus = addStudioBonus;
window.handleSaveStudioMentoria = handleSaveStudioMentoria;
window.toggleMentoria = toggleMentoria;
window.deleteMentoriaConfirm = deleteMentoriaConfirm;
window.renderDashboardLeads = renderDashboardLeads;
window.handleLeadStatusChange = handleLeadStatusChange;
window.handleSaveConfig = handleSaveConfig;


