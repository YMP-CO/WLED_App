const canvas = document.getElementById('geometric-background');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Point {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
        };
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.draw();
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
const colors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
let points = [];
function createPoints() {
    points = [];
    for(let i = 0; i < 30; i++) {
        const radius = Math.random() * 5 + 2;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        points.push(new Point(x, y, radius, color));
    }
}
function animateBackground() {
    requestAnimationFrame(animateBackground);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for(let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    for(let i = 0; i < points.length; i++) {
        points[i].update();
    }
    for(let i = 0; i < points.length; i++) {
        for(let j = i + 1; j < points.length; j++) {
            const distance = Math.sqrt(
                Math.pow(points[i].x - points[j].x, 2) +
                Math.pow(points[i].y - points[j].y, 2)
            );
            if(distance < 150) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                const gradient = ctx.createLinearGradient(
                    points[i].x, points[i].y, points[j].x, points[j].y
                );
                gradient.addColorStop(0, points[i].color);
                gradient.addColorStop(1, points[j].color);
                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
        }
    }
}
createPoints();
animateBackground();
document.addEventListener('DOMContentLoaded', function() {
    const scrollDownBtn = document.querySelector('.scroll-down');
    const screenshotsSection = document.querySelector('.screenshots');
    const noteElements = document.querySelectorAll('.note');
    scrollDownBtn.addEventListener('click', function() {
        screenshotsSection.scrollIntoView({ behavior: 'smooth' });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    noteElements.forEach(note => {
        observer.observe(note);
    });
});