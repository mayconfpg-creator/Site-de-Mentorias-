// Configuração Oficial do Supabase Client para Mentorias VIP Déborah Loures
const SUPABASE_URL = 'https://mkmuyvgzocboiqyncfln.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbXV5dmd6b2Nib2lxeW5jZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDM5ODYsImV4cCI6MjEwMDgxOTk4Nn0.f67YcEKv3ZHC-fG3K1DVQ6N5G_XV7NLwInhotYP03zs';

let supabaseClient = null;
if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const FALLBACK_MENTORIAS = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        slug: 'skinstart',
        titulo: 'Mentoria SkinStart™: Limpeza & Fisiologia de Alta Precisão',
        subtitulo: 'Domine a base biológica, biótipos, extração cirúrgica sem dor nem marcas e biossegurança.',
        categoria: 'Formação Base',
        icone: 'fa-seedling',
        badge_tag: 'Módulo 1 • Formação Base',
        duracao_dias: 1,
        duracao_horas: 8,
        preco_pix: 1500.00,
        preco_cartao: 1650.00,
        parcelas_qtd: 10,
        parcelas_valor: 165.00,
        publico_alvo: 'Iniciantes do absoluto zero ou profissionais que sentem medo/insegurança ao realizar extração e desejam dominar a base biológica com mão firme, sem dor e sem deixar marcas.',
        roi_descricao: 'Cobrando R$ 150 a R$ 180 por sessão (custo insumo ~R$ 15), seu lucro é de ~R$ 145. Com apenas 10 atendimentos (1 cliente/semana no 1º mês), você recupera 100% do investimento!',
        cor_tema: '#B8976C',
        destaque: false,
        ordem: 1,
        ativo: true,
        mentoria_modulos: [
            { titulo: 'Fisiologia Cutânea & Manto Lipídico', descricao: 'Estrutura epidérmica, barreira de proteção e identificação precisa de biotipos (oleosa, seca, mista, sensível e reativa).' },
            { titulo: 'Anamnese Visual & Olhar Diagnóstico', descricao: 'Identificação assertiva de lesões elementares: comedões abertos, fechados, mílium, pápulas, pústulas e filamentos sebáceos.' },
            { titulo: 'Protocolo Completo de Limpeza Desintoxicante', descricao: 'Higienização seletiva, esfoliação enzimática/física, emoliência assistida, assepsia estéril e máscaras calmantes.' },
            { titulo: 'Extração Cirúrgica Segura (Sem Marcas/Dor)', descricao: 'Vetor de pressão, tração tecidual sem romper capilares, sem dor e sem risco de hiperpigmentação pós-inflamatória.' },
            { titulo: 'Regulação Sebácea & Desobstrução', descricao: 'Controle da oleosidade excessiva e aumento da absorção de ativos e dermocosméticos em até 300%.' },
            { titulo: 'Prática Guiada em Pacientes Reais', descricao: 'Atendimento supervisionado em maca com correção de postura, pegada e luz ao vivo pela Profa. Déborah.' }
        ],
        mentoria_bonus: [
            { titulo: 'Masterclass de Dermaplaning Profissional com Lâmina 10D', descricao: 'Técnica de raspagem com lâmina cirúrgica 10D para esfoliação profunda, remoção de penugem velar e finalização Glow.' }
        ]
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        slug: 'cosmeceutical-expert',
        titulo: 'Mentoria Cosmeceutical Expert: Ácidos & Vendas Home Care',
        subtitulo: 'Extrações complexas, eletroterapia integrada, sinergia de ácidos e método consultivo de vendas.',
        categoria: 'Aperfeiçoamento & Cosmetologia',
        icone: 'fa-flask-vial',
        badge_tag: 'Módulo 2 • Aperfeiçoamento',
        duracao_dias: 2,
        duracao_horas: 16,
        preco_pix: 2000.00,
        preco_cartao: 2200.00,
        parcelas_qtd: 10,
        parcelas_valor: 220.00,
        publico_alvo: 'Profissionais que já atendem e querem dominar extrações de alta dificuldade, prescrever dermocosméticos assertivos e dobrar o faturamento com vendas de Home Care.',
        roi_descricao: 'Sessão de Limpeza Avançada (R$ 200) + Lucro Home Care (R$ 120) = R$ 320 por cliente. Com apenas 6 a 7 clientes atendidos, a mentoria se paga 100%!',
        cor_tema: '#2563EB',
        destaque: true,
        ordem: 2,
        ativo: true,
        mentoria_modulos: [
            { titulo: 'Extrações de Alta Complexidade', descricao: 'Remoção de mílium resistente, comedões queratinizados profundos e manejo seguro em acne ativa.' },
            { titulo: 'Cosmetologia Aplicada & Ácidos', descricao: 'Sinergia de AHAs/BHAs (Salicílico, Mandélico, Glicólico, Lático), Niacinamida, Zinco PCA e Peptídeos.' },
            { titulo: 'Eletroterapia Integrada', descricao: 'Alta Frequência bactericida, Vapor de Ozônio, LEDterapia e Laser terapêutico para cicatrização acelerada.' },
            { titulo: 'Manejo de Peles Especiais & Limpezas Premium', descricao: 'Conduta segura em gestantes, peles maduras, reativas/rosácea e fototipos altos (Fitzpatrick IV-VI sem manchar). Inclui Limpeza Dermo-Clareadora, Hydra-XR e Contingência Acneica.' },
            { titulo: 'Mínimo de 3 Pacientes Reais Atendidos', descricao: 'Prática intensiva individual em casos clínicos desafiadores com supervisão direta.' },
            { titulo: 'Precificação & Margens de 80%', descricao: 'Cálculo de custos por atendimento e formação de preço para lucro líquido de alto padrão.' }
        ],
        mentoria_bonus: [
            { titulo: 'Dermaplaning Avançado Associado a Peelings Químicos Suaves', descricao: 'Associação da lâmina a ácidos para entrega de resultados acelerados.' },
            { titulo: 'Método Consultivo de Vendas de Home Care', descricao: 'Eleve seu ticket de R$ 150 para R$ 350+ por cliente prescrevendo produtos no pós-atendimento.' }
        ]
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        slug: 'melan-control',
        titulo: 'Mentoria Melan Control: Melasma sem Efeito Rebote',
        subtitulo: 'Especialização no clareamento seguro de manchas e melasma com protocolo anti-inflamatório.',
        categoria: 'Especialização em Manchas',
        icone: 'fa-shield-halved',
        badge_tag: 'Módulo 3 • Especialista em Melasma',
        duracao_dias: 2,
        duracao_horas: 16,
        preco_pix: 2000.00,
        preco_cartao: 2200.00,
        parcelas_qtd: 10,
        parcelas_valor: 220.00,
        publico_alvo: 'Profissionais que desejam se tornar autoridade máxima no tratamento de melasma e hipercromias, com protocolos que não irritam a pele e blindam contra o rebote.',
        roi_descricao: 'Um plano básico de Melasma é vendido entre R$ 1.200 e R$ 1.800. Fechando apenas 1 a 2 planos de tratamento, você recupera 100% da mentoria e passa a lucrar alto!',
        cor_tema: '#9333EA',
        destaque: true,
        ordem: 3,
        ativo: true,
        mentoria_modulos: [
            { titulo: 'Fisiopatologia do Melasma & Melanogênese', descricao: 'Rota da tirosinase, cascata inflamatória e como atuar em cada etapa da síntese de pigmento.' },
            { titulo: 'O Princípio da Não-Agressão', descricao: 'Como clarear manchas sem irritar o melanócito, eliminando calor excessivo e fontes de inflamação.' },
            { titulo: 'Melasma Vascular vs. Pigmentar', descricao: 'Diagnóstico diferencial de manchas com componente vascular e escolha assertiva de ativos calmantes.' },
            { titulo: 'Peelings Químicos Despigmentantes', descricao: 'Ácido Tranexâmico, Kójico, Fítico, Azelaico, Mandélico e Retinóico com neutralização segura.' },
            { titulo: 'Prevenção do Efeito Rebote & Luz Azul', descricao: 'Prescrição de fotoproteção ativa (contra radiação UV, luz visível e azul) e antioxidantes tópicos/orais.' },
            { titulo: 'Prática Clínica com Casos Reais', descricao: 'Atendimento supervisionado de pacientes modelos com queixas de manchas e melasma sob mentoria direta.' }
        ],
        mentoria_bonus: [
            { titulo: 'Masterclass de Dermaplaning Glow com Preparação Clareadora', descricao: 'Preparo ideal do estrato córneo para potencializar despigmentantes.' },
            { titulo: 'Mentoria em Vendas de Planos de Melasma', descricao: 'Aprenda a vender tratamentos contínuos de 3 a 6 meses por R$ 1.200 a R$ 2.500 por paciente + 6 Meses de Suporte VIP.' }
        ]
    },
    {
        id: '44444444-4444-4444-4444-444444444444',
        slug: 'collagen-pro',
        titulo: 'Mentoria Collagen Pro 5 em 1: Microagulhamento Avançado',
        subtitulo: 'As 5 vertentes mais rentáveis: Face, Terapia Capilar, Hydra Gloss Lips, Sobrancelhas e Cicatrizes.',
        categoria: 'Indução de Colágeno',
        icone: 'fa-wand-magic-sparkles',
        badge_tag: 'Módulo 4 • Procedimentos de Alto Valor',
        duracao_dias: 1,
        duracao_horas: 8,
        preco_pix: 1800.00,
        preco_cartao: 2000.00,
        parcelas_qtd: 10,
        parcelas_valor: 200.00,
        publico_alvo: 'Profissionais que querem dominar a indução de colágeno e faturar alto com os 5 procedimentos mais rentáveis e procurados nas clínicas: Face, Capilar, Lábios, Sobrancelhas e Cicatrizes.',
        roi_descricao: 'Hydra Gloss: R$ 150 a R$ 200 | Sobrancelha: R$ 150 a R$ 220 | Facial: R$ 280 a R$ 450 | Capilar: R$ 300 a R$ 500. Vendendo apenas 2 pacotes fechados, seu curso está 100% pago!',
        cor_tema: '#0284C7',
        destaque: false,
        ordem: 4,
        ativo: true,
        mentoria_modulos: [
            { titulo: '1. Facial: Flacidez, Rugas & Poros', descricao: 'Indução de colágeno (tipo I e III), combate à flacidez facial, fechamento de poros dilatados e rejuvenescimento global.' },
            { titulo: '2. Terapia Capilar Antiqueda', descricao: 'Estímulo do bulbo capilar, combate à alopecia e eflúvio telógeno com drug delivery de fatores de crescimento e biotina.' },
            { titulo: '3. Hydra Gloss Lips (Volume & Hidratação)', descricao: 'Esfoliação, infusão de ácido hialurônico de múltiplos pesos e peptídeos para rejuvenescimento e efeito gloss labial.' },
            { titulo: '4. Crescimento de Sobrancelhas', descricao: 'Ativação de folículos pilosos dormentes, aumento da densidade e correção de falhas em sobrancelhas.' },
            { titulo: '5. Cicatrizes de Acne & Manchas', descricao: 'Quebra de traves fibróticas em cicatrizes deprimidas e drug delivery clareador com total biossegurança.' },
            { titulo: 'Biossegurança, DermaPen & Roller', descricao: 'Calibração de profundidade (0.25mm a 2.0mm), escolha de agulhas estéreis ANVISA e descarte seguro.' }
        ],
        mentoria_bonus: [
            { titulo: 'Guia de Fórmulas de Drug Delivery Estéreis & Biocompatíveis', descricao: 'Cosméticos estéreis biocompatíveis para potencializar os resultados em até 400% e script de venda de pacotes fechados.' }
        ]
    }
];

