# Guia do painel administrativo da WP

## Como entrar

1. Acesse `https://wp-solucoes-eletricas.vercel.app/admin` diretamente no navegador.
2. Se necessário, você será levado para `/admin/login`.
3. Digite o e-mail autorizado e a senha.
4. Clique em **Entrar**.

O painel não aparece no menu, no rodapé nem no sitemap do site público. Não compartilhe sua senha.

## Serviços e imagens

### Adicionar um serviço

1. Abra **Serviços e imagens**.
2. Clique em **Adicionar serviço**.
3. Preencha título, descrição, categoria e texto alternativo da imagem.
4. Use **Escolher imagem** se quiser adicionar uma foto.
5. Marque **Exibir este serviço no site** para publicá-lo.
6. Clique em **Salvar**.

### Editar ou substituir uma imagem

Clique no ícone de lápis do serviço. Altere os campos desejados. Para substituir a foto, clique em **Escolher imagem** e confira a prévia antes de salvar. A imagem anterior é removida do armazenamento depois que a alteração é concluída.

Formatos aceitos: JPG, JPEG, PNG e WebP. Tamanho máximo: 5 MB por arquivo.

### Alterar a ordem

Use as setas **Mover para cima** e **Mover para baixo**. A ordem salva é a mesma exibida na landing page.

### Ocultar ou excluir

Para retirar temporariamente um serviço do site, edite-o e desmarque **Exibir este serviço no site**. Para removê-lo definitivamente, clique na lixeira e confirme. A exclusão também remove sua imagem vinculada.

## Informações de contato

Na seção **Informações de contato**, você pode editar:

- WhatsApp e mensagem padrão;
- telefone comercial;
- e-mail e endereço;
- horário de atendimento;
- Instagram e Facebook.

O WhatsApp aceita digitação normal com DDD. O painel converte o número para o padrão internacional exigido pelo WhatsApp. Use **Testar WhatsApp** para conferir o número e a mensagem antes de salvar.

Campos opcionais vazios não aparecem no site. Uma alteração salva atualiza automaticamente todos os botões e links correspondentes, sem editar código ou fazer novo deploy.

## Recuperar a senha

1. Na tela de login, digite seu e-mail.
2. Clique em **Esqueci minha senha**.
3. Abra o e-mail recebido e siga o link.
4. Cadastre uma senha nova com pelo menos oito caracteres.

Se o e-mail não chegar, confira a pasta de spam. Depois, confirme no Supabase se o envio de e-mail e as URLs de redirecionamento estão configurados conforme `SUPABASE-SETUP.md`.

## Sair

Use **Sair** no cabeçalho ou **Sair do painel** na seção **Conta e saída**, principalmente em computadores compartilhados.
