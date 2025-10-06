// 生成更多星星
function createStars() {
    const decorations = document.querySelector('.decorations');
    const starCount = 50; // 额外生成的星星数量
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 随机位置
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        // 随机大小
        const size = Math.random() * 2 + 1;
        
        // 随机动画延迟
        const delay = Math.random() * 5;
        
        // 随机动画持续时间
        const duration = Math.random() * 3 + 2;
        
        // 应用样式
        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        decorations.appendChild(star);
    }
}

// 添加头像点击效果
function addAvatarEffects() {
    const avatars = document.querySelectorAll('.avatar');
    if (!avatars.length) return;

    avatars.forEach((avatar, index) => {
        avatar.addEventListener('click', function() {
            // 为不同的头像使用不同的颜色
            if (index === 0) {
                createParticles(this, 'avatar1-particle');
            } else {
                createParticles(this, 'avatar2-particle');
            }
            
            playClickSound();

            // 添加轻微的放大动画
            this.classList.add('scale-up');
            setTimeout(() => {
                this.classList.remove('scale-up');
            }, 300);
        });
    });
}

// 添加FOREVER LOVE粒子效果
// 粒子文字效果实现
function addForeverLoveEffect() {
    const foreverLoveContainer = document.querySelector('.forever-love-container');
    const canvas = document.getElementById('foreverLoveCanvas');
    const particleEffect = document.querySelector('.particle-effect');
    
    if (!foreverLoveContainer || !canvas || !particleEffect) return;

    // 设置Canvas尺寸
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let attractRange = 100;
    
    // 设置高DPI支持
    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
    }
    
    setupCanvas();
    
    // 创建文字粒子
    function createTextParticles() {
        particles = [];
        
        // 设置文字样式
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 绘制文字
        const texts = ['FOREVER', 'LOVE'];
        const lineHeight = 40; // 增大行高以适应更大的显示区域和文字
        
        texts.forEach((text, index) => {
            const x = canvas.clientWidth / 2;
            const y = (canvas.clientHeight / 2) - lineHeight/2 + (index * lineHeight);
            
            // 获取文字像素数据
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // 先设置字体样式，再进行测量
            tempCtx.font = 'bold 28px "Microsoft YaHei", sans-serif';
            tempCtx.fillStyle = '#ff6b6b';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            
            // 测量文字尺寸
            const metrics = tempCtx.measureText(text);
            tempCanvas.width = metrics.width + 40; // 增加额外空间，确保文字完整显示
            tempCanvas.height = lineHeight * 2;
            
            // 重新设置所有上下文属性（因为调整canvas尺寸会重置上下文）
            tempCtx.font = 'bold 28px "Microsoft YaHei", sans-serif';
            tempCtx.fillStyle = '#ff6b6b';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            
            // 绘制文字
            tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
            
            // 获取像素数据
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            // 遍历像素创建粒子
            const pixelStep = 3; // 减少步长，获取更密集的粒子
            for (let i = 0; i < imageData.data.length; i += pixelStep * 4) {
                const alpha = imageData.data[i + 3];
                if (alpha > 128) { // 只处理不透明的像素
                    const pixelIndex = i / 4;
                    const px = pixelIndex % tempCanvas.width;
                    const py = Math.floor(pixelIndex / tempCanvas.width);
                    
                    // 随机颜色变化
                    const hue = 340 + Math.random() * 20;
                    const saturation = 90 + Math.random() * 10;
                    const lightness = 60 + Math.random() * 10;
                    
                    particles.push({
                        x: x - tempCanvas.width / 2 + px,
                        y: y - tempCanvas.height / 2 + py,
                        originalX: x - tempCanvas.width / 2 + px,
                        originalY: y - tempCanvas.height / 2 + py,
                        size: 1.5 + Math.random() * 1, // 增大粒子大小，使文字更清晰
                        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                        velocityX: (Math.random() - 0.5) * 0.5,
                        velocityY: (Math.random() - 0.5) * 0.5,
                        ease: 0.03 + Math.random() * 0.02
                    });
                }
            }
        });
        
        // 启动动画
        animate();
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        
        particles.forEach(particle => {
            // 计算与鼠标的距离
            let dx = mouse.x - particle.x;
            let dy = mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果在吸引范围内
            if (mouse.x !== null && distance < attractRange) {
                // 排斥效果
                const force = (attractRange - distance) / attractRange;
                const angle = Math.atan2(dy, dx);
                particle.velocityX += Math.cos(angle) * force * 0.2;
                particle.velocityY += Math.sin(angle) * force * 0.2;
            } else {
                // 回到原始位置
                particle.velocityX += (particle.originalX - particle.x) * particle.ease;
                particle.velocityY += (particle.originalY - particle.y) * particle.ease;
            }
            
            // 摩擦力
            particle.velocityX *= 0.95;
            particle.velocityY *= 0.95;
            
            // 更新位置
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            
            // 绘制粒子
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // 鼠标移动事件
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    // 鼠标离开事件
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // 窗口大小变化事件
    window.addEventListener('resize', () => {
        setupCanvas();
        createTextParticles();
    });
    
    // 初始创建粒子
    createTextParticles();
    
    // 定时在粒子效果容器生成额外的粒子
    const generateDecorativeParticles = () => {
        createParticles(particleEffect, 'forever-love-particle');
    };
    
    // 初始延迟后开始生成装饰粒子
    setTimeout(() => {
        generateDecorativeParticles();
        setInterval(generateDecorativeParticles, 2000);
    }, 1000);
}

// 创建粒子效果
function createParticles(element, particleClass) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 根据屏幕尺寸调整粒子数量
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', particleClass);
        
        // 根据粒子类型设置不同颜色
        if (particleClass === 'avatar1-particle') {
            // 第一个头像：温暖的颜色
            particle.style.background = `hsl(${30 + Math.random() * 20}, 100%, 70%)`;
        } else if (particleClass === 'avatar2-particle') {
            // 第二个头像：冷色调
            particle.style.background = `hsl(${200 + Math.random() * 40}, 100%, 70%)`;
        } else {
            // FOREVER LOVE：浪漫的红色调
            particle.style.background = `hsl(${340 + Math.random() * 20}, 100%, 70%)`;
        }
        
        // 随机大小，根据屏幕尺寸调整
        const sizeFactor = isMobile ? 0.8 : 1;
        const size = (Math.random() * 10 + 5) * sizeFactor;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 圆形粒子
        particle.style.borderRadius = '50%';
        
        // 初始位置（元素中心）
        particle.style.position = 'fixed';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.transform = 'translate(-50%, -50%)';
        
        // 添加到页面
        document.body.appendChild(particle);
        
        // 随机动画
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 150 + 80;
        
        // 应用动画
        setTimeout(() => {
            const endX = centerX + Math.cos(angle) * speed;
            const endY = centerY + Math.sin(angle) * speed;
            
            particle.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            particle.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // 移除粒子
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 播放点击音效（简单的音频合成）
function playClickSound() {
    // 创建音频上下文
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 设置音频参数
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.2); // A4
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    // 播放声音
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// 创建页面滚动效果
function createParallaxEffect() {
    const moon = document.getElementById('moon');
    const messageContainer = document.querySelector('.message-container');
    
    window.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        // 月亮移动效果（与鼠标反向）
        moon.style.transform = `translate(${x * -10}px, ${y * -10}px) rotate(0deg)`;
        
        // 消息容器移动效果（与鼠标同向但更轻微）
        messageContainer.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
    });
}

// 添加页面加载动画
function addPageLoadAnimation() {
    const container = document.querySelector('.container');
    
    // 初始状态
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    // 页面加载后显示
    window.addEventListener('load', function() {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    });
}

// 添加背景音乐
function addBackgroundMusic() {
    // 创建音频元素
    const audio = document.createElement('audio');
    audio.src = 'MyLove.mp3';
    audio.loop = true; // 循环播放
    audio.volume = 0.3; // 初始音量
    audio.style.display = 'none';
    
    document.body.appendChild(audio);
    
    // 音乐控制按钮
    const musicControl = document.createElement('button');
    musicControl.classList.add('music-control');
    musicControl.innerHTML = '<span class="music-icon"></span>';
    musicControl.title = '点击播放/暂停音乐';
    
    document.body.appendChild(musicControl);
    
    // 播放状态
    let isPlaying = false;
    
    // 播放音乐函数（带淡入效果）
    function playMusic() {
        if (audio.paused) {
            // 尝试播放
            audio.play().then(() => {
                isPlaying = true;
                musicControl.classList.add('playing');
                
                // 淡入效果
                let volume = 0;
                audio.volume = volume;
                const fadeInInterval = setInterval(() => {
                    if (volume < 0.3) {
                        volume += 0.01;
                        audio.volume = volume;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 50);
            }).catch(error => {
                console.log('无法自动播放音乐，请点击按钮播放:', error);
            });
        } else {
            // 暂停音乐
            audio.pause();
            isPlaying = false;
            musicControl.classList.remove('playing');
        }
    }
    
    // 添加点击事件监听器
    musicControl.addEventListener('click', playMusic);
    
    // 点击屏幕任意处播放音乐
    function handleFirstInteraction() {
        playMusic();
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
    }
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    // 返回音频对象，以便在其他地方控制
    return audio;
}

// 添加动态样式
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 粒子样式 */
        .particle {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            z-index: 9999;
            transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out;
        }
        
        /* 爱心粒子样式 */
        .heart-particle {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out;
        }
        
        /* 震动动画 */
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }
        
        /* 弹跳动画 */
        .bounce {
            animation: bounce 1s ease-in-out;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-20px) rotate(-5deg); }
            50% { transform: translateY(0) rotate(5deg); }
            75% { transform: translateY(-10px) rotate(-5deg); }
        }
        
        /* 惊喜消息样式 */
        .surprise-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: rgba(255, 215, 0, 0.9);
            color: #333;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: transform 0.5s ease, opacity 0.5s ease;
            white-space: nowrap;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
        }
        
        /* 容器过渡动画 */
        .container {
            transition: opacity 1.5s ease, transform 1.5s ease;
        }
        
        /* 音乐控制按钮样式 */
        .music-control {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .music-control:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .music-control .music-icon {
            position: relative;
            display: block;
            width: 0;
            height: 0;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 15px solid #ffd700;
            margin-left: 2px;
        }
        
        .music-control.playing .music-icon {
            border-left: none;
            width: 15px;
            height: 16px;
            margin-left: 0;
        }
        
        .music-control.playing .music-icon::before,
        .music-control.playing .music-icon::after {
            content: '';
            position: absolute;
            top: 0;
            width: 5px;
            height: 16px;
            background-color: #ffd700;
        }
        
        .music-control.playing .music-icon::before {
            left: 0;
        }
        
        .music-control.playing .music-icon::after {
            right: 0;
        }
        
        /* 音乐波纹动画 */
        .music-control::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            background: rgba(255, 215, 0, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: musicRipple 2s infinite;
            opacity: 0;
        }
        
        .music-control.playing::before {
            opacity: 1;
        }
        
        @keyframes musicRipple {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.5;
            }
            100% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        
        /* 打字机效果样式 */
        .typewriter-text {
            overflow: hidden;
            border-right: 3px solid #ffd700;
            white-space: nowrap;
            margin: 0 auto;
            letter-spacing: 0.15em;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        
        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #ffd700; }
        }
        
        /* 文字淡入动画 */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .fade-in.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 漂浮效果 */
        .float {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-15px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        
        /* 萤火虫效果 */
        .firefly {
            position: fixed;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 150, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: glow 2s infinite alternate;
        }
        
        /* 礼物点击提醒脉动动画 */
        .pulse-reminder {
            animation: pulseReminder 2s infinite;
        }
        
        @keyframes pulseReminder {
            0%, 100% {
                transform: scale(1) translateY(0);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2),
                            0 0 30px rgba(255, 107, 107, 0.3);
            }
            50% {
                transform: scale(1.05) translateY(-5px);
                box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3),
                            0 0 40px rgba(255, 107, 107, 0.5);
            }
        }
        
        /* 头像提醒文字样式 */
        .avatar-reminder {
            position: absolute;
            background: rgba(255, 255, 255, 0.95);
            color: #ff6b6b;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
            white-space: nowrap;
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }
        
        @keyframes glow {
            0% {
                opacity: 0.4;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1.2);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 打字机效果函数
function typewriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // 打字完成后添加闪烁光标
            element.classList.add('typing-complete');
        }
    }
    
    type();
}

