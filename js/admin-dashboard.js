/* ==========================================================================
   PLATAFORMA PREMIUM DE MENTORIAS VIP — DÉBORAH LOURES
   PAINEL ADMINISTRATIVO & CMS (ADMIN-DASHBOARD.JS)
   ========================================================================== */

let adminMentorias = [];
let adminLeads = [];

// Lista de credenciais válidas para o Administrador
const VALID_CREDENTIALS = [
    { email: 'mayconfg3569@gmail.com', pass: '3569Proview@#' },
    { email: 'admin', pass: '3569Proview@#' },
    { email: 'admin', pass: '1876' }
];

const VALID_PASSWORDS = ['3569Proview@#', '1876'];

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
        showToast('Login realizado com sucesso!');
        showDashboard();
    } else {
        alert('❌ Usuário ou senha incorretos! Verifique os dados digitados.');
    }
}

// Manipulador de Logout
function handleAdminLogout() {
    if (confirm('Deseja realmente sair do painel administrativo?')) {
        sessionStorage.removeItem('vip_admin_auth');
        sessionStorage.removeItem('vip_admin_user');
        showToast('Você saiu do painel.');
        showLogin();
    }
}

// Alternador de Abas do Dashboard
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

        // Atualiza Estatísticas
        document.getElementById('statTotalMentorias').innerText = adminMentorias.filter(m => m.ativo).length;
        document.getElementById('statTotalLeads').innerText = adminLeads.length;

        renderDashboardMentorias();
        renderDashboardLeads();
    } catch (e) {
        console.error('Erro ao carregar dados do dashboard:', e);
    }
}

// ==========================================================================
// SEÇÃO DE MENTORIAS (CRUD)
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
                    <strong style="color: #FFF; font-size: 13.5px;">${m.titulo}</strong>
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
                    <button onclick="editMentoria('${m.id}')" title="Editar" style="background: rgba(184, 151, 108, 0.2); border: 1px solid var(--primary); color: #FFF; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 4px;">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>
                    <button onclick="toggleMentoria('${m.id}', ${!m.ativo})" title="${m.ativo ? 'Pausar' : 'Ativar'}" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255,255,255,0.15); color: ${m.ativo ? '#FBBF24' : '#86EFAC'}; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 4px;">
                        <i class="fa-solid ${m.ativo ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button onclick="deleteMentoriaConfirm('${m.id}', '${m.titulo}')" title="Excluir" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239,68,68,0.3); color: #F87171; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Iniciar Criação de Nova Mentoria
function startNewMentoria() {
    document.getElementById('editorFormTitle').innerText = 'Cadastrar Nova Mentoria VIP';
    document.getElementById('formMentoriaId').value = '';
    document.getElementById('mentoriaFullForm').reset();
    
    // Limpa campos dinâmicos
    document.getElementById('dynamicModulosList').innerHTML = '';
    document.getElementById('dynamicBonusList').innerHTML = '';

    // Adiciona 2 campos padrão para facilitar
    addModuloField('Módulo 1: Fundamentos e Avaliação Clínica', 'Abordagem diagnóstica e seleção de dermocosméticos.');
    addModuloField('Módulo 2: Prática Hands-On Individual', 'Execução prática completa no modelo com supervisão direta.');
    addBonusField('Apostila Clínica & Protocolos Prontos', 'Manual técnico passo a passo para consulta.');

    switchDashboardTab('editor');
}

// Editar Mentoria Existente
function editMentoria(id) {
    const m = adminMentorias.find(item => item.id === id);
    if (!m) return;

    document.getElementById('editorFormTitle').innerText = `Editando: ${m.titulo}`;
    document.getElementById('formMentoriaId').value = m.id;
    document.getElementById('formTitulo').value = m.titulo;
    document.getElementById('formSlug').value = m.slug;
    document.getElementById('formCategoria').value = m.categoria;
    document.getElementById('formIcone').value = m.icone || 'fa-gem';
    document.getElementById('formDuracaoDias').value = m.duracao_dias;
    document.getElementById('formDuracaoHoras').value = m.duracao_horas;
    document.getElementById('formPrecoPix').value = m.preco_pix;
    document.getElementById('formPrecoCartao').value = m.preco_cartao;
    document.getElementById('formParcelasQtd').value = m.parcelas_qtd;
    document.getElementById('formParcelasValor').value = m.parcelas_valor;
    document.getElementById('formSubtitulo').value = m.subtitulo || '';
    document.getElementById('formPublicoAlvo').value = m.publico_alvo || '';
    document.getElementById('formRoiDescricao').value = m.roi_descricao || '';

    // Popula Módulos
    const modulosListEl = document.getElementById('dynamicModulosList');
    modulosListEl.innerHTML = '';
    if (m.mentoria_modulos && m.mentoria_modulos.length > 0) {
        m.mentoria_modulos.forEach(mod => addModuloField(mod.titulo, mod.descricao));
    } else {
        addModuloField('Módulo Prático', 'Descrição do procedimento.');
    }

    // Popula Bônus
    const bonusListEl = document.getElementById('dynamicBonusList');
    bonusListEl.innerHTML = '';
    if (m.mentoria_bonus && m.mentoria_bonus.length > 0) {
        m.mentoria_bonus.forEach(b => addBonusField(b.titulo, b.descricao));
    }

    switchDashboardTab('editor');
}

