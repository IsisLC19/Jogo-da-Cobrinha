const tamanho = 20;
const cobrinha = [
  {x: 5, y: 5},
  {x: 4, y: 5},
  {x: 3, y: 5}
];

let pontuacao = 0;
let direcao = {x: 1, y: 0};
let loopDoJogo;
let jogoComecou = false;
let fruta = gerarNovaFruta()

function gerarNovaFruta() {
  const emojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍊'];
  let posicao;
  do {
    posicao = {
      x: Math.floor(Math.random() * tamanho),
      y: Math.floor(Math.random() * tamanho),
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    };
  } while (cobrinha.some(parte => parte.x === posicao.x && parte.y === posicao.y));
  return posicao;
}



const tabuleiro = document.getElementById('tabuleiro');

// Cria os quadradinhos
for (let i = 0; i < tamanho * tamanho; i++) {
  const bloco = document.createElement('div');
  bloco.classList.add('bloco');
  tabuleiro.appendChild(bloco);
}

function desenharCobrinha() {
  const blocos = document.querySelectorAll('.bloco');

  blocos.forEach(bloco => {
    bloco.classList.remove('cobrinha', 'fruta');
    bloco.textContent = ''; // limpa o emoji da fruta antiga
  });

  // desenhar cobrinha
  cobrinha.forEach(parte => {
    const index = parte.y * tamanho + parte.x;
    blocos[index].classList.add('cobrinha');
  });


  // desenhar fruta com emoji
  const frutaIndex = fruta.y * tamanho + fruta.x;
  blocos[frutaIndex].classList.add('fruta');
  blocos[frutaIndex].textContent = fruta.emoji;
}


//movimentando a cobrinha
function moverCobrinha() {
  const cabeca = cobrinha[0];
  const novaCabeca = {
    x: cabeca.x + direcao.x,
    y: cabeca.y + direcao.y
  };

  // 1. Bateu na parede?
  if (
    novaCabeca.x < 0 || novaCabeca.x >= tamanho ||
    novaCabeca.y < 0 || novaCabeca.y >= tamanho
  ) {
    clearInterval(loopDoJogo);
    mostrarGameOver();
    return;
  }

  // 2. Bateu em si mesma?
  if (cobrinha.slice(1).some(parte => parte.x === novaCabeca.x && parte.y === novaCabeca.y)) {
    clearInterval(loopDoJogo);
    mostrarGameOver();
    return;
  }


  cobrinha.unshift(novaCabeca); // a nova cabeça

  // Verifica se comeu fruta
  if (novaCabeca.x === fruta.x && novaCabeca.y === fruta.y) {
    fruta = gerarNovaFruta(); // cria nova fruta
    pontuacao++ //soma os pontos
    document.getElementById('pontuacao').textContent = 'Pontos: ' + pontuacao; //atualiza pontuação
  } else {
    cobrinha.pop(); // só remove cauda se não comeu
  }
}

function mostrarGameOver() {
  const telaGameOver = document.getElementById('game-over');
  const textoPontuacao = document.getElementById('pontuacao-final');

  textoPontuacao.textContent = `Sua pontuação: ${pontuacao}`;
  telaGameOver.style.display = 'block';
}


function reiniciarJogo() {
      // Resetar tudo
      clearInterval(loopDoJogo)

      cobrinha.length = 0;
      cobrinha.push({x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5});
      direcao = {x: 1, y: 0};
      pontuacao = 0;
      document.getElementById('pontuacao').textContent = 'Pontos: 0';
      fruta = gerarNovaFruta();
      document.getElementById('game-over').style.display = 'none';
      
      desenharCobrinha();

      // recomeçar o loop
      jogoComecou = true;
      loopDoJogo = setInterval(() => {
        moverCobrinha();
        desenharCobrinha();
      }, 300);
    } 

    document.getElementById('botao-reiniciar').addEventListener('click', reiniciarJogo);


document.addEventListener('keydown', (event) => {
    if (!jogoComecou) {
        jogoComecou = true;
        loopDoJogo = setInterval(() => {
            moverCobrinha();
            desenharCobrinha();
        },300); //velocidade de movimento
}

//comandos do teclado
  switch(event.key) {
    case 'ArrowUp':
      if (direcao.y === 0) direcao = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direcao.y === 0) direcao = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direcao.x === 0) direcao = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direcao.x === 0) direcao = {x: 1, y: 0};
      break;
  }
});


desenharCobrinha();

