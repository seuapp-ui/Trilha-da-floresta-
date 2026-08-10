# Trilha da Floresta — Plataforma 2.5D

Jogo de plataforma lateral 2.5D construído com **Phaser 3** + **JavaScript ES6**,
100% modular e sem dependência de arquivos de arte externos: todo o visual
(personagem, inimigos, cenário, HUD, partículas) é desenhado em tempo de
execução por `src/utils/TextureGenerator.js`, então o projeto roda direto,
sem precisar baixar/organizar assets antes de testar.

## Como rodar

Como o projeto usa **módulos ES6** (`import`/`export`), o navegador bloqueia
`file://` por causa de CORS — é preciso servir por HTTP. Duas opções simples:

```bash
# Python (qualquer SO com Python 3)
python3 -m http.server 8080

# ou Node
npx serve .
```

Depois abra `http://localhost:8080` no navegador.

## Controles

| Ação                     | Desktop                          | Mobile/Touch          |
|--------------------------|-----------------------------------|------------------------|
| Mover                    | Setas / A-D                      | Botões ◀ ▶             |
| Correr                   | Shift (segurar)                  | Botão »                |
| Pular (altura variável)  | Espaço / Seta cima / W (segurar)  | Botão ⤒                |
| Ataque giratório         | X ou J                            | Botão ✦                |
| Pausar                   | ESC                                | Ícone ⏸ no canto        |

Controles de toque aparecem automaticamente em dispositivos com tela sensível
ao toque (detectado via `this.sys.game.device.input.touch`).

## Arquitetura

```
index.html            → carrega Phaser via CDN + boot do jogo
style.css              → layout responsivo do canvas
manifest.json           → base para conversão em PWA
src/
  main.js               → cria o Phaser.Game a partir dos módulos
  config/
    GameConfig.js        → toda constante/tunável do jogo num só lugar
    LevelData.js          → dados puros da Fase 1 (Mundo 1) — 100% data-driven
  utils/
    TextureGenerator.js    → gera todos os sprites/tiles proceduralmente
    EventBus.js             → EventEmitter global para comunicação entre cenas
  modules/
    Player.js              → movimento, coyote time, jump buffer, ataque, dano
    Enemy.js / EnemyManager.js → Lesma, Javali, Morcego + spawn a partir da LevelData
    Map.js                  → chão, plataformas, rio, ponte, espinhos (camada 100%)
    Parallax.js               → céu, nuvens, montanhas, árvores (camadas 0–120%)
    Collectibles.js            → moedas, cristais, caixas destrutíveis
    Checkpoint.js                → bandeiras de checkpoint / respawn
    Hazards.js                    → troncos caindo, pedras rolantes
    HUD.js                          → corações, moedas, cristais (reativo via EventBus)
    CameraManager.js                 → câmera suave com lerp + deadzone
    Particles.js                      → poeira, pouso, quebra de caixa, faíscas
    Audio.js                           → música/SFX com volumes independentes
    Save.js                              → progresso em localStorage
    UI.js                                 → botões/painéis reutilizáveis
    Animation.js                           → helper genérico de troca de frames
    Physics.js                              → configuração global do Arcade Physics
    SceneManager.js                          → registro central de todas as cenas
  scenes/
    BootScene, PreloadScene, MenuScene,
    GameScene, UIScene, GameOverScene, LevelCompleteScene
```

### Por que é escalável

- **Novas fases**: crie um novo objeto de dados em `config/LevelData.js`
  (mesmo formato de `WORLD_1_LEVEL_1`) e registre-o em `LEVELS`. Nenhuma
  classe de gameplay precisa mudar — `Map`, `Collectibles`, `EnemyManager`
  etc. leem tudo da `LevelData` recebida.
- **Novos inimigos**: crie uma subclasse de `Enemy` em `Enemy.js` com seu
  próprio `updateAI()` e registre-a em `EnemyFactory`. `LevelData.enemies`
  já usa `type` como chave de fábrica.
- **Novas cenas** (loja, boss intro, mundo 2...): adicione a classe em
  `scenes/` e registre em `SceneManager.getSceneList()`.
- **Arte real**: troque qualquer geração em `TextureGenerator.js` por
  `this.load.image(...)`/`this.load.spritesheet(...)` no `PreloadScene` —
  como todo o resto do código só referencia *chaves* de textura, nada mais
  precisa mudar.
- **Áudio real**: carregue arquivos com `this.load.audio(key, url)` no
  PreloadScene; `AudioManager` já prefere um som carregado no lugar do bip
  procedural de fallback automaticamente.

## Sistema de estrelas

Cada fase concede **1 a 3 estrelas** de forma **aditiva**:

| Estrelas | Condição |
|----------|----------|
| ★ | Completar a fase (sempre) |
| +★ | Coletar **todos** os cristais (incluindo os que saem de caixas) |
| +★ | Completar **sem tomar nenhum dano** |

Exemplos: só terminar = 1★ · terminar + todos cristais = 2★ · terminar sem dano = 2★ · cristais + sem dano = 3★.

O melhor resultado por fase é guardado em `localStorage` (`levelBest[levelId].stars`).
O menu principal mostra as estrelas conquistadas.
A lógica pura fica em `computeStars()` em `src/modules/Save.js`.

O flag de dano é setado em `Player.takeDamage` via callback `onTookDamage` (não dispara em heal/respawn).

## Mecânicas implementadas

Física com aceleração/desaceleração, coyote time, jump buffer, pulo de
altura variável, deslizar em rampas, ataque giratório com recarga,
invencibilidade temporária após dano, câmera com atraso suave, partículas
(corrida, pouso, quebra de caixa, ataque), moedas, cristais escondidos,
caixas destrutíveis (moeda/cristal/vida), 3 inimigos com IA própria,
armadilhas (espinhos, tronco caindo, pedra rolante), checkpoint que
salva posição/moedas/cristais e respawna o jogador ao morrer, portal de
fim de fase com tela de "Fase Completa" e **sistema de 1–3 estrelas**, HUD reativo, e salvamento
automático de progresso via `localStorage`.
