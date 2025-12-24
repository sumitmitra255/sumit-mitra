import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Target, Flame } from 'lucide-react';

/**
 * Constants & Configuration
 */
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 350;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 110;
const GRAVITY = 0.8;
const JUMP_FORCE = -16;
const MOVE_SPEED = 5;
const ATTACK_RANGE = 85;
const HIT_COOLDOWN = 350;

type Action = 'idle' | 'walking' | 'jumping' | 'punching' | 'kicking' | 'blocking' | 'hit';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  action: Action;
  direction: 1 | -1;
  isJumping: boolean;
  isBlocking: boolean;
  attackActive: boolean;
  lastAttackTime: number;
  frame: number;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [winner, setWinner] = useState<string | null>(null);
  const [hudUpdate, setHudUpdate] = useState(0);

  const playerRef = useRef<Entity>({
    x: 100, y: GROUND_Y - PLAYER_HEIGHT, vx: 0, vy: 0, health: 100,
    action: 'idle', direction: 1, isJumping: false, isBlocking: false,
    attackActive: false, lastAttackTime: 0, frame: 0
  });

  const cpuRef = useRef<Entity>({
    x: 640, y: GROUND_Y - PLAYER_HEIGHT, vx: 0, vy: 0, health: 100,
    action: 'idle', direction: -1, isJumping: false, isBlocking: false,
    attackActive: false, lastAttackTime: 0, frame: 0
  });

  const particles = useRef<Particle[]>([]);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      particles.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  };

  const performAttack = (attacker: Entity, type: 'punching' | 'kicking') => {
    const now = Date.now();
    if (now - attacker.lastAttackTime < HIT_COOLDOWN || attacker.isBlocking) return;
    attacker.action = type;
    attacker.attackActive = true;
    attacker.lastAttackTime = now;
    setTimeout(() => {
      attacker.attackActive = false;
      if (attacker.action === type) attacker.action = 'idle';
    }, 250);
  };

  const checkHit = (attacker: Entity, defender: Entity) => {
    if (!attacker.attackActive) return false;
    const attackX = attacker.direction === 1 ? attacker.x + PLAYER_WIDTH : attacker.x - ATTACK_RANGE;
    const hitBox = { x: attackX, y: attacker.y + 20, w: ATTACK_RANGE, h: 40 };
    const defenderBox = { x: defender.x, y: defender.y, w: PLAYER_WIDTH, h: PLAYER_HEIGHT };

    return (
      hitBox.x < defenderBox.x + defenderBox.w &&
      hitBox.x + hitBox.w > defenderBox.x &&
      hitBox.y < defenderBox.y + defenderBox.h &&
      hitBox.y + hitBox.h > defenderBox.y
    );
  };

  const updateAI = (cpu: Entity, player: Entity) => {
    const dist = Math.abs((cpu.x + PLAYER_WIDTH / 2) - (player.x + PLAYER_WIDTH / 2));
    const now = Date.now();
    cpu.direction = player.x > cpu.x ? 1 : -1;

    if (dist > ATTACK_RANGE + 15) {
      cpu.vx = cpu.direction * (MOVE_SPEED * 0.75);
      cpu.action = 'walking';
      cpu.isBlocking = false;
    } else {
      cpu.vx = 0;
      if (player.attackActive && Math.random() > 0.45) {
        cpu.isBlocking = true;
        cpu.action = 'blocking';
      } else if (now - cpu.lastAttackTime > 600) {
        cpu.isBlocking = false;
        performAttack(cpu, Math.random() > 0.6 ? 'kicking' : 'punching');
      } else {
        cpu.action = 'idle';
      }
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const p = playerRef.current;
      const c = cpuRef.current;

      p.vx = 0;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) { p.vx = -MOVE_SPEED; p.direction = -1; }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) { p.vx = MOVE_SPEED; p.direction = 1; }
      
      p.isBlocking = (keysPressed.current['ShiftLeft'] || keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) && !p.isJumping;
      
      if (p.isBlocking) { p.vx = 0; p.action = 'blocking'; }
      else if (keysPressed.current['KeyJ']) performAttack(p, 'punching');
      else if (keysPressed.current['KeyK']) performAttack(p, 'kicking');
      else if (p.vx !== 0) p.action = 'walking';
      else if (!p.isJumping) p.action = 'idle';

      if ((keysPressed.current['ArrowUp'] || keysPressed.current['Space'] || keysPressed.current['KeyW']) && !p.isJumping) {
        p.vy = JUMP_FORCE; p.isJumping = true; p.action = 'jumping';
      }

      updateAI(c, p);

      [p, c].forEach(ent => {
        ent.x += ent.vx;
        ent.y += ent.vy;
        ent.vy += GRAVITY;
        if (ent.y > GROUND_Y - PLAYER_HEIGHT) { ent.y = GROUND_Y - PLAYER_HEIGHT; ent.vy = 0; ent.isJumping = false; }
        ent.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, ent.x));
        ent.frame += 0.15;
      });

      // Collision
      if (checkHit(p, c)) {
        if (!c.isBlocking) {
          c.health = Math.max(0, c.health - (p.action === 'kicking' ? 1.2 : 0.8));
          c.action = 'hit';
          createParticles(c.x + PLAYER_WIDTH / 2, c.y + 40, '#f43f5e');
        } else {
          createParticles(c.x + (c.direction === 1 ? -10 : PLAYER_WIDTH + 10), c.y + 40, '#38bdf8');
        }
        p.attackActive = false;
      }
      
      if (checkHit(c, p)) {
        if (!p.isBlocking) {
          p.health = Math.max(0, p.health - (c.action === 'kicking' ? 1.0 : 0.7));
          p.action = 'hit';
          createParticles(p.x + PLAYER_WIDTH / 2, p.y + 40, '#3b82f6');
        } else {
          createParticles(p.x + (p.direction === 1 ? -10 : PLAYER_WIDTH + 10), p.y + 40, '#38bdf8');
        }
        c.attackActive = false;
      }

      // Draw Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Neon City Silhouette
      ctx.fillStyle = '#1e1b4b';
      [100, 250, 450, 600].forEach((x, i) => {
        ctx.fillRect(x, 150 + (i % 2 * 30), 80, 200);
        ctx.fillStyle = '#312e81';
        ctx.fillRect(x + 10, 160 + (i % 2 * 30), 10, 10);
        ctx.fillRect(x + 30, 160 + (i % 2 * 30), 10, 10);
      });

      // Ground
      const grd = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
      grd.addColorStop(0, '#1e293b');
      grd.addColorStop(1, '#0f172a');
      ctx.fillStyle = grd;
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for(let i=0; i<CANVAS_WIDTH; i+=40) {
          ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i - 40, CANVAS_HEIGHT); ctx.stroke();
      }

      // Draw Particles
      particles.current.forEach((part, i) => {
        part.x += part.vx; part.y += part.vy; part.life -= 0.02;
        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.life;
        ctx.fillRect(part.x, part.y, 4, 4);
      });
      particles.current = particles.current.filter(p => p.life > 0);
      ctx.globalAlpha = 1.0;

      drawFighter(ctx, p, '#3b82f6', '#60a5fa');
      drawFighter(ctx, c, '#f43f5e', '#fb7185');

      if (animationFrameId % 4 === 0) setHudUpdate(v => v + 1);

      if (p.health <= 0 || c.health <= 0) {
        setWinner(p.health <= 0 ? 'COMPUTER' : 'PLAYER');
        setGameState('gameover');
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  const drawFighter = (ctx: CanvasRenderingContext2D, ent: Entity, color: string, glow: string) => {
    ctx.save();
    ctx.translate(ent.x + PLAYER_WIDTH / 2, ent.y + PLAYER_HEIGHT / 2);
    if (ent.direction === -1) ctx.scale(-1, 1);

    const isHit = ent.action === 'hit';
    const bounce = Math.sin(ent.frame) * 3;

    // Outer Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = isHit ? '#fff' : glow;

    // Legs
    ctx.fillStyle = isHit ? '#fff' : '#0f172a';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    // Front Leg
    ctx.beginPath();
    ctx.roundRect(-15, 10 + bounce, 12, 40, 5);
    ctx.fill(); ctx.stroke();
    
    // Back Leg
    ctx.beginPath();
    ctx.roundRect(5, 10 - bounce, 12, 40, 5);
    ctx.fill(); ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.roundRect(-20, -35 + bounce, 40, 55, [10, 10, 5, 5]);
    ctx.fill(); ctx.stroke();

    // Armor Details
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(-12, -25 + bounce, 24, 10);
    ctx.globalAlpha = 1.0;

    // Head (Helmet Style)
    ctx.fillStyle = isHit ? '#fff' : '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -55 + bounce, 18, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    
    // Visor
    ctx.fillStyle = glow;
    ctx.fillRect(-10, -60 + bounce, 20, 5);

    // Arms / Attacks
    ctx.shadowBlur = ent.attackActive ? 25 : 0;
    if (ent.action === 'punching') {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(10, -25 + bounce, ATTACK_RANGE - 10, 15, 5);
        ctx.fill();
    } else if (ent.action === 'kicking') {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(10, 15 + bounce, ATTACK_RANGE - 10, 20, 5);
        ctx.fill();
    } else if (ent.isBlocking) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(25, -10 + bounce, 30, -Math.PI/2, Math.PI/2);
        ctx.stroke();
    } else {
        // Idle arm
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-25, -20 + bounce, 15, 30, 5);
        ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  };

  const reset = () => {
    playerRef.current = { x: 100, y: GROUND_Y - PLAYER_HEIGHT, vx: 0, vy: 0, health: 100, action: 'idle', direction: 1, isJumping: false, isBlocking: false, attackActive: false, lastAttackTime: 0, frame: 0 };
    cpuRef.current = { x: 640, y: GROUND_Y - PLAYER_HEIGHT, vx: 0, vy: 0, health: 100, action: 'idle', direction: -1, isJumping: false, isBlocking: false, attackActive: false, lastAttackTime: 0, frame: 0 };
    setWinner(null); setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Cinematic HUD */}
        <div className="flex justify-between items-center px-4 relative">
          {/* Player HUD */}
          <div className="flex-1 group">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"><Zap className="w-4 h-4 text-blue-400" /></div>
               <span className="text-sm font-black text-blue-400 tracking-widest uppercase italic">Protagonist_01</span>
            </div>
            <div className="relative h-6 bg-slate-900/80 rounded-sm border border-slate-800 skew-x-[-12deg] overflow-hidden">
               <div className="absolute inset-0 bg-blue-900/20" />
               <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${playerRef.current.health}%` }} />
            </div>
          </div>

          <div className="mx-8 flex flex-col items-center">
             <div className="text-xs font-bold text-slate-500 mb-1">ROUND 1</div>
             <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center bg-slate-900 shadow-xl">
                <span className="text-xl font-black text-white italic">VS</span>
             </div>
          </div>

          {/* CPU HUD */}
          <div className="flex-1 text-right group">
            <div className="flex items-center justify-end gap-3 mb-2">
               <span className="text-sm font-black text-rose-400 tracking-widest uppercase italic">Core_Stalker</span>
               <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20"><Flame className="w-4 h-4 text-rose-400" /></div>
            </div>
            <div className="relative h-6 bg-slate-900/80 rounded-sm border border-slate-800 skew-x-[-12deg] overflow-hidden">
               <div className="absolute inset-0 bg-rose-900/20" />
               <div className="h-full bg-gradient-to-l from-rose-600 to-orange-400 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] ml-auto" style={{ width: `${cpuRef.current.health}%` }} />
            </div>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border-2 border-slate-800/50">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto aspect-[2/1] cursor-crosshair" />

          {gameState === 'start' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-8 backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <h1 className="text-8xl font-black italic tracking-tighter text-white mb-2 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                NEON<span className="text-blue-500">STRIKE</span>
              </h1>
              <p className="text-slate-400 mb-10 font-bold tracking-[0.3em] uppercase text-sm">Synthetic Combat Protocol Activated</p>
              <button onClick={() => setGameState('playing')} className="group relative px-16 py-5 bg-white overflow-hidden rounded-sm transition-all hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-black text-black group-hover:text-white transition-colors duration-300 text-xl italic">INITIALIZE DUEL</span>
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="mb-4 flex gap-4">
                 {[1,2,3].map(i => <div key={i} className={`w-12 h-1 bg-${winner === 'PLAYER' ? 'blue' : 'rose'}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />)}
              </div>
              <h2 className={`text-8xl font-black italic mb-2 tracking-tighter ${winner === 'PLAYER' ? 'text-blue-400' : 'text-rose-500'} drop-shadow-2xl`}>
                {winner === 'PLAYER' ? 'SUCCESS' : 'TERMINATED'}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest mb-10">Simulation Result Uploaded</p>
              <button onClick={reset} className="px-12 py-4 bg-transparent border-2 border-white text-white rounded-sm font-black hover:bg-white hover:text-black transition-all italic text-lg">
                RE-SYNC PROTOCOL
              </button>
            </div>
          )}
        </div>

        {/* Controls Layout */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { key: 'J', action: 'Punch', icon: <Target className="w-4 h-4" /> },
            { key: 'K', action: 'Kick', icon: <Flame className="w-4 h-4" /> },
            { key: 'SFT', action: 'Block', icon: <Shield className="w-4 h-4" /> },
            { key: 'SPC', action: 'Jump', icon: <Zap className="w-4 h-4" /> }
          ].map((item) => (
            <div key={item.key} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-slate-500">{item.icon}</div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{item.action}</span>
              </div>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono font-bold text-white border border-slate-700">{item.key}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default App;