// 批量应用打字机效果
function applyTypewriterEffects() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        const originalContent = messageElement.innerHTML;
        const paragraphs = messageElement.querySelectorAll('p');
        
        // 清空消息内容
        messageElement.innerHTML = '';
        
        // 创建新的段落元素并应用打字机效果
        paragraphs.forEach((paragraph, index) => {
            const text = paragraph.textContent;
            const newPara = document.createElement('p');
            newPara.className = 'fade-in';
            newPara.style.transitionDelay = `${1.5 + index * 0.5}s`;
            messageElement.appendChild(newPara);
            
            // 逐个应用打字机效果
            setTimeout(() => {
                newPara.classList.add('active');
                typewriterEffect(newPara, text, 50);
            }, 1500 + index * 2000);
        });
    }
    
    // 标题也应用打字机效果
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        const titleText = titleElement.textContent;
        titleElement.classList.add('fade-in');
        
        setTimeout(() => {
            titleElement.classList.add('active');
            typewriterEffect(titleElement, titleText, 150);
        }, 500);
    }
}

// 创建萤火虫效果
function createFireflies(count = 20) {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        firefly.style.left = `${x}%`;
        firefly.style.top = `${y}%`;
        
        // 随机大小和亮度
        const size = Math.random() * 2 + 2;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.opacity = Math.random() * 0.6 + 0.3;
        
        // 随机动画延迟和持续时间
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;
        firefly.style.animationDelay = `${delay}s`;
        firefly.style.animationDuration = `${duration}s`;
        
        container.appendChild(firefly);
    }
}

