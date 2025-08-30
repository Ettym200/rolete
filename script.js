
        const rouletteWheel = document.getElementById('rouletteWheel');
        const spinButton = document.getElementById('spinButton');
        const spinSound = document.getElementById('spinSound');
        const modal = document.getElementById('resultModal');
        const resultTitle = document.getElementById('resultTitle');
        const resultText = document.getElementById('resultText');

        // Opções da roleta com seus ângulos e prêmios
        const prizes = [
            { name: 'Fortune Tiger', angle: 365, spins: 20, message: 'Você ganhou 20 giros no Fortune Tiger!' },
            { name: 'Big Bass Bonanza', angle: 395, spins: 20, message: 'Você ganhou 20 giros no Big Bass Bonanza!' },
            { name: 'Fortune OX', angle: 408, spins: 20, message: 'Você ganhou 20 giros no Fortune OX!' },
            { name: 'Fortune Rabbit', angle: 435, spins: 20, message: 'Você ganhou 20 giros no Fortune Rabbit!' },
            { name: 'Fortune Mouse', angle: 455, spins: 20, message: 'Você ganhou 20 giros no Fortune Mouse!' },
            { name: 'Não foi dessa vez', angle: 475, spins: 0, message: 'Não foi dessa vez! Tente novamente!' }
        ];

        let isSpinning = false;
        let currentRotation = 0;

        function getRandomPrize() {
            const randomIndex = Math.floor(Math.random() * prizes.length);
            return prizes[randomIndex];
        }

        function playAudio() {
            try {
                // Garantir que o áudio está pronto
                if (!audioInitialized) {
                    initializeAudio();
                }
                
                spinSound.currentTime = 0;
                spinSound.volume = 0.5;
                
                const playPromise = spinSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Áudio tocando normalmente');
                    }).catch(error => {
                        console.log('Erro ao tocar áudio:', error);
                        // Tentar novamente após um pequeno delay
                        setTimeout(() => {
                            spinSound.play().catch(e => console.log('Segunda tentativa falhou:', e));
                        }, 100);
                    });
                }
            } catch (error) {
                console.log('Erro geral no áudio:', error);
            }
        }

        function spinWheel() {
            if (isSpinning) return;
            
            isSpinning = true;
            spinButton.disabled = true;
            spinButton.textContent = 'GIRANDO...';
            
            // Tocar música
            playAudio();
            
            // Selecionar prêmio aleatório
            const selectedPrize = getRandomPrize();
            
            // Calcular rotação final
            const voltas = 3;
            const finalAngle = voltas * selectedPrize.angle;
            const totalRotation = currentRotation + finalAngle;
            
            // Aplicar rotação
            rouletteWheel.style.transform = `rotate(${totalRotation}deg)`;
            currentRotation = totalRotation;
            
            // Mostrar resultado após a animação
            setTimeout(() => {
                isSpinning = false;
                spinButton.disabled = false;
                spinButton.textContent = 'GIRAR ROLETA';
                
                // Parar música
                spinSound.pause();
                
                // Mostrar modal com resultado
                showResult(selectedPrize);
            }, 4000);
        }

        function showResult(prize) {
            if (prize.name === 'Não foi dessa vez') {
                resultTitle.textContent = '😔 QUE PENA!';
                resultTitle.style.color = '#ff0040';
            } else {
                resultTitle.textContent = '🎉 PARABÉNS! 🎉';
                resultTitle.style.color = '#00ff88';
            }
            
            resultText.textContent = prize.message;
            modal.style.display = 'block';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        // Event listeners
        spinButton.addEventListener('click', () => {
            // Garantir que o áudio está inicializado no primeiro clique
            if (!audioInitialized) {
                initializeAudio();
            }
            spinWheel();
        });

        // Fechar modal clicando fora dele
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Inicializar áudio após primeira interação
        let audioInitialized = false;
        
        function initializeAudio() {
            if (!audioInitialized) {
                spinSound.load();
                // Tentar reproduzir silenciosamente para "acordar" o áudio
                spinSound.volume = 0;
                spinSound.play().then(() => {
                    spinSound.pause();
                    spinSound.currentTime = 0;
                    spinSound.volume = 0.5;
                    audioInitialized = true;
                }).catch(() => {
                    console.log('Aguardando interação do usuário para ativar áudio');
                });
            }
        }
        
        // Inicializar áudio na primeira interação
        document.addEventListener('click', initializeAudio, { once: true });
        document.addEventListener('touchstart', initializeAudio, { once: true });
