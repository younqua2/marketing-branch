/* ============================================
   스크롤 Reveal 애니메이션 (Intersection Observer)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  // --- Reveal on Scroll ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 같은 뷰포트에 여러 요소가 들어오면 순차 딜레이
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = Math.min(siblingIndex * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Gnosis Style Scrollytelling ---
  const gnosisCards = document.querySelectorAll('.scrolly-gnosis__card');
  const gnosisImages = document.querySelectorAll('.scrolly-gnosis__image');

  if (gnosisCards.length && gnosisImages.length) {
    const gnosisObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = entry.target.getAttribute('data-id');

          // 카드 활성화
          gnosisCards.forEach(c => c.classList.remove('scrolly-gnosis__card--active'));
          entry.target.classList.add('scrolly-gnosis__card--active');

          // 이미지 전환
          gnosisImages.forEach(img => img.classList.remove('scrolly-gnosis__image--active'));
          const targetImage = document.querySelector(`.scrolly-gnosis__image[data-id="${idx}"]`);
          if (targetImage) targetImage.classList.add('scrolly-gnosis__image--active');
        }
      });
    }, {
      threshold: 0.3, /* 카드가 30% 정도만 보여도 빠르게 반응하여 이미지를 전환 */
      rootMargin: '-10% 0px -20% 0px' /* 화면 약간 위쪽~중간에서 트리거 */
    });

    gnosisCards.forEach(card => gnosisObserver.observe(card));
  }

  // --- Toss-style Image Reveal (스크롤 시 카드 확장) ---
  const revealCard = document.getElementById('revealCard');
  const revealTrack = revealCard ? revealCard.closest('.reveal-track') : null;

  if (revealCard && revealTrack) {
    function updateReveal() {
      const trackRect = revealTrack.getBoundingClientRect();
      const trackHeight = revealTrack.offsetHeight;
      const scrolled = -trackRect.top; // 트랙 상단이 뷰포트 상단을 지난 양
      const ratio = Math.min(Math.max(scrolled / (trackHeight - window.innerHeight), 0), 1);

      // margin: 5% → 0, border-radius: 40px → 0
      const margin = 5 * (1 - ratio);
      const radius = 40 * (1 - ratio);

      revealCard.style.margin = `0 ${margin}%`;
      revealCard.style.borderRadius = `${radius}px`;
    }

    window.addEventListener('scroll', updateReveal, { passive: true });
    updateReveal(); // 초기 상태
  }

  // --- 숫자 카운트업 애니메이션 ---
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * eased);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- 네비게이션 스크롤 효과 ---
  const nav = document.getElementById('nav');
  const stickyCta = document.getElementById('stickyCta');
  const heroSection = document.getElementById('hero');
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // 네비 배경 전환
    if (scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // 스크롤 인디케이터 fade-out (200px 이후)
    if (scrollIndicator) {
      if (scrollY > 200) {
        scrollIndicator.classList.add('hero__scroll-indicator--hidden');
      } else {
        scrollIndicator.classList.remove('hero__scroll-indicator--hidden');
      }
    }

    // 스티키 CTA 표시 (Hero 지나면)
    if (scrollY > heroSection.offsetHeight * 0.8) {
      stickyCta.classList.add('sticky-cta--visible');
    } else {
      stickyCta.classList.remove('sticky-cta--visible');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // --- 모바일 메뉴 토글 ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav__menu--open');

    // 햄버거 → X 애니메이션
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('nav__menu--open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // 메뉴 링크 클릭 시 닫기
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // --- 부드러운 앵커 스크롤 ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const navHeight = nav.offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 글래스 카드 마우스 그로우 효과 ---
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ============================================
  // ============================================
  // 히어로 모션 그래픽 — 15초 루프 (Canvas 2D)
  // Phase 1 (0~5s): 혼돈 → 그리드 정렬
  // Phase 2 (5~10s): 시스템 가동 (빛 흐름)
  // Phase 3 (10~15s): 성장 그래프 + 오렌지 폭발
  // ============================================
  const motionCanvas = document.getElementById('heroMotion');
  if (motionCanvas) {
    const ctx = motionCanvas.getContext('2d');
    const hero = document.getElementById('hero');
    let W, H;
    const LOOP_DURATION = 15; // 초
    const DOT_COUNT = 180;
    const GRID_COLS = 15;
    const GRID_ROWS = 10;

    // 리사이즈 핸들
    function resize() {
      W = hero.clientWidth;
      H = hero.clientHeight;
      motionCanvas.width = W * Math.min(window.devicePixelRatio, 2);
      motionCanvas.height = H * Math.min(window.devicePixelRatio, 2);
      motionCanvas.style.width = W + 'px';
      motionCanvas.style.height = H + 'px';
      ctx.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // 점(Dot) 데이터 초기화
    const dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const gridCol = i % GRID_COLS;
      const gridRow = Math.floor(i / GRID_COLS) % GRID_ROWS;
      dots.push({
        // 혼돈 위치 (랜덤)
        cx: Math.random(),  // 0~1 비율
        cy: Math.random(),
        // 그리드 위치
        gx: (gridCol + 1) / (GRID_COLS + 1),
        gy: (gridRow + 1) / (GRID_ROWS + 1),
        // 속도/오프셋
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    // 연결선 데이터 (그리드에서 가까운 점들)
    const connections = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      for (let j = i + 1; j < DOT_COUNT; j++) {
        const dx = dots[i].gx - dots[j].gx;
        const dy = dots[i].gy - dots[j].gy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.15) {
          connections.push({ a: i, b: j, dist });
        }
      }
    }

    // 성장 그래프 데이터 (5개 바)
    const bars = [
      { x: 0.2, maxH: 0.25, color: 'rgba(90, 124, 255, 0.6)' },
      { x: 0.35, maxH: 0.35, color: 'rgba(90, 124, 255, 0.7)' },
      { x: 0.5, maxH: 0.50, color: 'rgba(150, 130, 255, 0.7)' },
      { x: 0.65, maxH: 0.65, color: 'rgba(255, 140, 74, 0.8)' },
      { x: 0.8, maxH: 0.85, color: 'rgba(255, 83, 22, 0.9)' },
    ];

    // 이징 함수
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const loopTime = elapsed % LOOP_DURATION;
      const phase = loopTime / LOOP_DURATION; // 0~1

      ctx.clearRect(0, 0, W, H);

      // 위상 계산
      const p1 = Math.min(loopTime / 5, 1);           // Phase 1: 0~5s → 0~1
      const p2 = Math.max(0, Math.min((loopTime - 5) / 5, 1)); // Phase 2: 5~10s → 0~1
      const p3 = Math.max(0, Math.min((loopTime - 10) / 5, 1)); // Phase 3: 10~15s → 0~1

      // 트랜지션 (14~15초: 다시 혼돈으로 페이드)
      const fadeBack = loopTime > 14 ? (loopTime - 14) : 0; // 0~1

      // ── Phase 1: 점들의 혼돈 → 그리드 정렬 ──
      const alignT = easeInOutCubic(p1);

      // 점 위치 계산 & 그리기
      const dotPositions = [];
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // 혼돈 상태에서 약간 움직이기
        const chaosX = d.cx + Math.sin(elapsed * 0.7 + d.phase) * 0.03;
        const chaosY = d.cy + Math.cos(elapsed * 0.5 + d.phase * 1.5) * 0.03;
        // 보간
        const finalAlignT = Math.max(0, alignT - fadeBack);
        const x = chaosX + (d.gx - chaosX) * finalAlignT;
        const y = chaosY + (d.gy - chaosY) * finalAlignT;
        const px = x * W;
        const py = y * H;
        dotPositions.push({ px, py });

        // 점 색상 (Phase2에서 빛이 들어올 때 색 변함)
        let dotAlpha = 0.15 + alignT * 0.25;
        let dotColor = `rgba(150, 170, 220, ${dotAlpha})`;

        if (p2 > 0 && p3 === 0) {
          // Phase 2: 빛 흐름 — 좌→우 물결
          const wave = Math.sin((x * 8 - p2 * 6) * Math.PI);
          const glow = Math.max(0, wave);
          const blueR = 90 + glow * 165;
          const blueG = 124 + glow * 16;
          const blueB = 255 - glow * 180;
          dotAlpha = 0.3 + glow * 0.7;
          dotColor = `rgba(${Math.round(blueR)}, ${Math.round(blueG)}, ${Math.round(blueB)}, ${dotAlpha})`;
        }

        if (p3 > 0) {
          // Phase 3: 전체 밝기 감소 (그래프에 주목)
          dotAlpha = 0.15 * (1 - p3 * 0.5);
          dotColor = `rgba(150, 170, 220, ${dotAlpha})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, d.size * (1 + alignT * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      // ── 연결선 그리기 (Phase 1 후반 ~ Phase 2) ──
      if (alignT > 0.5) {
        const lineAlpha = Math.min((alignT - 0.5) * 2, 1) * (1 - p3);
        for (const conn of connections) {
          const a = dotPositions[conn.a];
          const b = dotPositions[conn.b];
          if (!a || !b) continue;

          let lineColor = `rgba(90, 124, 255, ${0.06 * lineAlpha})`;

          // Phase 2: 빛이 선을 타고 흐르는 효과
          if (p2 > 0 && p3 === 0) {
            const midX = (dots[conn.a].gx + dots[conn.b].gx) / 2;
            const wave = Math.sin((midX * 8 - p2 * 6) * Math.PI);
            const glow = Math.max(0, wave);
            const r = 90 + glow * 165;
            const g = 124 + glow * 16;
            const bb = 255 - glow * 180;
            lineColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bb)}, ${(0.06 + glow * 0.3) * lineAlpha})`;
          }

          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // ── Phase 3: 성장 그래프 솟구침 ──
      if (p3 > 0) {
        const graphY = H; // 그래프 바닥 = 캔버스 맨 아래
        const barWidth = W * 0.06;
        const growT = easeOutExpo(Math.min(p3 * 1.5, 1));
        // 후반부 페이드아웃 (p3 > 0.8 이후 사라짐)
        const graphFade = p3 > 0.8 ? 1 - (p3 - 0.8) / 0.2 : 1;
        ctx.globalAlpha = graphFade;

        for (let i = 0; i < bars.length; i++) {
          const bar = bars[i];
          const bx = bar.x * W - barWidth / 2;
          const barH = bar.maxH * H * 0.5 * growT;
          const by = graphY - barH;

          // 그래디언트 바
          const grad = ctx.createLinearGradient(bx, graphY, bx, by);
          grad.addColorStop(0, 'rgba(90, 124, 255, 0.1)');
          grad.addColorStop(1, bar.color);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(bx, by, barWidth, barH, [6, 6, 0, 0]);
          ctx.fill();

          // 바 꼭대기 glow
          if (growT > 0.5) {
            const glowAlpha = (growT - 0.5) * 2;
            const glowGrad = ctx.createRadialGradient(
              bx + barWidth / 2, by, 0,
              bx + barWidth / 2, by, barWidth * 1.5
            );
            glowGrad.addColorStop(0, `rgba(255, 140, 74, ${0.3 * glowAlpha})`);
            glowGrad.addColorStop(1, 'rgba(255, 140, 74, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(bx - barWidth, by - barWidth * 1.5, barWidth * 3, barWidth * 3);
          }
        }

        // 마지막 바에서 주황 폭발 효과
        if (p3 > 0.6) {
          const burstT = (p3 - 0.6) / 0.4; // 0~1
          const burstEase = easeOutExpo(burstT);
          const lastBar = bars[bars.length - 1];
          const bx = lastBar.x * W;
          const lastBarH = lastBar.maxH * H * 0.5 * growT;
          const by = graphY - lastBarH;
          const burstRadius = burstEase * W * 0.25;
          const burstAlpha = (1 - burstT) * 0.5;

          // 방사형 폭발 glow
          const burst = ctx.createRadialGradient(bx, by, 0, bx, by, burstRadius);
          burst.addColorStop(0, `rgba(255, 83, 22, ${burstAlpha})`);
          burst.addColorStop(0.3, `rgba(255, 140, 74, ${burstAlpha * 0.5})`);
          burst.addColorStop(1, 'rgba(255, 83, 22, 0)');
          ctx.fillStyle = burst;
          ctx.fillRect(bx - burstRadius, by - burstRadius, burstRadius * 2, burstRadius * 2);

          // 파티클 스파크
          const sparkCount = 12;
          for (let s = 0; s < sparkCount; s++) {
            const angle = (s / sparkCount) * Math.PI * 2 + elapsed;
            const sparkDist = burstEase * W * 0.12 * (0.5 + Math.random() * 0.5);
            const sx = bx + Math.cos(angle) * sparkDist;
            const sy = by + Math.sin(angle) * sparkDist;
            const sparkAlpha = (1 - burstT) * 0.8;
            ctx.beginPath();
            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 180, 100, ${sparkAlpha})`;
            ctx.fill();
          }
        }

        // 바닥선
        ctx.beginPath();
        ctx.moveTo(W * 0.12, graphY);
        ctx.lineTo(W * 0.88, graphY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * growT})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1; // 리셋
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

});
