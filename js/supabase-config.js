// Substitua com os dados REAIS que você acabou de copiar do seu painel do Supabase
const SUPABASE_URL = "https://hsnkvzzvjlmpfyawyxfy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzbmt2enp2amxtcGZ5YXd5eGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mzc1NDMsImV4cCI6MjA5NTQxMzU0M30.PKafcYyBQc7_9DuAqvkTJcSfrz8o8gBySVuE1CzGhpU";

// Cria a conexão com o banco e deixa ela disponível para todo o projeto
if (!window.supabaseClient) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}