const MentoriaDB = {
    async getMentorias() {
        if (!supabaseClient) return FALLBACK_MENTORIAS;
        try {
            const { data, error } = await supabaseClient
                .from('mentorias')
                .select('*, mentoria_modulos(*), mentoria_bonus(*)')
                .eq('ativo', true)
                .order('ordem', { ascending: true });
            if (error || !data || data.length === 0) return FALLBACK_MENTORIAS;
            return data;
        } catch (e) {
            console.warn('Fallback ativado:', e);
            return FALLBACK_MENTORIAS;
        }
    },

    async getAllMentoriasAdmin() {
        if (!supabaseClient) return FALLBACK_MENTORIAS;
        try {
            const { data, error } = await supabaseClient
                .from('mentorias')
                .select('*, mentoria_modulos(*), mentoria_bonus(*)')
                .order('ordem', { ascending: true });
            if (error || !data) return FALLBACK_MENTORIAS;
            return data;
        } catch (e) {
            return FALLBACK_MENTORIAS;
        }
    },

    async saveLead(leadData) {
        if (!supabaseClient) {
            console.log('Lead salvo localmente:', leadData);
            return { success: true };
        }
        try {
            const { data, error } = await supabaseClient
                .from('mentoria_leads')
                .insert([leadData]);
            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            console.error('Erro ao salvar lead:', e);
            return { success: false, error: e };
        }
    },

    async getLeads() {
        if (!supabaseClient) return [];
        try {
            const { data, error } = await supabaseClient
                .from('mentoria_leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error('Erro ao buscar leads:', e);
            return [];
        }
    },

    async updateLeadStatus(id, status) {
        if (!supabaseClient) return { success: false };
        try {
            const { data, error } = await supabaseClient
                .from('mentoria_leads')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e };
        }
    },

    async upsertMentoria(mentoriaData) {
        if (!supabaseClient) return { success: false, message: 'Supabase offline' };
        try {
            const { data, error } = await supabaseClient
                .from('mentorias')
                .upsert(mentoriaData)
                .select();
            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e };
        }
    },

    async deleteMentoria(id) {
        if (!supabaseClient) return { success: false };
        try {
            const { error } = await supabaseClient
                .from('mentorias')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, error: e };
        }
    }
};

window.MentoriaDB = MentoriaDB;
