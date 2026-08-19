/* ==========================================================================
   PLATAFORMA PREMIUM DE MENTORIAS VIP — DÉBORAH LOURES
   PAINEL ADMINISTRATIVO VIP (ADMIN.JS)
   ========================================================================== */

let isAdminAuthenticated = false;
const ADMIN_PIN = '1876'; // PIN Oficial de Segurança

// Abertura do Painel Admin
function openAdminPanel() {
    if (!isAdminAuthenticated) {
        const inputPin = prompt('🔒 Digite o PIN de Acesso Administrativo:');
        if (inputPin === ADMIN_PIN) {
            isAdminAuthenticated = true;
            window.showToast('Autenticado com sucesso no Painel VIP!');
        } else if (inputPin !== null) {
            alert('❌ PIN incorreto. Acesso restrito à Profa. Déborah Loures.');
            return;
        } else {
            return;
        }
    }

    renderAdminMentoriasList();
    renderAdminLeadsList();
    window.openModal('adminModal');
}

// Alternar Abas no Painel Admin
function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));

    const activeContent = document.getElementById(`adminTab-${tabName}`);
    if (activeContent) activeContent.style.display = 'block';

    const activeBtn = document.getElementById(`btnAdminTab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabName === 'leads') {
        renderAdminLeadsList();
    } else if (tabName === 'mentorias') {
        renderAdminMentoriasList();
    }
}

// Renderizar Lista de Mentorias no Admin
async function renderAdminMentoriasList() {
    const listEl = document.getElementById('adminMentoriasList');
    if (!listEl) return;

    listEl.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Carregando mentorias...</td></tr>';

    const mentorias = await window.MentoriaDB.getAllMentoriasAdmin();

    if (!mentorias || mentorias.length === 0) {
        listEl.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhuma mentoria cadastrada.</td></tr>';
        return;
    }

    listEl.innerHTML = mentorias.map(m => `
        <tr>
            <td><strong>${m.titulo}</strong><br><small style="color: var(--text-muted);">${m.categoria} • ${m.duracao_dias}d (${m.duracao_horas}h)</small></td>
            <td><strong>R$ ${Number(m.preco_pix).toFixed(2)}</strong></td>
            <td>${m.parcelas_qtd || 10}x R$ ${Number(m.parcelas_valor).toFixed(2)}</td>
            <td>
                <span class="status-tag ${m.ativo ? 'status-fechado' : 'status-atendimento'}">
                    ${m.ativo ? 'Ativa' : 'Pausada'}
                </span>
            </td>
            <td>
                <button onclick="editMentoriaForm('${m.id}')" style="background: var(--bg-sand); border: 1px solid var(--border-soft); padding: 5px 10px; border-radius: 6px; font-weight: 700; margin-right: 4px;">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="toggleMentoriaStatus('${m.id}', ${!m.ativo})" style="background: var(--bg-sand); border: 1px solid var(--border-soft); padding: 5px 10px; border-radius: 6px; font-weight: 700; color: ${m.ativo ? '#D97706' : '#15803D'};">
                    <i class="fa-solid ${m.ativo ? 'fa-pause' : 'fa-play'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Renderizar Leads Recebidos no Admin
async function renderAdminLeadsList() {
    const listEl = document.getElementById('adminLeadsList');
    if (!listEl) return;

    listEl.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Carregando contatos...</td></tr>';

    const leads = await window.MentoriaDB.getLeads();

    if (!leads || leads.length === 0) {
        listEl.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">Nenhum contato/inscrição recebido ainda.</td></tr>';
        return;
    }

    listEl.innerHTML = leads.map(l => {
        const dataFmt = new Date(l.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        const waClean = (l.whatsapp || '').replace(/\\D/g, '');
        const waLink = `https://wa.me/55${waClean}?text=${encodeURIComponent(`Olá ${l.nome}! Tudo bem? Aqui é da equipe da Profa. Déborah Loures sobre seu interesse na mentoria.`)}`;

        let statusClass = 'status-novo';
        if (l.status === 'em_atendimento') statusClass = 'status-atendimento';
        if (l.status === 'fechado') statusClass = 'status-fechado';

        return `
            <tr>
                <td><strong>${l.nome}</strong></td>
                <td><a href="${waLink}" target="_blank" style="color: #15803D; font-weight: 700;"><i class="fa-brands fa-whatsapp"></i> ${l.whatsapp}</a></td>
                <td>${l.mentoria_nome || 'Geral'}</td>
                <td><small>${dataFmt}</small></td>
                <td>
                    <select onchange="updateLeadStatus('${l.id}', this.value)" style="padding: 4px 8px; font-size: 11px; border-radius: 6px; border: 1px solid var(--border-soft);">
                        <option value="novo" ${l.status === 'novo' ? 'selected' : ''}>Novo</option>
                        <option value="em_atendimento" ${l.status === 'em_atendimento' ? 'selected' : ''}>Em Atendimento</option>
                        <option value="fechado" ${l.status === 'fechado' ? 'selected' : ''}>Fechado (Aluna VIP)</option>
                    </select>
                </td>
                <td>
                    <a href="${waLink}" target="_blank" style="background: #22C55E; color: #FFF; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="fa-brands fa-whatsapp"></i> Chamar
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

// Alterar Status da Mentoria (Ativar / Desativar)
async function toggleMentoriaStatus(id, newStatus) {
    const res = await window.MentoriaDB.upsertMentoria({ id, ativo: newStatus });
    if (res.success) {
        window.showToast(newStatus ? 'Mentoria ativada!' : 'Mentoria pausada!');
        renderAdminMentoriasList();
        window.loadMentorias();
    } else {
        alert('Erro ao atualizar status.');
    }
}

// Atualizar Status do Lead
async function updateLeadStatus(id, newStatus) {
    const res = await window.MentoriaDB.updateLeadStatus(id, newStatus);
    if (res.success) {
        window.showToast('Status do contato atualizado!');
    }
}

// Formulário de Nova / Edição de Mentoria
function editMentoriaForm(id) {
    const m = allMentorias.find(item => item.id === id);
    if (!m) return;

    document.getElementById('editMentoriaId').value = m.id;
    document.getElementById('editTitulo').value = m.titulo;
    document.getElementById('editSlug').value = m.slug;
    document.getElementById('editCategoria').value = m.categoria;
    document.getElementById('editSubtitulo').value = m.subtitulo || '';
    document.getElementById('editDuracaoDias').value = m.duracao_dias;
    document.getElementById('editDuracaoHoras').value = m.duracao_horas;
    document.getElementById('editPrecoPix').value = m.preco_pix;
    document.getElementById('editPrecoCartao').value = m.preco_cartao;
    document.getElementById('editParcelasQtd').value = m.parcelas_qtd;
    document.getElementById('editParcelasValor').value = m.parcelas_valor;
    document.getElementById('editPublicoAlvo').value = m.publico_alvo || '';
    document.getElementById('editRoiDescricao').value = m.roi_descricao || '';

    switchAdminTab('form');
}

function resetMentoriaForm() {
    document.getElementById('editMentoriaId').value = '';
    document.getElementById('editMentoriaFormEl').reset();
    switchAdminTab('form');
}

async function handleSaveMentoria(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSaveMentoria');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    const id = document.getElementById('editMentoriaId').value || undefined;
    const titulo = document.getElementById('editTitulo').value.trim();
    let slug = document.getElementById('editSlug').value.trim();
    if (!slug) slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const payload = {
        titulo,
        slug,
        categoria: document.getElementById('editCategoria').value.trim(),
        subtitulo: document.getElementById('editSubtitulo').value.trim(),
        duracao_dias: parseInt(document.getElementById('editDuracaoDias').value) || 1,
        duracao_horas: parseInt(document.getElementById('editDuracaoHoras').value) || 8,
        preco_pix: parseFloat(document.getElementById('editPrecoPix').value) || 0,
        preco_cartao: parseFloat(document.getElementById('editPrecoCartao').value) || 0,
        parcelas_qtd: parseInt(document.getElementById('editParcelasQtd').value) || 10,
        parcelas_valor: parseFloat(document.getElementById('editParcelasValor').value) || 0,
        publico_alvo: document.getElementById('editPublicoAlvo').value.trim(),
        roi_descricao: document.getElementById('editRoiDescricao').value.trim(),
        ativo: true
    };

    if (id) payload.id = id;

    const res = await window.MentoriaDB.upsertMentoria(payload);

    if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Salvar Formação';

    if (res.success) {
        window.showToast('Mentoria salva com sucesso!');
        switchAdminTab('mentorias');
        window.loadMentorias();
    } else {
        alert('Erro ao salvar no Supabase: ' + (res.error ? res.error.message : 'Verifique os dados'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formEl = document.getElementById('editMentoriaFormEl');
    if (formEl) formEl.addEventListener('submit', handleSaveMentoria);
});

window.openAdminPanel = openAdminPanel;
window.switchAdminTab = switchAdminTab;
window.editMentoriaForm = editMentoriaForm;
window.resetMentoriaForm = resetMentoriaForm;
window.toggleMentoriaStatus = toggleMentoriaStatus;
window.updateLeadStatus = updateLeadStatus;