// 创建烟花效果
function createHeartFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.id = 'fireworks-container';
    fireworksContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(fireworksContainer);
    
    // 随机生成烟花
    function launchFirework() {
        // 创建烟花粒子容器
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        // 随机位置
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight;
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * (window.innerHeight * 0.5);
        
        // 爱心颜色主题
        const colors = ['#ff6b6b', '#ff8fab', '#f06292', '#ec407a', '#d81b60', '#c2185b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置烟花样式
        firework.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            background: ${color};
            border-radius: 50%;
            top: ${startY}px;
            left: ${startX}px;
            transform: translateY(0);
            transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 0 10px ${color};
        `;
        
        fireworksContainer.appendChild(firework);
        
        // 触发发射动画
        setTimeout(() => {
            firework.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
        }, 10);
        
        // 爱心爆炸效果
        setTimeout(() => {
            explodeHeart(firework, color);
        }, 1000);
    }
    
    // 爱心爆炸效果
    function explodeHeart(firework, color) {
        const centerX = parseFloat(firework.style.left);
        const centerY = parseFloat(firework.style.top) + parseFloat(firework.style.transform.split(',')[1]) || 0;
        
        // 移除原来的烟花
        firework.remove();
        
        // 创建爱心形状的粒子
        const heartPoints = generateHeartPoints(centerX, centerY, 30, 50);
        
        heartPoints.forEach((point, index) => {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');
            
            // 随机大小
            const size = 3 + Math.random() * 3;
            
            // 设置粒子样式
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${point.y}px;
                left: ${point.x}px;
                transform: scale(0);
                opacity: 1;
                box-shadow: 0 0 10px ${color};
                transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease;
            `;
            
            fireworksContainer.appendChild(particle);
            
            // 触发爆炸动画
            setTimeout(() => {
                particle.style.transform = 'scale(1)';
            }, 10);
            
            // 添加扩散效果
            setTimeout(() => {
                particle.style.transform = `scale(0) translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)`;
                particle.style.opacity = '0';
            }, 500 + index * 10);
            
            // 移除粒子
            setTimeout(() => {
                particle.remove();
            }, 1600);
        });
    }
    
    // 定期发射烟花
    setInterval(launchFirework, 1500);
    
    // 初始发射一些烟花
    for (let i = 0; i < 5; i++) {
        setTimeout(launchFirework, i * 500);
    }
}

// 生成爱心形状的点 - 全局函数，供多个地方使用
function generateHeartPoints(centerX, centerY, size, pointCount) {
    const points = [];
    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;
        // 爱心参数方程
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        
        // 转换到屏幕坐标
        const screenX = centerX + x * size / 16;
        const screenY = centerY - y * size / 16;
        
        points.push({x: screenX, y: screenY});
    }
    return points;
}

// 文字粒子效果函数 - 修复版
function textToParticles(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn('Element not found:', elementId);
        return;
    }
    
    // 保存原始内容和样式
    const originalContent = element.innerHTML;
    const originalStyle = element.style.cssText;
    
    // 合并默认选项
    const { 
        particleSize = 4, 
        particleColor = '#ffd700',
        duration = 1.2,
        delay = 0,
        fadeIn = true,
        particleDensity = 0.7 // 增加密度，让文字形状更清晰
    } = options;
    
    // 获取元素的文本内容
    const text = element.textContent.trim();
    if (!text) return;
    
    // 创建粒子容器
    const particlesContainer = document.createElement('div');
    particlesContainer.id = `${elementId}-particles`;
    
    // 获取原始元素的样式，确保粒子容器与原元素有相同的尺寸和位置
    const originalRect = element.getBoundingClientRect();
    particlesContainer.style.cssText = `
        position: relative;
        width: ${originalRect.width}px;
        height: ${originalRect.height}px;
        display: block;
        overflow: visible;
        font: inherit;
        text-align: inherit;
        margin: 0;
        padding: 0;
        line-height: ${element.style.lineHeight || '1.5'}; // 确保行高正确
    `;
    
    // 清空并替换元素内容
    element.innerHTML = '';
    element.appendChild(particlesContainer);
    
    // 创建canvas用于文本测量（不可见）
    const canvas = document.createElement('canvas');
    canvas.width = originalRect.width * 2; // 增加分辨率以提高测量精度
    canvas.height = originalRect.height * 2;
    const ctx = canvas.getContext('2d');
    
    // 获取元素的计算样式
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    const fontSize = computedStyle.fontSize;
    const fontWeight = computedStyle.fontWeight;
    const lineHeight = computedStyle.lineHeight;
    
    // 设置canvas字体样式 - 提高精度
    const fontSizeNum = parseFloat(fontSize);
    ctx.font = `${fontWeight} ${fontSizeNum * 2}px ${fontFamily}`; // 放大2倍以提高精度
    ctx.textBaseline = 'top'; // 确保文本基线一致
    
    // 存储所有粒子
    const particles = [];
    
    // 计算文字的总宽度和高度
    const textMetrics = ctx.measureText(text);
    const textHeight = fontSizeNum || 20;
    const lineHeightNum = parseFloat(lineHeight) || textHeight * 1.5;
    
    // 为每个字符创建粒子
    for (let charIndex = 0; charIndex < text.length; charIndex++) {
        const char = text[charIndex];
        if (char === ' ') {
            // 为空格创建一些粒子，确保文本流正确
            const spaceWidth = ctx.measureText(' ').width / 2;
            continue;
        }
        
        // 计算每个字符的位置（考虑缩放）
        const charWidth = ctx.measureText(char).width / 2;
        const charX = ctx.measureText(text.substring(0, charIndex)).width / 2;
        
        // 根据字符大小和密度决定粒子数量
        const baseParticleCount = Math.ceil(charWidth * textHeight / (particleSize * particleSize) * particleDensity);
        const charParticleCount = Math.max(5, baseParticleCount); // 增加最小粒子数
        
        for (let i = 0; i < charParticleCount; i++) {
            // 在字符区域内更智能地分布粒子，避免边缘
            const padding = Math.max(particleSize, 2); // 添加内边距
            const particleX = charX + padding + Math.random() * (charWidth - padding * 2);
            const particleY = padding + Math.random() * (textHeight - padding * 2);
            
            // 创建粒子元素
            const particle = document.createElement('div');
            particle.classList.add('text-particle');
            
            // 随机颜色（从爱心色系中选择）
            const heartColors = ['#ff6b6b', '#ff8fab', '#f06292', '#ffd700', '#ffb700'];
            const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
            
            // 粒子初始随机位置（远离目标位置但更有规律）
            const initialX = particleX + (Math.random() - 0.5) * 40;
            const initialY = particleY + (Math.random() - 0.5) * 40;
            
            // 设置粒子样式
            particle.style.cssText = `
                position: absolute;
                width: ${particleSize}px;
                height: ${particleSize}px;
                background: ${randomColor};
                border-radius: 50%;
                top: ${initialY}px;
                left: ${initialX}px;
                opacity: ${fadeIn ? 0 : 1};
                transform: scale(${fadeIn ? 0 : 1});
                pointer-events: none;
                box-shadow: 0 0 8px ${randomColor};
                transition: all ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1);
                z-index: 1;
            `;
            
            particlesContainer.appendChild(particle);
            
            // 存储粒子信息
            particles.push({
                element: particle,
                targetX: particleX,
                targetY: particleY,
                initialX: initialX,
                initialY: initialY,
                x: initialX,
                y: initialY,
                delay: (delay + charIndex * 0.05 + i * 0.01) % 1 // 调整延迟，让动画更流畅
            });
        }
    }
    
    // 触发粒子动画
    setTimeout(() => {
        particles.forEach((particle, index) => {
            // 延迟触发每个粒子，创建错落有致的效果
            setTimeout(() => {
                particle.element.style.opacity = '1';
                particle.element.style.transform = 'scale(1)';
                particle.element.style.left = `${particle.targetX}px`;
                particle.element.style.top = `${particle.targetY}px`;
            }, particle.delay * 1000);
        });
    }, 50);
    
    // 粒子漂浮效果 - 更简洁的实现
    let animationId;
    function animateParticles() {
        particles.forEach(particle => {
            // 轻微的随机移动，使粒子看起来在呼吸
            const randomX = (Math.random() - 0.5) * 0.3;
            const randomY = (Math.random() - 0.5) * 0.3;
            
            // 更新位置
            particle.x += randomX;
            particle.y += randomY;
            
            // 限制范围，防止粒子飘得太远
            const maxDistance = 3; // 减小最大距离，让粒子更聚集
            if (Math.abs(particle.x - particle.targetX) > maxDistance) {
                particle.x = particle.targetX + maxDistance * Math.sign(particle.x - particle.targetX);
            }
            if (Math.abs(particle.y - particle.targetY) > maxDistance) {
                particle.y = particle.targetY + maxDistance * Math.sign(particle.y - particle.targetY);
            }
            
            // 应用位置
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // 开始漂浮动画
    setTimeout(() => {
        animateParticles();
    }, delay * 1000 + duration * 1000);
    
    // 返回清理函数
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        element.innerHTML = originalContent;
        element.style.cssText = originalStyle;
    };
}

// 批量应用文字粒子效果
function applyTextParticleEffects() {
    // 为标题应用粒子效果
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.id = 'title-text';
        textToParticles('title-text', {
            particleSize: 5,
            duration: 1.5,
            delay: 0.3,
            fadeIn: true,
            particleDensity: 0.7 // 增加密度，让文字形状更清晰
        });
    }
    
    // 为消息内容应用粒子效果
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // 获取所有段落并保存内容
        const paragraphs = messageElement.querySelectorAll('p');
        const paragraphContents = Array.from(paragraphs).map(p => p.textContent);
        
        // 清空消息内容
        messageElement.innerHTML = '';
        
        // 为每个段落创建容器并应用粒子效果
        paragraphContents.forEach((content, index) => {
            const paraContainer = document.createElement('div');
            paraContainer.className = 'message-paragraph';
            paraContainer.style.cssText = `
                margin-bottom: 20px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
                transition-delay: ${0.8 + index * 0.3}s;
            `;
            messageElement.appendChild(paraContainer);
            
            // 创建段落文本元素
            const paraText = document.createElement('div');
            paraText.id = `message-para-${index}`;
            paraText.textContent = content;
            paraText.style.cssText = `
                font: inherit;
                text-align: inherit;
            `;
            paraContainer.appendChild(paraText);
            
            // 先显示容器，然后应用粒子效果
            setTimeout(() => {
                paraContainer.style.opacity = '1';
                paraContainer.style.transform = 'translateY(0)';
                
                // 延迟应用粒子效果，确保容器已显示
                setTimeout(() => {
                    textToParticles(`message-para-${index}`, {
                        particleSize: 3,
                        duration: 1.2,
                        delay: 0.5,
                        fadeIn: true,
                        particleDensity: 0.7 // 增加密度，让文字形状更清晰
                    });
                }, 300);
            }, 100);
        });
    }
}

