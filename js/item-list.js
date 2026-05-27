document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    
    const nomeUsuarioEl = document.getElementById('nome-usuario');
    const gridItens = document.getElementById('grid-itens');
    const inputPesquisa = document.getElementById('pesquisa');
    const selectFiltro = document.getElementById('filtro');
    const btnLogout = document.getElementById('btn-logout');

    let todosOsItens = [];

    // [Ajuste Demo] Nome do usuário estático no topo para a versão de testes
    if (nomeUsuarioEl) {
        nomeUsuarioEl.textContent = "Usuário Demo";
    }

    // 1. Buscar itens direto do Supabase
    async function buscarItens() {
        try {
            // Buscando os dados da tabela 'itens' ordenados pelos mais recentes
            const { data, error } = await supabase
                .from('itens')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            todosOsItens = data || [];
            filtrarERenderizar();
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            gridItens.innerHTML = '<div class="col-12"><p class="text-danger text-center">Erro ao carregar os itens.</p></div>';
        }
    }

    // 2. Filtrar e Renderizar os itens na tela
    function filtrarERenderizar() {
        const termoBusca = inputPesquisa.value.toLowerCase().trim();
        const categoriaSelecionada = selectFiltro.value;

        const itensFiltrados = todosOsItens.filter(item => {
            // Verifica se a categoria bate com o select ou se está em 'Todos'
            const bateCategoria = (categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada);
            
            // Verifica se o termo digitado bate com o Nome OU com a Descrição do item
            const bateNome = item.nome.toLowerCase().includes(termoBusca) || 
                             item.descricao.toLowerCase().includes(termoBusca);
                             
            return bateCategoria && bateNome;
        });

        // Caso a busca não retorne nada
        if (itensFiltrados.length === 0) {
            gridItens.innerHTML = '<div class="col-12"><p class="text-muted text-center">Nenhum item encontrado.</p></div>';
            return;
        }

        // Renderiza os cards usando o seu método .map()
        gridItens.innerHTML = itensFiltrados.map(item => `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 p-3 border rounded shadow-sm bg-white">
                    ${item.imagem_url ? `
                        <img src="${item.imagem_url}" class="card-img-top rounded mb-2" style="height: 180px; width: 100%; object-fit: cover; border: 1px solid #eee;">
                    ` : ''}
                    <div class="card-body p-0 d-flex flex-column h-100">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge ${item.status === 'Perdido' ? 'bg-danger' : 'bg-success'}">${item.status}</span>
                            <small class="text-muted"><strong>Categoria:</strong> ${item.categoria}</small>
                        </div>
                        <h5 class="card-title">${item.nome}</h5>
                        <p class="card-text text-muted flex-grow-1" style="font-size: 0.95rem;">${item.descricao}</p>
                        <hr class="my-2" style="opacity: 0.1;">
                        <p class="mb-1" style="font-size: 0.85rem;">📍 <strong>Local:</strong> ${item.localizacao || 'Não informado'}</p>
                        <p class="mb-0" style="font-size: 0.85rem;">📞 <strong>Contato:</strong> ${item.contato}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Eventos para filtros em tempo real ao digitar ou mudar o select
    inputPesquisa.addEventListener('input', filtrarERenderizar);
    selectFiltro.addEventListener('change', filtrarERenderizar);

    // Lógica do Logout simplificada para a Home
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Iniciar a busca automática assim que a página carregar
    buscarItens();
});