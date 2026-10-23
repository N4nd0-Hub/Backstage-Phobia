# Backstage // Phobia

Arquivo pessoal de organização da campanha, com tela de senha na entrada.

Os NPCs têm um elenco próprio e fichas com perfil, história, Arcana, retrato, imagem da Arcana, trama pessoal, aparições em arcos e relações com outros plots. O elenco pode ser filtrado e agrupado por Arcana, arco ou pasta, separado dos textos da campanha. Os backups incluem os campos e as duas imagens; registros antigos continuam compatíveis.

A página usa PBKDF2 (SHA-256, 600.000 iterações) e AES-256-GCM para abrir o aplicativo. A senha é solicitada novamente ao recarregar; ela não é gravada no navegador nem em texto aberto no repositório. O salvamento da campanha continua no mesmo armazenamento local do aplicativo.

## Atualizar o aplicativo

Mantenha o HTML original de edição em uma cópia local. Gere novamente a entrada protegida com Node.js, fornecendo a senha pela entrada padrão:

```
node scripts/protect.mjs caminho/do/aplicativo.html index.html
```

Digite a senha quando o processo aguardar entrada e confirme com Enter. Não inclua a senha em arquivos ou nos argumentos do comando. Publique o novo `index.html`.

A proteção da entrada não criptografa backups JSON nem os registros já guardados no dispositivo. Esses arquivos continuam sob o controle do mestre.