// 创建爱心粒子效果函数
function createHeartParticlesInFrontOfText() {
    const titleElement = document.querySelector('h1');
    const messageElement = document.getElementById('message');
    const container = document.querySelector('.container');
    
    if (!titleElement || !messageElement || !container) return;
    
    // 创建爱心粒子容器
    const heartParticlesContainer = document.createElement('div');
    heartParticlesContainer.id = 'heart-particles-container';
    heartParticlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        overflow: visible;
        display: none;
    `;
    container.appendChild(heartParticlesContainer);
    
    // 获取元素的位置和大小
    const containerRect = container.getBoundingClientRect();
    const titleRect = titleElement.getBoundingClientRect();
    const messageRect = messageElement.getBoundingClientRect();
    
    // 计算爱心粒子应该显示的位置（文字前面中间）
    // 水平位置：文字区域中间偏右
    const centerX = containerRect.left + containerRect.width / 2;
    // 垂直位置：标题和消息的垂直中心
    const centerY = titleRect.top + (messageRect.bottom - titleRect.top) / 2;
    
    // 显示爱心粒子容器
    heartParticlesContainer.style.display = 'block';
    
    // 创建爱心形状的粒子 - 增大爱心整体尺寸，保持粒子稠密度不变
    const heartPoints = generateHeartPoints(centerX, centerY, 90, 60); // 增大爱心整体尺寸
    
    // 爱心颜色主题
    const colors = ['#ff6b6b', '#ff8fab', '#f06292', '#ec407a', '#d81b60'];
    
    heartPoints.forEach((point, index) => {
        const particle = document.createElement('div');
        particle.classList.add('heart-particle');
        
        // 随机大小 - 增大粒子尺寸
        const size = 8 + Math.random() * 6; // 8-14px大小
        
        // 随机颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置粒子样式 - 修复位置计算
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            top: ${point.y - containerRect.top}px;
            left: ${point.x - containerRect.left}px;
            opacity: 0;
            transform: scale(0);
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            transition: opacity 0.5s ease, transform 0.5s ease;
            transition-delay: ${index * 0.02}s;
        `;
        
        heartParticlesContainer.appendChild(particle);
        
        // 触发显示动画
        setTimeout(() => {
            particle.style.opacity = '1';
            particle.style.transform = 'scale(1)';
        }, 10);
    });
    
    // 7秒后移除爱心粒子效果
    setTimeout(() => {
        const particles = heartParticlesContainer.querySelectorAll('.heart-particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
                
                // 完全淡出后移除粒子
                if (index === particles.length - 1) {
                    setTimeout(() => {
                        heartParticlesContainer.remove();
                    }, 500);
                }
            }, index * 0.01);
        });
    }, 7000);
}

// 创建一个新函数来结合打字机效果和爱心粒子效果
function applyCombinedTextEffects() {
    // 跟踪是否所有文字都已显示完成
    let allTextComplete = false;
    let titleComplete = false;
    let paragraphsComplete = 0;
    const totalParagraphs = document.getElementById('message')?.querySelectorAll('p').length || 0;
    
    // 检查是否所有文字都已显示完成的函数
    function checkAllTextComplete() {
        if (titleComplete && paragraphsComplete === totalParagraphs && !allTextComplete) {
            allTextComplete = true;
            // 所有文字显示完成后，延迟1秒显示爱心粒子效果
            setTimeout(createHeartParticlesInFrontOfText, 1000);
        }
    }
    
    // 为标题应用打字机效果
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.id = 'title-text';
        const titleText = titleElement.textContent;
        
        // 先应用打字机效果
        titleElement.classList.add('fade-in');
        titleElement.innerHTML = '';
        
        setTimeout(() => {
            titleElement.classList.add('active');
            
            // 打字机效果
            let i = 0;
            function type() {
                if (i < titleText.length) {
                    titleElement.innerHTML += titleText.charAt(i);
                    i++;
                    setTimeout(type, 150);
                } else {
                    // 打字完成
                    titleElement.classList.add('typing-complete');
                    titleComplete = true;
                    checkAllTextComplete();
                }
            }
            
            type();
        }, 500);
    }
    
    // 为消息内容应用打字机效果
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // 获取所有段落并保存内容
        const paragraphs = messageElement.querySelectorAll('p');
        const paragraphContents = Array.from(paragraphs).map(p => p.textContent);
        
        // 清空消息内容
        messageElement.innerHTML = '';
        
        // 为每个段落创建容器并应用组合效果
        paragraphContents.forEach((content, index) => {
            const paraContainer = document.createElement('div');
            paraContainer.className = 'message-paragraph';
            paraContainer.style.cssText = `
                margin-bottom: 20px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
                transition-delay: ${0.8 + index * 0.3}s;
            `;
            messageElement.appendChild(paraContainer);
            
            // 创建段落文本元素
            const paraText = document.createElement('div');
            paraText.id = `message-para-${index}`;
            paraText.style.cssText = `
                font: inherit;
                text-align: inherit;
            `;
            paraContainer.appendChild(paraText);
            
            // 先显示容器，然后应用打字机效果
            setTimeout(() => {
                paraContainer.style.opacity = '1';
                paraContainer.style.transform = 'translateY(0)';
                
                // 延迟应用打字机效果，确保容器已显示
                setTimeout(() => {
                    const paraTextElement = document.getElementById(`message-para-${index}`);
                    
                    // 打字机效果
                    let i = 0;
                    function type() {
                        if (i < content.length) {
                            paraTextElement.innerHTML += content.charAt(i);
                            i++;
                            setTimeout(type, 50);
                        } else {
                            // 打字完成
                            paraTextElement.classList.add('typing-complete');
                            paragraphsComplete++;
                            checkAllTextComplete();
                        }
                    }
                    
                    type();
                }, 300);
            }, 100);
        });
    }
}