// Adicionar Campo Dinâmico de Módulo
function addModuloField(titulo = '', descricao = '') {
    const container = document.getElementById('dynamicModulosList');
    const div = document.createElement('div');
    div.className = 'dynamic-item-card modulo-item';
    div.innerHTML = `
        <input type="text" class="mod-titulo" placeholder="Título do Módulo/Aula" value="${titulo}" required>
        <input type="text" class="mod-desc" placeholder="Resumo do que é ensinado" value="${descricao}" required>
        <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()" title="Remover"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(div);
}

// Adicionar Campo Dinâmico de Bônus
function addBonusField(titulo = '', descricao = '') {
    const container = document.getElementById('dynamicBonusList');
    const div = document.createElement('div');
    div.className = 'dynamic-item-card bonus-item';
    div.innerHTML = `
        <input type="text" class="bonus-titulo" placeholder="Nome do Bônus VIP" value="${titulo}" required>
        <input type="text" class="bonus-desc" placeholder="Detalhes do bônus" value="${descricao}" required>
        <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()" title="Remover"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(div);
}

// Salvar Mentoria Completa no Supabase
async function handleSaveMentoriaFull(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitMentoria');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando no Supabase...';

    const id = document.getElementById('formMentoriaId').value || undefined;
    const titulo = document.getElementById('formTitulo').value.trim();
    let slug = document.getElementById('formSlug').value.trim();
    if (!slug) slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const payload = {
        titulo,
        slug,
        categoria: document.getElementById('formCategoria').value.trim(),
        icone: document.getElementById('formIcone').value.trim() || 'fa-gem',
        duracao_dias: parseInt(document.getElementById('formDuracaoDias').value) || 1,
        duracao_horas: parseInt(document.getElementById('formDuracaoHoras').value) || 8,
        preco_pix: parseFloat(document.getElementById('formPrecoPix').value) || 0,
        preco_cartao: parseFloat(document.getElementById('formPrecoCartao').value) || 0,
        parcelas_qtd: parseInt(document.getElementById('formParcelasQtd').value) || 10,
        parcelas_valor: parseFloat(document.getElementById('formParcelasValor').value) || 0,
        subtitulo: document.getElementById('formSubtitulo').value.trim(),
        publico_alvo: document.getElementById('formPublicoAlvo').value.trim(),
        roi_descricao: document.getElementById('formRoiDescricao').value.trim(),
        ativo: true
    };

    if (id) payload.id = id;

    try {
        // Salva a mentoria
        const res = await window.MentoriaDB.upsertMentoria(payload);
        if (!res.success) throw new Error(res.error ? res.error.message : 'Erro ao salvar mentoria');

        const savedMentoriaId = res.data ? res.data[0].id : id;

        // Se for edição ou nova mentoria com ID disponível, sincroniza módulos e bônus
        if (savedMentoriaId && window.supabaseClient) {
            // Coleta módulos
            const modulosEls = document.querySelectorAll('.modulo-item');
            const modulosData = Array.from(modulosEls).map((el, idx) => ({
                mentoria_id: savedMentoriaId,
                ordem: idx + 1,
                titulo: el.querySelector('.mod-titulo').value.trim(),
                descricao: el.querySelector('.mod-desc').value.trim()
            })).filter(m => m.titulo);

            // Coleta bônus
            const bonusEls = document.querySelectorAll('.bonus-item');
            const bonusData = Array.from(bonusEls).map((el, idx) => ({
                mentoria_id: savedMentoriaId,
                ordem: idx + 1,
                titulo: el.querySelector('.bonus-titulo').value.trim(),
                descricao: el.querySelector('.bonus-desc').value.trim()
            })).filter(b => b.titulo);

            // Deleta módulos e bônus anteriores para recadastrar atualizados
            await window.supabaseClient.from('mentoria_modulos').delete().eq('mentoria_id', savedMentoriaId);
            if (modulosData.length > 0) {
                await window.supabaseClient.from('mentoria_modulos').insert(modulosData);
            }

            await window.supabaseClient.from('mentoria_bonus').delete().eq('mentoria_id', savedMentoriaId);
            if (bonusData.length > 0) {
                await window.supabaseClient.from('mentoria_bonus').insert(bonusData);
            }
        }

        showToast('Mentoria salva e sincronizada com sucesso!');
        await loadDashboardData();
        switchDashboardTab('mentorias');
    } catch (err) {
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar no banco: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar Mentoria no Supabase';
    }
}

// Pausar / Ativar Mentoria
async function toggleMentoria(id, newStatus) {
    const res = await window.MentoriaDB.upsertMentoria({ id, ativo: newStatus });
    if (res.success) {
        showToast(newStatus ? 'Mentoria ativada no site!' : 'Mentoria pausada!');
        await loadDashboardData();
    }
}

// Excluir Mentoria
async function deleteMentoriaConfirm(id, titulo) {
    if (confirm(`Tem certeza que deseja EXCLUIR a mentoria "${titulo}"? Essa ação não pode ser desfeita.`)) {
        const res = await window.MentoriaDB.deleteMentoria(id);
        if (res.success) {
            showToast('Mentoria excluída com sucesso.');
            await loadDashboardData();
        } else {
            alert('Erro ao excluir mentoria.');
        }
    }
}

// ==========================================================================
// SEÇÃO DE LEADS & CONTATOS (CRM)
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
        showToast('Status da aluna atualizado com sucesso!');
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
window.startNewMentoria = startNewMentoria;
window.editMentoria = editMentoria;
window.addModuloField = addModuloField;
window.addBonusField = addBonusField;
window.handleSaveMentoriaFull = handleSaveMentoriaFull;
window.toggleMentoria = toggleMentoria;
window.deleteMentoriaConfirm = deleteMentoriaConfirm;
window.renderDashboardLeads = renderDashboardLeads;
window.handleLeadStatusChange = handleLeadStatusChange;
window.handleSaveConfig = handleSaveConfig;

