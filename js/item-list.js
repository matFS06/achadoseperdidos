document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    
    const gridItens = document.getElementById('grid-itens');
    const inputPesquisa = document.getElementById('pesquisa');
    const selectFiltro = document.getElementById('filtro');
    
    // Instancia o modal do Bootstrap
    const modalBootstrap = new bootstrap.Modal(document.getElementById('modalDetalhesItem'));
    const modalConteudo = document.getElementById('modal-conteudo');

    let todosOsItens = [];

    // 1. Buscar itens direto do Supabase (Sem travar por login!)
    async function buscarItens() {
        try {
            const { data, error } = await supabase
                .from('itens')
                .select('*');

            if (error) throw error;
            todosOsItens = data || [];
            filtrarERenderizar();
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            gridItens.innerHTML = '<p class="text-danger">Erro ao carregar os itens. Verifique a conexão com o banco.</p>';
        }
    }

    // 2. Filtrar e Renderizar os itens na tela
    function filtrarERenderizar() {
        const termoBusca = inputPesquisa.value.toLowerCase();
        const categoriaSelecionada = selectFiltro.value;

        const itensFiltrados = todosOsItens.filter(item => {
            const bateCategoria = (categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada);
            const bateNome = item.nome.toLowerCase().includes(termoBusca);
            return bateCategoria && bateNome;
        });

        if (itensFiltrados.length === 0) {
            gridItens.innerHTML = '<div class="col-12"><p class="text-muted text-center">Nenhum item encontrado.</p></div>';
            return;
        }

        gridItens.innerHTML = itensFiltrados.map((item) => `
            <div class="col-md-4 mb-4">
                <div class="p-3 border rounded shadow-sm bg-white h-100 card-item-animado" onclick="mostrarDetalhes(${item.id})">
                    ${item.imagem_url ? `<img src="${item.imagem_url}" class="img-fluid rounded mb-2" style="max-height: 150px; width: 100%; object-fit: cover;">` : ''}
                    <h5>${item.nome}</h5>
                    <p class="mb-1"><strong>Categoria:</strong> ${item.categoria}</p>
                    <p class="mb-1 text-muted"><strong>Local:</strong> ${item.localizacao || 'Não informado'}</p>
                    <span class="badge ${item.status === 'Perdido' ? 'bg-danger' : 'bg-success'} mb-2">${item.status}</span>
                    <p class="text-truncate">${item.descricao}</p>
                </div>
            </div>
        `).join('');
    }

    // 3. Função para ampliar o card dentro do Modal
    window.mostrarDetalhes = function(idItem) {
        const item = todosOsItens.find(i => i.id === idItem);
        if (!item) return;

        modalConteudo.innerHTML = `
            ${item.imagem_url ? `<img src="${item.imagem_url}" class="img-fluid rounded mb-3" style="max-height: 300px; width: 100%; object-fit: contain;">` : ''}
            <h3>${item.nome}</h3>
            <span class="badge ${item.status === 'Perdido' ? 'bg-danger' : 'bg-success'} mb-3 fs-6">${item.status}</span>
            
            <div class="text-start p-2 bg-light rounded">
                <p><strong>Categoria:</strong> ${item.categoria}</p>
                <p><strong>Local onde foi visto:</strong> ${item.localizacao || 'Não informado'}</p>
                <p><strong>Descrição detalhada:</strong> ${item.descricao}</p>
                <hr>
                <p class="mb-0 text-primary"><strong>Contato para devolução:</strong> ${item.contato}</p>
            </div>
        `;

        modalBootstrap.show();
    };

    // Eventos de digitação e filtros
    inputPesquisa.addEventListener('input', filtrarERenderizar);
    selectFiltro.addEventListener('change', filtrarERenderizar);

    buscarItens();
});