// 增强粒子效果
function enhanceParticles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 增强后的粒子效果 */
        .particle {
            background: radial-gradient(circle, var(--particle-color, #ffd700), transparent 70%);
            animation: particle-glow 0.6s ease-out;
        }
        
        @keyframes particle-glow {
            0% {
                opacity: 1;
                transform: scale(1);
                box-shadow: 0 0 15px var(--particle-color, #ffd700), 0 0 30px var(--particle-color, #ffd700);
            }
            100% {
                opacity: 0;
                transform: scale(1.5);
                box-shadow: 0 0 5px var(--particle-color, #ffd700), 0 0 10px var(--particle-color, #ffd700);
            }
        }
        
        /* 增强后的月饼粒子 */
        .mooncake-particle {
            background: radial-gradient(circle, #ffd700, #ffb700 70%);
            box-shadow: 0 0 10px #ffd700, 0 0 20px #ffb700;
        }
        
        /* 增强后的礼物盒粒子 */
        .gift-particle {
            background: radial-gradient(circle, #ff6b6b, #ee5253 70%);
            box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ee5253;
        }
        
        /* 增强爱心粒子效果 */
        .heart-particle {
            animation: heartParticleGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes heartParticleGlow {
            0% {
                box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
                transform: scale(1);
            }
            100% {
                box-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 40px currentColor;
                transform: scale(1.1);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 美化月亮效果
function enhanceMoonEffect() {
    const moon = document.getElementById('moon');
    if (moon) {
        // 创建光晕效果
        const glow = document.createElement('div');
        glow.classList.add('moon-glow');
        glow.style.cssText = `
            position: absolute;
            width: 130%;
            height: 130%;
            top: -15%;
            left: -15%;
            background: radial-gradient(circle, rgba(255, 250, 205, 0.3), transparent 70%);
            border-radius: 50%;
            animation: glowPulse 6s ease-in-out infinite alternate;
            pointer-events: none;
        `;
        
        moon.parentNode.insertBefore(glow, moon.nextSibling);
        
        // 添加月球表面纹理
        const texture = document.createElement('div');
        texture.classList.add('moon-texture');
        texture.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
            border-radius: 50%;
            opacity: 0.3;
        `;
        
        moon.appendChild(texture);
    }
}

// 增强文字粒子样式
function addTextParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 文字粒子基础样式 */
        .text-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        }
        
        /* 粒子发光效果 */
        .text-particle {
            animation: textParticleGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes textParticleGlow {
            0% {
                box-shadow: 0 0 4px currentColor, 0 0 8px currentColor;
            }
            100% {
                box-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
            }
        }
        
        /* 消息段落容器 */
        .message-paragraph {
            position: relative;
            display: block;
        }
        
        /* 标题粒子效果增强 */
        #title-text-particles .text-particle {
            filter: brightness(1.2);
        }
        
        /* 粒子响应式调整 */
        @media (max-width: 768px) {
            .text-particle {
                box-shadow: 0 0 6px currentColor !important;
            }
        }
        
        /* 文字粒子动画过渡效果优化 */
        .text-particle {
            will-change: transform, opacity, top, left;
            backface-visibility: hidden;
            perspective: 1000px;
        }
        
        /* 确保粒子容器不会影响页面布局 */
        [id$="-particles"] {
            display: inline-block;
            vertical-align: baseline;
        }
    `;
    document.head.appendChild(style);
}

// 打字机效果函数
function typewriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // 打字完成后添加闪烁光标
            element.classList.add('typing-complete');
        }
    }
    
    type();
}

// 批量应用打字机效果
function applyTypewriterEffects() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        const originalContent = messageElement.innerHTML;
        const paragraphs = messageElement.querySelectorAll('p');
        
        // 清空消息内容
        messageElement.innerHTML = '';
        
        // 创建新的段落元素并应用打字机效果
        paragraphs.forEach((paragraph, index) => {
            const text = paragraph.textContent;
            const newPara = document.createElement('p');
            newPara.className = 'fade-in';
            newPara.style.transitionDelay = `${1.5 + index * 0.5}s`;
            messageElement.appendChild(newPara);
            
            // 逐个应用打字机效果
            setTimeout(() => {
                newPara.classList.add('active');
                typewriterEffect(newPara, text, 50);
            }, 1500 + index * 2000);
        });
    }
    
    // 标题也应用打字机效果
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        const titleText = titleElement.textContent;
        titleElement.classList.add('fade-in');
        
        setTimeout(() => {
            titleElement.classList.add('active');
            typewriterEffect(titleElement, titleText, 150);
        }, 500);
    }
}

// 创建萤火虫效果
function createFireflies(count = 20) {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        firefly.style.left = `${x}%`;
        firefly.style.top = `${y}%`;
        
        // 随机大小和亮度
        const size = Math.random() * 2 + 2;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.opacity = Math.random() * 0.6 + 0.3;
        
        // 随机动画延迟和持续时间
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;
        firefly.style.animationDelay = `${delay}s`;
        firefly.style.animationDuration = `${duration}s`;
        
        container.appendChild(firefly);
    }
}

// 创建烟花效果
function createHeartFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.id = 'fireworks-container';
    fireworksContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(fireworksContainer);
    
    // 随机生成烟花
    function launchFirework() {
        // 创建烟花粒子容器
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        // 随机位置
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight;
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * (window.innerHeight * 0.5);
        
        // 爱心颜色主题
        const colors = ['#ff6b6b', '#ff8fab', '#f06292', '#ec407a', '#d81b60', '#c2185b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置烟花样式
        firework.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            background: ${color};
            border-radius: 50%;
            top: ${startY}px;
            left: ${startX}px;
            transform: translateY(0);
            transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 0 10px ${color};
        `;
        
        fireworksContainer.appendChild(firework);
        
        // 触发发射动画
        setTimeout(() => {
            firework.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
        }, 10);
        
        // 爱心爆炸效果
        setTimeout(() => {
            explodeHeart(firework, color);
        }, 1000);
    }
    
    // 爱心爆炸效果
    function explodeHeart(firework, color) {
        const centerX = parseFloat(firework.style.left);
        const centerY = parseFloat(firework.style.top) + parseFloat(firework.style.transform.split(',')[1]) || 0;
        
        // 移除原来的烟花
        firework.remove();
        
        // 创建爱心形状的粒子
        const heartPoints = generateHeartPoints(centerX, centerY, 30, 50);
        
        heartPoints.forEach((point, index) => {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');
            
            // 随机大小
            const size = 3 + Math.random() * 3;
            
            // 设置粒子样式
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${point.y}px;
                left: ${point.x}px;
                transform: scale(0);
                opacity: 1;
                box-shadow: 0 0 10px ${color};
                transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease;
            `;
            
            fireworksContainer.appendChild(particle);
            
            // 触发爆炸动画
            setTimeout(() => {
                particle.style.transform = 'scale(1)';
            }, 10);
            
            // 添加扩散效果
            setTimeout(() => {
                particle.style.transform = `scale(0) translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)`;
                particle.style.opacity = '0';
            }, 500 + index * 10);
            
            // 移除粒子
            setTimeout(() => {
                particle.remove();
            }, 1600);
        });
    }
    
    // 生成爱心形状的点
    function generateHeartPoints(centerX, centerY, size, pointCount) {
        const points = [];
        for (let i = 0; i < pointCount; i++) {
            const t = (i / pointCount) * Math.PI * 2;
            // 爱心参数方程
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            
            // 转换到屏幕坐标
            const screenX = centerX + x * size / 16;
            const screenY = centerY - y * size / 16;
            
            points.push({x: screenX, y: screenY});
        }
        return points;
    }
    
    // 定期发射烟花
    setInterval(launchFirework, 1500);
    
    // 初始发射一些烟花
    for (let i = 0; i < 5; i++) {
        setTimeout(launchFirework, i * 500);
    }
}

// 文字粒子效果函数 - 优化版
function textToParticles(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn('Element not found:', elementId);
        return;
    }
    
    // 保存原始内容和样式
    const originalContent = element.innerHTML;
    const originalStyle = element.style.cssText;
    
    // 合并默认选项
    const { 
        particleSize = 3,
        duration = 1.0,
        delay = 0,
        fadeIn = true,
        particleDensity = 0.7,
        enableFloat = true,
        floatRange = 2
    } = options;
    
    // 获取元素的文本内容
    const text = element.textContent.trim();
    if (!text) return;
    
    // 获取元素的计算样式
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    const fontSize = computedStyle.fontSize;
    const fontWeight = computedStyle.fontWeight;
    const lineHeight = computedStyle.lineHeight;
    const textColor = computedStyle.color;
    
    // 创建粒子容器并设置精确样式
    const particlesContainer = document.createElement('div');
    particlesContainer.id = `${elementId}-particles`;
    particlesContainer.style.cssText = `
        position: relative;
        width: 100%;
        min-height: ${element.offsetHeight}px;
        display: inline-block;
        overflow: visible;
        font: inherit;
        text-align: inherit;
        padding: 4px 0;
    `;
    
    // 清空并替换元素内容
    element.innerHTML = '';
    element.appendChild(particlesContainer);
    
    // 创建canvas用于文本测量（提高分辨率）
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    ctx.textBaseline = 'middle'; // 设置文本基线为中间
    
    // 计算文字的总宽度和高度
    const textMetrics = ctx.measureText(text);
    const textHeight = parseInt(fontSize) || 20;
    const lineHeightValue = parseInt(lineHeight) || textHeight * 1.2;
    
    // 爱心色系
    const heartColors = ['#ff6b6b', '#ff8fab', '#f06292', '#ffd700', '#ffb700'];
    
    // 存储所有粒子
    const particles = [];
    
    // 为每个字符创建粒子
    for (let charIndex = 0; charIndex < text.length; charIndex++) {
        const char = text[charIndex];
        
        // 计算每个字符的位置
        const charWidth = ctx.measureText(char).width;
        const charX = ctx.measureText(text.substring(0, charIndex)).width;
        const charY = textHeight / 2; // 垂直居中
        
        // 计算字符区域
        const charArea = charWidth * textHeight;
        const baseParticleCount = Math.ceil(charArea / (particleSize * particleSize) * particleDensity);
        const charParticleCount = Math.max(char === ' ' ? 2 : 5, baseParticleCount);
        
        // 为空格创建少量粒子，确保文本流的连续性
        if (char === ' ') {
            for (let i = 0; i < 2; i++) {
                const particleX = charX + (charWidth * (i + 1) / 3);
                const particleY = charY;
                createParticle(particleX, particleY, charIndex);
            }
            continue;
        }
        
        // 创建粒子点阵
        const gridSize = Math.ceil(Math.sqrt(charParticleCount));
        const cellWidth = charWidth / gridSize;
        const cellHeight = textHeight / gridSize;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                // 计算网格位置，加入一些随机性
                const randomOffset = 0.2; // 随机性百分比
                const offsetX = (Math.random() - 0.5) * randomOffset * cellWidth;
                const offsetY = (Math.random() - 0.5) * randomOffset * cellHeight;
                
                const particleX = charX + i * cellWidth + cellWidth / 2 + offsetX;
                const particleY = charY - textHeight / 2 + j * cellHeight + cellHeight / 2 + offsetY;
                
                // 添加内边距，避免粒子太靠近字符边缘
                const padding = 2;
                if (particleX < charX + padding || particleX > charX + charWidth - padding ||
                    particleY < charY - textHeight / 2 + padding || particleY > charY + textHeight / 2 - padding) {
                    continue;
                }
                
                createParticle(particleX, particleY, charIndex);
            }
        }
    }
    
    // 创建单个粒子的辅助函数
    function createParticle(targetX, targetY, charIndex) {
        // 随机颜色
        const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
        
        // 粒子初始随机位置（更合理的范围）
        const initialOffset = 60;
        const initialX = targetX + (Math.random() - 0.5) * initialOffset;
        const initialY = targetY + (Math.random() - 0.5) * initialOffset;
        
        // 创建粒子元素
        const particle = document.createElement('div');
        particle.classList.add('text-particle');
        
        // 设置粒子样式
        particle.style.cssText = `
            position: absolute;
            width: ${particleSize}px;
            height: ${particleSize}px;
            background: ${randomColor};
            border-radius: 50%;
            top: ${initialY}px;
            left: ${initialX}px;
            opacity: ${fadeIn ? 0 : 1};
            transform: scale(${fadeIn ? 0 : 1});
            pointer-events: none;
            box-shadow: 0 0 6px ${randomColor};
            transition: all ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 2;
        `;
        
        particlesContainer.appendChild(particle);
        
        // 存储粒子信息
        particles.push({
            element: particle,
            targetX: targetX,
            targetY: targetY,
            initialX: initialX,
            initialY: initialY,
            x: initialX,
            y: initialY,
            // 更合理的延迟时间
            delay: delay + (charIndex * 0.05) + (Math.random() * 0.3)
        });
    }
    
    // 触发粒子动画
    setTimeout(() => {
        particles.forEach((particle, index) => {
            // 延迟触发每个粒子，创建错落有致的效果
            setTimeout(() => {
                particle.element.style.opacity = '1';
                particle.element.style.transform = 'scale(1)';
                particle.element.style.left = `${particle.targetX}px`;
                particle.element.style.top = `${particle.targetY}px`;
            }, particle.delay * 1000);
        });
    }, 50);
    
    // 粒子漂浮效果 - 优化版
    let animationId;
    if (enableFloat) {
        function animateParticles() {
            particles.forEach(particle => {
                // 轻微的随机移动，使粒子看起来在呼吸
                const randomX = (Math.random() - 0.5) * 0.2;
                const randomY = (Math.random() - 0.5) * 0.2;
                
                // 更新位置
                particle.x += randomX;
                particle.y += randomY;
                
                // 限制范围，防止粒子飘得太远
                if (Math.abs(particle.x - particle.targetX) > floatRange) {
                    particle.x = particle.targetX + floatRange * Math.sign(particle.x - particle.targetX);
                }
                if (Math.abs(particle.y - particle.targetY) > floatRange) {
                    particle.y = particle.targetY + floatRange * Math.sign(particle.y - particle.targetY);
                }
                
                // 应用位置
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
            });
            
            animationId = requestAnimationFrame(animateParticles);
        }
        
        // 开始漂浮动画
        setTimeout(() => {
            animateParticles();
        }, delay * 1000 + duration * 1000);
    }
    
    // 返回清理函数
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        element.innerHTML = originalContent;
        element.style.cssText = originalStyle;
    };
}

