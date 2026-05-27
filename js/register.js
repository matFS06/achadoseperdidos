document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const supabase = window.supabaseClient;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os valores direto do HTML
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validação idêntica à que você tinha no React
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            // Cria o usuário usando o Auth do Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // Guarda o nome de usuário nos metadados do cadastro
                    data: {
                        username: username
                    }
                }
            });

            if (error) {
                throw error;
            }

            if (data) {
                alert('Cadastro realizado com sucesso!');
                // Redireciona para o login (Substitui o navigate('/login'))
                window.location.href = 'login.html';
            }

        } catch (error) {
            console.error('Erro ao fazer o cadastro:', error);
            alert(`Erro ao fazer o cadastro: ${error.message || 'Tente novamente.'}`);
        }
    });
});