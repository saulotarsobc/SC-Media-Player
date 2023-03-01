# SC Media Player

## App em electron para reproduzir midias numa sengunda tela

## ROADMAP

- [X] Dual screen
- [X] Persistencia de dados (.sqlite)
- [X] Reprodução de midias
- [X] Criar lista de mídias
- [ ] Imagem como 'descanço'
- [ ] Thumb das midias
- [ ] Volume dos vídeos
- [ ] Barra de progresso do vídeo

## REFERENCIAS

- [How to send information from one window to another in Electron Framework](https://ourcodeworld.com/articles/read/536/how-to-send-information-from-one-window-to-another-in-electron-framework)
- [Selecting a Directory in Electron](https://jaketrent.com/post/select-directory-in-electron/)
- ChatGPT

  - A chave "build" é usada pelo Electron Builder para definir as configurações de construção do seu aplicativo. Aqui estão alguns exemplos de outras opções que você pode incluir na chave "build" do arquivo `package.json`:

  * `"appId"`: Define o ID do aplicativo, que é usado para identificar exclusivamente o seu aplicativo. Ele deve ser definido no formato de nome de domínio reverso (por exemplo, "com.example.myapp"). Este valor é obrigatório para construir o aplicativo para macOS e é usado como o identificador do pacote no Linux e Windows.
  * `"files"`: Uma lista de arquivos ou diretórios que devem ser incluídos na construção do aplicativo. Por padrão, apenas os arquivos na pasta "dist" serão incluídos.
  * `"directories"`: Define o caminho de entrada e saída para o aplicativo. Por padrão, o diretório de entrada é a pasta raiz do projeto e o diretório de saída é "dist". Você pode definir diretórios de entrada e saída personalizados com esta opção.
  * `"asar"`: Habilita ou desabilita a compactação do aplicativo em um único arquivo `asar`. A compactação em asar é habilitada por padrão.
  * `"win"`: Opções específicas para a compilação do aplicativo para Windows.
  * `"mac"`: Opções específicas para a compilação do aplicativo para macOS.
  * `"linux"`: Opções específicas para a compilação do aplicativo para Linux.

  Essas são apenas algumas das opções disponíveis. Você pode encontrar uma lista completa de opções na documentação oficial do Electron Builder.
