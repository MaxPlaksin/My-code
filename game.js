let scene, camera, renderer;
let player1, player2;
const keys = {};

class Samurai {
    constructor(color, position, isPlayer1) {
        // Геометрия самурая
        const geometry = new THREE.BoxGeometry(1, 2, 0.5);
        const material = new THREE.MeshStandardMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.position.y = 1;
        scene.add(this.mesh);

        // Увеличенные характеристики
        this.health = 1000; // Увеличенное здоровье
        this.maxHealth = 1000;
        this.isJumping = false;
        this.velocity = 0;
        this.speed = 0.15; // Увеличенная скорость
        this.isPlayer1 = isPlayer1;
        this.score = 0;
        this.combo = 0;
        this.lastHitTime = 0;
        this.isBlocking = false;
    }

    update() {
        // Гравитация
        if (this.mesh.position.y > 1) {
            this.velocity -= 0.01;
            this.mesh.position.y += this.velocity;
        } else {
            this.mesh.position.y = 1;
            this.velocity = 0;
            this.isJumping = false;
        }

        // Сброс комбо через 2 секунды после последнего удара
        if (this.combo > 0 && Date.now() - this.lastHitTime > 2000) {
            this.combo = 0;
            this.updateStats();
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = 0.25;
            this.isJumping = true;
        }
    }

    moveLeft() {
        this.mesh.position.x -= this.speed;
        this.mesh.rotation.y = Math.PI / 2;
    }

    moveRight() {
        this.mesh.position.x += this.speed;
        this.mesh.rotation.y = -Math.PI / 2;
    }

    block() {
        this.isBlocking = true;
        setTimeout(() => {
            this.isBlocking = false;
        }, 500);
    }

    attack(opponent) {
        if (Math.abs(this.mesh.position.x - opponent.mesh.position.x) < 1.5) {
            let damage = 50; // Базовый урон

            // Увеличение урона от комбо
            damage *= (1 + this.combo * 0.2);

            // Уменьшение урона при блоке
            if (opponent.isBlocking) {
                damage *= 0.2;
                showComboMessage("БЛОК!");
            } else {
                this.combo++;
                this.lastHitTime = Date.now();
                
                // Добавление очков за успешную атаку
                let scoreGain = Math.floor(damage * (1 + this.combo * 0.5));
                this.score += scoreGain;

                if (this.combo > 1) {
                    showComboMessage(this.combo + "x КОМБО!");
                }
            }

            opponent.health -= damage;
            if (opponent.health < 0) opponent.health = 0;

            // Создание эффекта удара
            createHitEffect(opponent.mesh.position);
            
            this.updateStats();
            opponent.updateStats();

            // Проверка на победу
            if (opponent.health <= 0) {
                this.score += 1000; // Бонус за победу
                this.updateStats();
                showComboMessage(this.isPlayer1 ? "СИНИЙ САМУРАЙ ПОБЕДИЛ!" : "КРАСНЫЙ САМУРАЙ ПОБЕДИЛ!");
                setTimeout(() => {
                    resetGame();
                }, 3000);
            }
        }
    }

    updateStats() {
        const prefix = this.isPlayer1 ? "player1" : "player2";
        document.getElementById(prefix + "-health").style.width = (this.health / this.maxHealth * 100) + "%";
        document.getElementById(prefix + "-score").textContent = this.score;
        document.getElementById(prefix + "-combo").textContent = this.combo;
    }
}

function showComboMessage(text) {
    const message = document.getElementById("combo-message");
    message.textContent = text;
    message.style.opacity = "1";
    setTimeout(() => {
        message.style.opacity = "0";
    }, 1000);
}

function createHitEffect(position) {
    // Создаем частицы для эффекта удара
    const particlesCount = 20;
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    for (let i = 0; i < particlesCount; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        
        // Случайное направление разлета
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.2;
        
        particle.velocity = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi) * speed,
            Math.sin(phi) * speed,
            Math.cos(theta) * Math.cos(phi) * speed
        );
        
        scene.add(particle);
        
        // Удаляем частицу через некоторое время
        setTimeout(() => {
            scene.remove(particle);
        }, 1000);
    }
}

function resetGame() {
    player1.health = player1.maxHealth;
    player2.health = player2.maxHealth;
    player1.combo = 0;
    player2.combo = 0;
    player1.mesh.position.set(-3, 1, 0);
    player2.mesh.position.set(3, 1, 0);
    player1.updateStats();
    player2.updateStats();
}

// Настройка сцены
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const floorGeometry = new THREE.PlaneGeometry(20, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    createSamurai();
}

function createSamurai() {
    player1 = new Samurai(0x0000ff, new THREE.Vector3(-3, 1, 0), true);
    player2 = new Samurai(0xff0000, new THREE.Vector3(3, 1, 0), false);
}

// Обработка клавиш
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function handleInput() {
    // Управление первым игроком (стрелки)
    if (keys['ArrowLeft']) player1.moveLeft();
    if (keys['ArrowRight']) player1.moveRight();
    if (keys['ArrowUp']) player1.jump();
    if (keys['ArrowDown']) player1.attack(player2);
    if (keys['Shift']) player1.block();

    // Управление вторым игроком (WASD)
    if (keys['a']) player2.moveLeft();
    if (keys['d']) player2.moveRight();
    if (keys['w']) player2.jump();
    if (keys['s']) player2.attack(player1);
    if (keys['q']) player2.block();
}

let particles = [];

function animate() {
    requestAnimationFrame(animate);

    handleInput();
    
    if (player1 && player2) {
        player1.update();
        player2.update();
    }

    // Обновление частиц
    particles.forEach((particle, index) => {
        if (particle.mesh) {
            particle.mesh.position.add(particle.velocity);
            particle.life -= 0.01;
            if (particle.life <= 0) {
                scene.remove(particle.mesh);
                particles.splice(index, 1);
            }
        }
    });

    renderer.render(scene, camera);
}

init();
animate(); 