document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('water-stage');
    const cloudContainer = document.getElementById('clouds');
    const modal = document.getElementById('bless-modal');
    const openBtn = document.getElementById('open-bless-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('bless-form');

    let displayedIds = new Set(); 

    // 1. ก้อนเมฆสมจริง
    function createClouds() {
        for (let i = 0; i < 15; i++) {
            const group = document.createElement('div');
            group.className = 'cloud-group';
            for (let j = 0; j < 6; j++) {
                const puff = document.createElement('div');
                puff.className = 'cloud-puff';
                const size = 150 + Math.random() * 200;
                puff.style.width = `${size}px`; puff.style.height = `${size * 0.6}px`;
                puff.style.left = `${Math.random() * 200}px`; puff.style.top = `${Math.random() * 60}px`;
                group.appendChild(puff);
            }
            const top = Math.random() * 45;
            const duration = 50 + Math.random() * 70;
            group.style.top = `${top}%`;
            group.style.setProperty('animation-duration', `${duration}s`);
            group.style.setProperty('animation-delay', `${Math.random() * -100}s`);
            cloudContainer.appendChild(group);
        }
    }

    // 2. ระบบ Modal
    openBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    // 3. ฟังก์ชันสร้างขันลายไทย
    function createItem(name, bless, type, isLoop = true) {
        const item = document.createElement('div');
        item.className = `item-object ${type}`;
        item.innerHTML = `
            <div class="b-info"><b>${name}:</b> ${bless}</div>
            <div class="bowl-classic"><div class="thai-pattern"></div></div>
        `;
        stage.appendChild(item);

        function createWater() {
            for (let i = 0; i < 3; i++) {
                const drop = document.createElement('div');
                drop.className = 'water-stream';
                const size = 6 + Math.random() * 10;
                drop.style.width = `${size}px`; drop.style.height = `${size}px`;
                let dx = 80 + Math.random() * 120; let dy = 200 + Math.random() * 150;
                drop.style.setProperty('--dx', `${dx}px`); drop.style.setProperty('--dy', `${dy}px`);
                drop.style.left = `80px`; drop.style.top = `60px`;
                drop.style.animation = 'water-flow 0.8s ease-out forwards';
                item.appendChild(drop);
                setTimeout(() => drop.remove(), 800);
            }
        }
        const interval = setInterval(createWater, 350);

        function startFloating() {
            const randomTop = 50 + Math.random() * 35;
            item.style.top = `${randomTop}%`;
            const duration = 22 + Math.random() * 18;
            const animation = item.animate([
                { left: '-300px', transform: 'rotate(0deg)' },
                { left: '50vw', transform: 'rotate(25deg)' },
                { left: '110vw', transform: 'rotate(0deg)' }
            ], { duration: duration * 1000, easing: 'linear' });

            animation.onfinish = () => {
                if (isLoop) startFloating();
                else { clearInterval(interval); item.remove(); }
            };
        }
        startFloating();
    }

    // 4. ระบบ Sync ข้อมูล (Node.js API)
    async function syncBlessings() {
        try {
            const response = await fetch('/api/bless'); // เรียก API ของ Node.js
            const data = await response.json();
            data.forEach(item => {
                const id = `${item.name}-${item.time}`;
                if (!displayedIds.has(id)) {
                    createItem(item.name, item.bless, item.type);
                    displayedIds.add(id);
                }
            });
        } catch (e) { }
    }

    // 5. ส่งคำอวยพร
    form.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('username').value,
            bless: document.getElementById('blessing').value,
            type: document.querySelector('input[name="i-type"]:checked').value
        };

        try {
            await fetch('/api/bless', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) { 
            createItem(payload.name, payload.bless, payload.type); 
        }

        form.reset();
        modal.style.display = 'none';
    };

    createClouds();
    setInterval(syncBlessings, 2000); // เช็คพรใหม่ทุก 2 วินาที
});