// 批量应用文字粒子效果
function applyTextParticleEffects() {
    // 为标题应用粒子效果
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.id = 'title-text';
        textToParticles('title-text', {
            particleSize: 5,
            duration: 1.5,
            delay: 0.3,
            fadeIn: true,
            particleDensity: 0.7 // 增加密度，让文字形状更清晰
        });
    }
    
    // 为消息内容应用粒子效果
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // 获取所有段落并保存内容
        const paragraphs = messageElement.querySelectorAll('p');
        const paragraphContents = Array.from(paragraphs).map(p => p.textContent);
        
        // 清空消息内容
        messageElement.innerHTML = '';
        
        // 为每个段落创建容器并应用粒子效果
        paragraphContents.forEach((content, index) => {
            const paraContainer = document.createElement('div');
            paraContainer.className = 'message-paragraph';
            paraContainer.style.cssText = `
                margin-bottom: 20px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
                transition-delay: ${0.8 + index * 0.3}s;
            `;
            messageElement.appendChild(paraContainer);
            
            // 创建段落文本元素
            const paraText = document.createElement('div');
            paraText.id = `message-para-${index}`;
            paraText.textContent = content;
            paraText.style.cssText = `
                font: inherit;
                text-align: inherit;
            `;
            paraContainer.appendChild(paraText);
            
            // 先显示容器，然后应用粒子效果
            setTimeout(() => {
                paraContainer.style.opacity = '1';
                paraContainer.style.transform = 'translateY(0)';
                
                // 延迟应用粒子效果，确保容器已显示
                setTimeout(() => {
                    textToParticles(`message-para-${index}`, {
                        particleSize: 3,
                        duration: 1.2,
                        delay: 0.5,
                        fadeIn: true,
                        particleDensity: 0.7 // 增加密度，让文字形状更清晰
                    });
                }, 300);
            }, 100);
        });
    }
}

