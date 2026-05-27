document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    const form = document.getElementById('form-cadastro-item');
    const alerta = document.getElementById('mensagem-alerta');

    // Removemos a proteção de rota com 'session' para focar 100% na Demo Simplificada!

    function exibirAlerta(texto, tipo) {
        if (tipo === 'none') {
            alerta.className = "alert d-none";
        } else {
            alerta.className = `alert alert-${tipo}`;
            alerta.textContent = texto;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        exibirAlerta('', 'none');

        // Captura os valores dos inputs do HTML
        const nome = document.getElementById('nome').value;
        const categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value;
        const localizacao = document.getElementById('localizacao').value;
        const status = document.getElementById('status').value;
        const contato = document.getElementById('contato').value;
        const imagemArquivo = document.getElementById('imagem_url').files[0];

        // Validação básica dos campos
        if (!nome || !categoria || !descricao || !localizacao || !status || !contato || !imagemArquivo) {
            exibirAlerta('Todos os campos são obrigatórios!', 'danger');
            return;
        }

        try {
            // 1. Upload da imagem no Storage do Supabase (bucket: 'imagens-itens')
            const nomeArquivo = `${Date.now()}_${imagemArquivo.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagens-itens')
                .upload(nomeArquivo, imagemArquivo);

            if (uploadError) throw uploadError;

            // 2. Pegar a URL pública gerada para a foto
            const { data: publicUrlData } = supabase.storage
                .from('imagens-itens')
                .getPublicUrl(nomeArquivo);

            const imagem_url = publicUrlData.publicUrl;

            // 3. Salvar as informações na tabela 'itens' (ID e Data são automáticos)
            const { error: insertError } = await supabase
                .from('itens')
                .insert([
                    { 
                        nome, 
                        categoria, 
                        descricao, 
                        localizacao, 
                        status, 
                        contato, 
                        imagem_url 
                    }
                ]);

            if (insertError) throw insertError;

            // Alerta de sucesso e limpa o formulário
            exibirAlerta('Item cadastrado com sucesso!', 'success');
            form.reset();

            // Redireciona de volta para a lista após 1.5 segundos
            setTimeout(() => {
                window.location.href = 'itens.html';
            }, 1500);

        } catch (error) {
            console.error('Erro ao cadastrar item:', error);
            exibirAlerta(`Erro ao cadastrar o item: ${error.message || 'Tente novamente.'}`, 'danger');
        }
    });
});