// 增强粒子效果
function enhanceParticles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 增强后的粒子效果 */
        .particle {
            background: radial-gradient(circle, var(--particle-color, #ffd700), transparent 70%);
            animation: particle-glow 0.6s ease-out;
        }
        
        @keyframes particle-glow {
            0% {
                opacity: 1;
                transform: scale(1);
                box-shadow: 0 0 15px var(--particle-color, #ffd700), 0 0 30px var(--particle-color, #ffd700);
            }
            100% {
                opacity: 0;
                transform: scale(1.5);
                box-shadow: 0 0 5px var(--particle-color, #ffd700), 0 0 10px var(--particle-color, #ffd700);
            }
        }
        
        /* 增强后的月饼粒子 */
        .mooncake-particle {
            background: radial-gradient(circle, #ffd700, #ffb700 70%);
            box-shadow: 0 0 10px #ffd700, 0 0 20px #ffb700;
        }
        
        /* 增强后的礼物盒粒子 */
        .gift-particle {
            background: radial-gradient(circle, #ff6b6b, #ee5253 70%);
            box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ee5253;
        }
    `;
    
    document.head.appendChild(style);
}

// 美化月亮效果
function enhanceMoonEffect() {
    const moon = document.getElementById('moon');
    if (moon) {
        // 创建光晕效果
        const glow = document.createElement('div');
        glow.classList.add('moon-glow');
        glow.style.cssText = `
            position: absolute;
            width: 130%;
            height: 130%;
            top: -15%;
            left: -15%;
            background: radial-gradient(circle, rgba(255, 250, 205, 0.3), transparent 70%);
            border-radius: 50%;
            animation: glowPulse 6s ease-in-out infinite alternate;
            pointer-events: none;
        `;
        
        moon.parentNode.insertBefore(glow, moon.nextSibling);
        
        // 添加月球表面纹理
        const texture = document.createElement('div');
        texture.classList.add('moon-texture');
        texture.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
            border-radius: 50%;
            opacity: 0.3;
        `;
        
        moon.appendChild(texture);
    }
}

// 增强文字效果
function enhanceTextEffects() {
    const style = document.createElement('style');
    style.textContent = `
        /* 增强标题效果 */
        h1 {
            position: relative;
            text-shadow: 
                0 0 10px rgba(255, 215, 0, 0.7),
                0 0 20px rgba(255, 215, 0, 0.5),
                0 0 30px rgba(255, 215, 0, 0.3);
            animation: titleGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes titleGlow {
            0% {
                text-shadow: 
                    0 0 10px rgba(255, 215, 0, 0.7),
                    0 0 20px rgba(255, 215, 0, 0.5);
            }
            100% {
                text-shadow: 
                    0 0 20px rgba(255, 215, 0, 0.9),
                    0 0 30px rgba(255, 215, 0, 0.7),
                    0 0 40px rgba(255, 215, 0, 0.5);
            }
        }
        
        /* 增强消息文字效果 - 适配新的粒子效果结构 */
        .message {
            position: relative;
            z-index: 1;
        }
        
        /* 消息段落容器效果 */
        .message-paragraph {
            position: relative;
            z-index: 1;
        }
        
        /* 增强签名效果 */
        .signature {
            opacity: 0;
            transform: translateY(20px);
            animation: signatureAppear 1s ease forwards 8s;
        }
        
        @keyframes signatureAppear {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 增强漂浮动画 */
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            25% {
                transform: translateY(-15px) rotate(-2deg);
            }
            50% {
                transform: translateY(0px) rotate(2deg);
            }
            75% {
                transform: translateY(-10px) rotate(-1deg);
            }
        }
        
        /* 增强礼物盒和月饼效果 */
        .mooncake, .gift-box {
            transition: transform 0.3s ease, filter 0.3s ease;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
        
        .mooncake:hover, .gift-box:hover {
            transform: scale(1.05) translateY(-5px);
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
        }
    `;
    
    document.head.appendChild(style);
}

// 处理窗口大小变化的响应式调整
function handleResize() {
    // 重新应用漂浮动画延迟
    const gifts = document.querySelectorAll('.gifts > div');
    gifts.forEach((gift, index) => {
        gift.style.animationDelay = `${index * 0.5}s`;
    });
    
    // 更新头像提醒文字位置（如果存在）
    const reminderText = document.querySelector('.avatar-reminder');
    const avatars = document.querySelectorAll('.avatar');
    if (reminderText && avatars.length > 1) {
        const targetAvatar = avatars[1]; // 选择第二个头像
        const avatarRect = targetAvatar.getBoundingClientRect();
        const messageContainer = document.querySelector('.message-container');
        if (messageContainer) {
            const containerRect = messageContainer.getBoundingClientRect();
            reminderText.style.top = `${avatarRect.bottom - containerRect.top + 10}px`;
            reminderText.style.left = `${avatarRect.left - containerRect.left + avatarRect.width / 2}px`;
        }
    }
}

// 初始化所有功能
function init() {
    addDynamicStyles();
    addPageLoadAnimation();
    createStars();
    createParallaxEffect();
    addBackgroundMusic(); // 添加背景音乐
    addTextParticleStyles(); // 添加文字粒子样式
    
    // 添加新功能
    applyCombinedTextEffects(); // 应用组合文字效果（打字机+粒子效果）
    createFireflies();
    addScreenClickEffect(); // 添加点击屏幕效果
    
    // 增强视觉效果
    createHeartFireworks(); // 添加爱心烟花背景
    enhanceParticles(); // 增强粒子效果
    enhanceMoonEffect(); // 美化月亮效果
    enhanceTextEffects(); // 增强文字效果
    
    // 添加头像和FOREVER LOVE效果
    addAvatarEffects();
    addForeverLoveEffect();
    
    // 为元素添加漂浮效果
    const moon = document.getElementById('moon');
    if (moon) {
        moon.classList.add('float');
    }
    
    // 为头像容器添加漂浮效果
    const avatarContainers = document.querySelectorAll('.avatar-container');
    avatarContainers.forEach((container, index) => {
        container.style.animationDelay = `${index * 0.5}s`;
    });
    
    // 为FOREVER LOVE容器添加漂浮效果
    const foreverLoveContainer = document.querySelector('.forever-love-container');
    if (foreverLoveContainer) {
        foreverLoveContainer.style.animationDelay = '1s';
    }
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
    
    // 添加头像点击提醒
    setupAvatarClickReminder();
}

// 添加点击屏幕效果
function addScreenClickEffect() {
    // 为document添加点击事件
    document.addEventListener('click', function(e) {
        // 排除特定元素的点击（如按钮、音乐控制等）
        if (e.target.classList.contains('music-control') || 
            e.target.closest('.music-control') ||
            e.target.classList.contains('avatar-reminder')) {
            return;
        }
        
        // 创建爱心粒子效果
        createHeartParticles(e.clientX, e.clientY);
        
        // 播放轻点击音效
        playLightClickSound();
    });
}

// 创建爱心粒子效果
function createHeartParticles(x, y) {
    // 根据屏幕尺寸调整粒子数量
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 10 : 15;
    
    for (let i = 0; i < particleCount; i++) {
        const heart = createHeartSVG();
        
        // 添加到页面
        document.body.appendChild(heart);
        
        // 随机大小，根据屏幕尺寸调整
        const sizeFactor = isMobile ? 0.7 : 1;
        const size = Math.random() * 10 * sizeFactor + 8 * sizeFactor;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        // 初始位置
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // 更鲜艳的随机颜色
        const colors = ['#ff3366', '#ff0066', '#ff6699', '#ff99cc', '#ff3399', '#ff0099', '#ff66cc', '#ff33cc'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.querySelector('path').setAttribute('fill', color);
        
        // 随机动画
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        const rotation = Math.random() * 360;
        
        // 应用动画
        setTimeout(() => {
            const endX = x + Math.cos(angle) * speed;
            const endY = y + Math.sin(angle) * speed;
            
            heart.style.transform = `translate(${endX - x}px, ${endY - y}px) rotate(${rotation}deg)`;
            heart.style.opacity = '0';
        }, 10);
        
        // 移除粒子
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// 创建爱心SVG元素
function createHeartSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('heart-particle');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.style.position = 'fixed';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';
    svg.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out';
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
    
    svg.appendChild(path);
    return svg;
}

// 播放轻点击音效
function playLightClickSound() {
    // 创建音频上下文
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 设置音频参数
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // E5
        oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + 0.1); // E4
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        // 播放声音
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // 如果音频初始化失败，不影响功能
        console.log('音频效果初始化失败:', error);
    }
}

// 设置头像点击提醒
function setupAvatarClickReminder() {
    // 在所有文字显示完成后（大约10秒后）添加提醒
    setTimeout(() => {
        const avatars = document.querySelectorAll('.avatar');
        if (avatars.length > 0) {
            // 为第二个头像添加提示文字（因为第一个头像会先显示）
            const targetAvatar = avatars[1]; // 选择第二个头像
            
            if (targetAvatar) {
                // 添加脉动动画类
                targetAvatar.classList.add('pulse-reminder');
                
                // 创建提示文字
                let reminderText = document.querySelector('.avatar-reminder');
                if (!reminderText) {
                    reminderText = document.createElement('div');
                    reminderText.classList.add('avatar-reminder');
                    reminderText.textContent = '点击头像有惊喜哦！';
                    
                    // 根据屏幕尺寸调整样式
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        reminderText.style.fontSize = '14px'; // 手机端使用稍小字体
                        reminderText.style.padding = '4px 8px'; // 调整内边距
                        reminderText.style.whiteSpace = 'nowrap'; // 防止文字换行
                    }
                    
                    // 添加到message-container提供更稳定的定位上下文
                    const messageContainer = document.querySelector('.message-container');
                    if (messageContainer) {
                        messageContainer.appendChild(reminderText);
                    }
                }
                
                // 定位提示文字在头像下方
                if (reminderText) {
                    // 设置定位样式
                    reminderText.style.position = 'absolute';
                    reminderText.style.opacity = '0';
                    reminderText.style.transform = 'translateX(-50%) translateY(10px)';
                    reminderText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    reminderText.style.zIndex = '100';
                    reminderText.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    reminderText.style.color = '#ff6b6b';
                    reminderText.style.borderRadius = '20px';
                    reminderText.style.fontWeight = 'bold';
                    reminderText.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                    
                    // 计算位置
                    const avatarRect = targetAvatar.getBoundingClientRect();
                    const messageContainer = document.querySelector('.message-container');
                    const containerRect = messageContainer.getBoundingClientRect();
                    
                    reminderText.style.top = `${avatarRect.bottom - containerRect.top + 10}px`;
                    reminderText.style.left = `${avatarRect.left - containerRect.left + avatarRect.width / 2}px`;
                }
                
                // 显示提示文字
                setTimeout(() => {
                    if (reminderText) {
                        reminderText.style.opacity = '1';
                        reminderText.style.transform = 'translateX(-50%) translateY(0)';
                    }
                }, 100);
                
                // 8秒后自动隐藏提示文字
                setTimeout(() => {
                    if (reminderText) {
                        reminderText.style.opacity = '0';
                        reminderText.style.transform = 'translateX(-50%) translateY(10px)';
                        
                        // 完全隐藏后移除元素
                        setTimeout(() => {
                            if (reminderText && reminderText.parentNode) {
                                reminderText.parentNode.removeChild(reminderText);
                            }
                        }, 500);
                    }
                    
                    // 移除脉动动画
                    targetAvatar.classList.remove('pulse-reminder');
                }, 8000);
            }
        }
    }, 10000); // 10秒后显示提醒
}

// 当页面加载完成后初始化

window.addEventListener('DOMContentLoaded', init);
