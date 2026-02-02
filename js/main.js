// IP Image Responsive
function initIPImageResponsive() {
    const pcImage = document.getElementById('ipBannerImage');
    const mobileImage = document.getElementById('ipBannerImageMobile');
    
    function updateImageDisplay() {
        const isMobile = window.innerWidth <= 768;
        
        if (pcImage && mobileImage) {
            if (isMobile) {
                pcImage.style.display = 'none';
                mobileImage.style.display = 'block';
            } else {
                pcImage.style.display = 'block';
                mobileImage.style.display = 'none';
            }
        }
    }
    
    // Initial check
    updateImageDisplay();
    
    // Update on window resize
    window.addEventListener('resize', updateImageDisplay);
}

// Loading Animation
function initLoadingAnimation() {
    const loadingScreen = document.getElementById('loadingScreen');
    const body = document.body;
    
    // Set initial state
    body.classList.add('loading');
    loadingScreen.classList.add('phase-1');
    
    // Animation sequence
    setTimeout(() => {
        // Phase 2: Red screen scrolls up from underneath
        loadingScreen.classList.remove('phase-1');
        loadingScreen.classList.add('phase-2');
        loadingScreen.classList.add('active');
    }, 1000);
    
    setTimeout(() => {
        // Fade out red screen and fade in main content
        body.classList.remove('loading');
        loadingScreen.classList.remove('phase-2');
        loadingScreen.classList.add('phase-3');
    }, 2000);
    
    setTimeout(() => {
        // Remove loading screen completely
        loadingScreen.classList.remove('active');
        loadingScreen.classList.remove('phase-3');
        loadingScreen.style.display = 'none';
    }, 2500);
    
    // Failsafe: Force remove loading screen after 5 seconds
    setTimeout(() => {
        if (loadingScreen.classList.contains('active')) {
            loadingScreen.classList.remove('active', 'phase-1', 'phase-2', 'phase-3');
            loadingScreen.style.display = 'none';
            body.classList.remove('loading');
        }
    }, 5000);
}

// Mobile Menu Toggle
function initMobileMenu() {
    // PC用ナビゲーション
    const pcNavLinks = document.querySelectorAll('header .side-nav a');
    
    // PC用ナビゲーションのクリックイベント
    pcNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // スマホ用ハンバーガーメニュー（右下のみ）
    const menuTriggerRight = document.querySelector('.menu-ui-right .menu-trigger');
    const menuNavRight = document.querySelector('.menu-ui-right .menu-nav');
    const menuOptionsRight = document.querySelectorAll('.menu-ui-right .menu-option');
    
    console.log('Mobile menu right init:', { menuTriggerRight, menuNavRight, menuOptionsRight });
    
    if (menuTriggerRight && menuNavRight) {
        setupMenu(menuTriggerRight, menuNavRight, menuOptionsRight, 'right');
    }
}

function setupMenu(menuTrigger, menuNav, menuOptions, position) {
    // Toggle menu
    menuTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Mobile menu ${position} trigger clicked`);
        
        // 現在の状態を確認
        const isActive = menuNav.classList.contains('active');
        console.log(`Mobile menu ${position} current state:`, isActive);
        
        // クラスをトグル
        if (isActive) {
            menuNav.classList.remove('active');
            menuTrigger.classList.remove('active');
        } else {
            menuNav.classList.add('active');
            menuTrigger.classList.add('active');
        }
        
        // 新しい状態を確認
        const newActiveState = menuNav.classList.contains('active');
        console.log(`Mobile menu ${position} new state:`, newActiveState);
        
        // メニューの表示状態を確認
        const computedStyle = window.getComputedStyle(menuNav);
        console.log(`Mobile menu ${position} display style:`, computedStyle.display);
    });
    
    // Close menu when clicking on a menu option
    menuOptions.forEach(option => {
        option.addEventListener('click', () => {
            console.log(`Mobile menu ${position} option clicked, closing menu`);
            
            // Get the target section from data-lang attribute
            const targetId = option.getAttribute('data-lang');
            let targetSection = null;
            
            // Map data-lang to section IDs
            const sectionMap = {
                'nav-home': 'cover',
                'nav-ip': 'ip',
                'nav-works': 'works',
                'nav-about': 'about',
                'nav-skills': 'skills'
            };
            
            const sectionId = sectionMap[targetId];
            if (sectionId) {
                targetSection = document.getElementById(sectionId);
            }
            
            // Close menu
            menuNav.classList.remove('active');
            menuTrigger.classList.remove('active');
            
            // Scroll to target section
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuTrigger.contains(e.target) && !menuNav.contains(e.target)) {
            console.log(`Clicked outside mobile menu ${position}, closing menu`);
            menuNav.classList.remove('active');
            menuTrigger.classList.remove('active');
        }
    });
}

// Fix mobile viewport height issues
function fixMobileViewportHeight() {
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Update cover section height
        const coverSection = document.querySelector('.cover');
        if (coverSection) {
            const actualHeight = window.innerHeight;
            coverSection.style.height = `${actualHeight}px`;
            coverSection.style.minHeight = `${actualHeight}px`;
            coverSection.style.padding = '0';
        }
        
        // Update sections height (excluding cover)
        const sections = document.querySelectorAll('section:not(.cover)');
        sections.forEach(section => {
            const actualHeight = window.innerHeight;
            section.style.paddingTop = `${actualHeight}px`;
            section.style.minHeight = `${actualHeight}px`;
        });
    };
    
    // Set initial height
    setViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Update on scroll (for mobile browsers that hide/show address bar)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                setViewportHeight();
                ticking = false;
            });
            ticking = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Start loading animation immediately
    initLoadingAnimation();
    
    // Initialize IP image responsive
    initIPImageResponsive();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Fix mobile viewport height
    fixMobileViewportHeight();
    
    const navLinks = document.querySelectorAll('.side-nav a');
    const sections = document.querySelectorAll('section');
    const backgroundText = document.querySelector('.background-text');
    const mainVisual = document.querySelector('.main-visual');
    const siteLabel = document.querySelector('.site-label');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // 言語切り替え機能
    const translations = {
        en: {
            'site-label': "dekapurin's portfolio",
            'language': 'Language',
            'nav-home': 'Home',
            'nav-works': 'Works',
            'nav-ip': 'IP',
            'nav-about': 'About',
            'nav-skills': 'Skills',
            'scroll': 'SCROLL',
            'work-ip': 'Work & Original IP',
            'skill-subtitle': 'SF Visuals for Film,',
            'skill-desc-1': 'This site handles both "commissioned work" and "original IP production" centered on robot/SF worldviews.',
            'skill-heading-1': 'Commissioned Work (Client Work)',
            'skill-desc-2': 'For corporate and event video and exhibition production, we redesign robot/SF worldview according to purpose and constraints, implementing it as video and exhibitions. We deliver optimal solutions based on branding, creative intent, and venue conditions.',
            'skill-heading-2': 'Original IP Production',
            'skill-desc-3': 'We produce original video works using our own worldview. Starting from completed works, we develop sequels and expansion elements through pre-order sales, continuously developing work world itself.',
            'about-title': 'About',
            'about-desc': 'General video production with main focus on 3D character creation',
            'history-title': 'History',
            'year-2021': '2021',
            'detail-2021': 'April Nara National College of Technology, Dept. of Electronic Control Engineering Admission',
            'year-2024-1': '2024',
            'detail-2024-1': 'March Withdrawal',
            'year-2024-2': '2024',
            'detail-2024-2': 'April Osaka University of Arts, Dept. of Art Science Admission',
            'skill-blender': 'Blender',
            'skill-modeling': 'Character Modeling',
            'skill-sculpt': 'Sculpting',
            'skill-hardsurface': 'Hard Surface',
            'skill-texturing': 'Texturing',
            'skill-lighting': 'Lighting',
            'footer': '&copy; 2024 dekapurin. All rights reserved.'
        },
        zh: {
            'site-label': "dekapurin 的作品集",
            'language': '语言',
            'nav-home': '首页',
            'nav-works': '作品',
            'nav-ip': 'IP',
            'nav-about': '关于',
            'nav-skills': '技能',
            'scroll': '滚动',
            'work-ip': '作品与原创IP',
            'skill-subtitle': 'SF Visuals for Film,',
            'skill-desc-1': '本网站处理以机器人/科幻世界观为中心的"委托制作"和"原创IP制作"。',
            'skill-heading-1': '委托制作（Client Work）',
            'skill-desc-2': '面向企业和活动的视频和展览制作，我们根据用途和限制重新设计机器人/科幻世界观，作为视频和展览进行实施。基于品牌、创意意图和会场条件，提供最佳解决方案。',
            'skill-heading-2': '原创IP制作（Original IP）',
            'skill-desc-3': '我们使用自己的世界观制作原创视频作品。以完成的作品为起点，通过预订销售的形式开发续集和扩展元素，持续发展作品世界本身。',
            'about-title': '关于',
            'about-desc': '综合影像制作，主要专注于3D角色制作',
            'history-title': '履历',
            'year-2021': '2021年',
            'detail-2021': '4月 奈良工业高等专门学校 电子控制工程系 入学',
            'year-2024-1': '2024年',
            'detail-2024-1': '3月 退学',
            'year-2024-2': '2024年',
            'detail-2024-2': '4月 大阪艺术大学 艺术科学系 入学',
            'skill-blender': 'Blender',
            'skill-modeling': '角色建模',
            'skill-sculpt': '雕刻',
            'skill-hardsurface': '硬表面',
            'skill-texturing': '贴图',
            'skill-lighting': '灯光',
            'footer': '&copy; 2024 dekapurin. 版权所有。'
        },
        ko: {
            'site-label': "dekapurin의 포트폴리오",
            'language': '언어',
            'nav-home': '홈',
            'nav-works': '작품',
            'nav-ip': 'IP',
            'nav-about': '소개',
            'nav-skills': '기술',
            'scroll': '스크롤',
            'work-ip': '작품 및 오리지널 IP',
            'skill-subtitle': 'SF Visuals for Film,',
            'skill-desc-1': '본 사이트는 로봇/SF 세계관을 축으로 한 "수주 제작"과 "오리지널 IP 제작" 양쪽을 다룹니다.',
            'skill-heading-1': '수주 제작（Client Work）',
            'skill-desc-2': '기업 및 이벤트용 영상 및 전시 제작에서, 용도와 제약에 맞게 로봇/SF 세계관을 재설계하고, 영상 및 전시로 구현합니다. 브랜딩, 연출 의도, 회장 조건을 고려하여 최적의 형태로 납품합니다.',
            'skill-heading-2': '오리지널 IP 제작（Original IP）',
            'skill-desc-3': '자체 세계관을 사용한 오리지널 영상 작품을 제작합니다. 완성된 작품을 기점으로, 속편 및 확장 요소를 예약 판매 형태로 개발하고, 작품 세계 자체를 지속적으로 발전시킵니다.',
            'about-title': '소개',
            'about-desc': '영상 제작 전반, 메인은 3D 캐릭터 제작',
            'history-title': '경력',
            'year-2021': '2021년',
            'detail-2021': '4월 나라공업고등전문학교 전자제어공학과 입학',
            'year-2024-1': '2024년',
            'detail-2024-1': '3월 퇴학',
            'year-2024-2': '2024년',
            'detail-2024-2': '4월 오사카예술대학 아트사이언스학과 입학',
            'skill-blender': 'Blender',
            'skill-modeling': '캐릭터 모델링',
            'skill-sculpt': '조각',
            'skill-hardsurface': '하드 서피스',
            'skill-texturing': '텍스처링',
            'skill-lighting': '라이팅',
            'footer': '&copy; 2024 dekapurin. 모든 권리 보유.'
        },
        ja: {
            'site-label': "dekapurin's portfolio",
            'language': 'Language',
            'nav-home': 'Home / ホーム',
            'nav-works': 'Works / 実績一覧',
            'nav-ip': 'IP / IPコンテンツ',
            'nav-about': 'About / 自己紹介',
            'nav-skills': 'Skills / スキル',
            'scroll': 'SCROLL',
            'work-ip': 'Work & Original IP',
            'skill-subtitle': 'SF Visuals for Film,',
            'skill-desc-1': '本サイトでは、ロボット／SF世界観を軸とした『受注制作』と『オリジナルIP制作』の両方を扱っています。',
            'skill-heading-1': '受注制作（Client Work）',
            'skill-desc-2': '企業・イベント向けに、ロボット／SF世界観を用途や制約に合わせて再設計し、映像や展示として実装しています。ブランディングや演出意図、会場条件を踏まえた上で最適な形に落とし込みます。',
            'skill-heading-2': 'オリジナルIP制作（Original IP）',
            'skill-desc-3': '自身の世界観を用いたオリジナル映像作品を制作しています。完成済みの作品を起点に、続編や拡張要素を予約販売する形式で展開し、作品世界そのものを継続的に発展させています。',
            'about-title': '自己紹介',
            'about-desc': '映像制作全般をしていてメインは3Dキャラクター製作',
            'history-title': '経歴',
            'year-2021': '2021年（令和3年）',
            'detail-2021': '4月 奈良工業高等専門学校 電子制御工学科 入学',
            'year-2024-1': '2024年（令和6年）',
            'detail-2024-1': '3月 退学',
            'year-2024-2': '2024年（令和6年）',
            'detail-2024-2': '4月 大阪芸術大学 アートサイエンス学科 入学',
            'skill-blender': 'Blender',
            'skill-modeling': 'キャラクターモデリング',
            'skill-sculpt': 'スカルプト',
            'skill-hardsurface': 'ハードサーフェス',
            'skill-texturing': 'テクスチャリング',
            'skill-lighting': 'ライティング',
            'footer': '&copy; 2024 dekapurin. All rights reserved.'
        }
    };

    let currentLanguage = 'ja';

    // ブラウザの言語設定を取得
    function getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (translations[langCode]) {
            return langCode;
        }
        return 'en'; // デフォルトは英語
    }

    // 言語を切り替える関数
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        // すべてのdata-lang属性を持つ要素を更新
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // 言語選択メニューのアクティブ状態を更新
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            }
        });
        
        // HTMLのlang属性を更新
        document.documentElement.lang = lang;
    }

    // 言語UIの初期化
    function initLanguageUI() {
        const trigger = document.querySelector('.language-trigger');
        const menu = document.querySelector('.language-menu');
        const options = document.querySelectorAll('.language-option');
        
        if (!trigger || !menu) return;
        
        // トリガークリックでメニュー開閉
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });
        
        // 言語選択
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                switchLanguage(lang);
                menu.classList.remove('active');
            });
        });
        
        // 外部クリックでメニューを閉じる
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !trigger.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
        
        // reduced-motionチェック
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            menu.style.transition = 'none';
        }
    }

    // カスタムカーソルの初期化
    function initCustomCursor() {
        // カスタムカーソル
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        const cursorTrail = [];
        const maxTrailLength = 8;
        const trailLifetime = 400; // 軌跡の寿命（ミリ秒）

        // マウス座標
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const easingFactor = 0.15; // 滑らかさの調整係数
        const maxSpeed = 0.8; // 最大速度

        // マウス移動時の座標更新
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // 目標位置を計算（現在位置と目標位置の差分にイージングを適用）
            const deltaX = (mouseX - targetX) * easingFactor;
            const deltaY = (mouseY - targetY) * easingFactor;
            
            // 目標位置を更新
            targetX = mouseX;
            targetY = mouseY;
            
            // 速度が閾値を超えた場合のみ軌跡を生成
            const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (speed > maxSpeed) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = targetX + 'px';
                trail.style.top = targetY + 'px';
                
                // 速度に応じて不透明度を調整
                const opacity = Math.min(0.4, speed / 20);
                trail.style.opacity = opacity;
                
                document.body.appendChild(trail);
                cursorTrail.push(trail);
                
                // 軌跡の寿命管理
                setTimeout(() => {
                    trail.style.opacity = '0';
                    setTimeout(() => {
                        if (trail.parentNode) {
                            trail.parentNode.removeChild(trail);
                        }
                        const index = cursorTrail.indexOf(trail);
                        if (index > -1) {
                            cursorTrail.splice(index, 1);
                        }
                    }, 100);
                }, trailLifetime);
                
                // 軌跡の最大長さを制限
                if (cursorTrail.length > maxTrailLength) {
                    const oldTrail = cursorTrail.shift();
                    if (oldTrail.parentNode) {
                        oldTrail.parentNode.removeChild(oldTrail);
                    }
                }
            }
            
            // メインカーソルの位置を更新
            cursorDot.style.left = targetX + 'px';
            cursorDot.style.top = targetY + 'px';
        });

        // prefers-reduced-motion対応
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // 軌跡機能を無効化
            cursorDot.style.display = 'none';
            document.addEventListener('mousemove', (e) => {
                // 即時追従モードに切り替え
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
            });
        }
    }

    // 初期言語を設定
    const browserLang = getBrowserLanguage();
    switchLanguage(browserLang);
    
    // 言語UIを初期化
    initLanguageUI();
    
    // カスタムカーソルを初期化
    initCustomCursor();

    // サイトラベルクリックでトップへ
    if (siteLabel) {
        siteLabel.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // スクロール開始で誘導UIを非表示
    let scrollStarted = false;
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (!scrollStarted && window.scrollY > 10) {
                scrollStarted = true;
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.5s ease';
            }
            
            // 上にスクロールしたら再表示
            if (scrollStarted && window.scrollY < 10) {
                scrollStarted = false;
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
            }
        });
    }

    // reduced-motionチェック
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && scrollIndicator) {
        scrollIndicator.style.display = 'none';
    }

    // スムーズスクロール
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            // カバーセクションの場合はヘッダー高さを考慮しない
            const headerHeight = target === '#cover' ? 0 : document.querySelector('header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ナビゲーションクリック
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // アクティブセクションの更新
    function updateActiveSection() {
        const scrollPosition = window.scrollY + document.querySelector('header').offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // パララックス効果
    function initParallax() {
        // reduced-motionチェック
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            return; // アニメーションを無効化
        }

        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const coverSection = document.getElementById('cover');
            
            if (coverSection) {
                const coverTop = coverSection.offsetTop;
                const coverHeight = coverSection.offsetHeight;
                const scrollProgress = Math.min(scrollY / (coverTop + coverHeight), 1);
                
                // 背景テキスト（少し遅い）
                if (backgroundText) {
                    const translateY = scrollProgress * 30;
                    const opacity = 1 - (scrollProgress * 0.4);
                    backgroundText.style.transform = `translate(calc(-50% + ${translateY}px), -50%)`;
                    backgroundText.style.opacity = opacity;
                }
                
                // メインビジュアル（同じ速度で動く）
                if (mainVisual) {
                    // スマホではパララックス効果を無効化
                    if (window.innerWidth <= 768) {
                        // スマホでは動かさない
                        return;
                    }
                    
                    const translateY = scrollProgress * 30;
                    const translateX = scrollProgress * 20;
                    const scale = 1 + (scrollProgress * 0.05);
                    const opacity = 1 - (scrollProgress * 0.4);
                    mainVisual.style.transform = `translateY(calc(-50% + ${translateY}px)) translateX(${translateX}px) scale(${scale})`;
                    mainVisual.style.opacity = opacity;
                }
            }
        });
    }

    // フェードインアニメーション
    function initFadeIn() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                }
            });
        }, observerOptions);

        // カバーセクション以外を観察
        sections.forEach(section => {
            if (section.id !== 'cover') {
                section.style.opacity = '0';
                observer.observe(section);
            }
        });
    }

    // 折りたたみ機能
    function initToggleContent() {
        const toggleButton = document.querySelector('.toggle-button');
        const skillContent = document.getElementById('skill-content');
        const toggleText = document.querySelector('.toggle-text');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (!toggleButton || !skillContent || !toggleText) return;
        
        // prefers-reduced-motionチェック
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            skillContent.style.transition = 'none';
        }
        
        toggleButton.addEventListener('click', function() {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // 閉じる
                skillContent.classList.remove('expanded');
                toggleButton.setAttribute('aria-expanded', 'false');
                skillContent.setAttribute('aria-hidden', 'true');
                toggleText.textContent = '続きを見る';
                
                // スクロール誘導を再表示
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = '1';
                }
            } else {
                // 開く
                skillContent.classList.add('expanded');
                toggleButton.setAttribute('aria-expanded', 'true');
                skillContent.setAttribute('aria-hidden', 'false');
                toggleText.textContent = '閉じる';
                
                // スクロール誘導を非表示
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                }
            }
        });
        
        // キーボード操作対応
        toggleButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleButton.click();
            }
        });
    }

    // 初期化
    initToggleContent();
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
    initParallax();
    initFadeIn();
    initWorkModal();
    initWorkCategories();
    initIPBanner();
});

// IP Banner functionality
function initIPBanner() {
    const ipBannerImage = document.getElementById('ipBannerImage');
    const ipTitle = document.getElementById('ipTitle');
    const ipCategory = document.getElementById('ipCategory');
    const ipDescription = document.getElementById('ipDescription');
    const ipIndicators = document.querySelectorAll('.ip-dot');
    const navLeft = document.querySelector('.ip-nav-left');
    const navRight = document.querySelector('.ip-nav-right');
    
    // IP data for 3DCG Animation
    const ipData = [
        {
            image: 'images/work30.png',
            title: 'IDOL',
            category: 'フル3DCGのアニメーション作品',
            description: '現在制作中のオリジナルSF映像企画<br>短編映像として完成させ、公開・評価を起点に<br>続編や拡張企画を予約販売形式で展開予定',
            status: 'development'
        },
        {
            image: 'images/work18.png',
            title: '進捗',
            category: '主人公モデリング',
            description: '<span style="color: #000; font-weight: 600;">原画を元に3DCGに起こし、残すところ洋服、リギング、シェーダーのみになった</span><br><span style="color: #999;">原画のみ</span><br><span style="color: #999;">モデリング途中</span><br><span style="color: #999;">大まかに完成</span>',
            status: 'planning'
        },
        {
            image: 'images/work20.png',
            title: '進捗',
            category: 'サブ主人公モデリング',
            description: '<span style="color: #999;">原画を元に3DCGに起こし、残すところ洋服、リギング、シェーダーのみになった</span><br><span style="color: #000; font-weight: 600;">原画のみ</span><br><span style="color: #999;">モデリング途中</span><br><span style="color: #999;">大まかに完成</span>',
            status: 'planning'
        },
        {
            image: 'images/work21.png',
            title: '進捗',
            category: 'ロボットモデリング',
            description: '<span style="color: #999;">原画を元に3DCGに起こし、残すところ洋服、リギング、シェーダーのみになった</span><br><span style="color: #999;">原画のみ</span><br><span style="color: #000; font-weight: 600;">モデリング途中</span><br><span style="color: #999;">大まかに完成</span>',
            status: 'planning'
        },
        {
            image: 'images/work16.png',
            title: '進捗',
            category: 'ロボットモデリング2',
            description: '<span style="color: #999;">原画を元に3DCGに起こし、残すところ洋服、リギング、シェーダーのみになった</span><br><span style="color: #999;">原画のみ</span><br><span style="color: #999;">モデリング途中</span><br><span style="color: #000; font-weight: 600;">大まかに完成</span>',
            status: 'planning'
        },
        {
            image: 'images/work22.png',
            title: '進捗',
            category: 'これから何をするか（短期スケジュール）',
            description: '今後の制作計画と短期目標の設定<br>各工程の時間配分と優先順位の決定<br>週次・月次での進捗管理手法の確立',
            status: 'planning'
        },
        {
            image: 'images/work23.png',
            title: '進捗',
            category: 'どう展開・回収されるか（ビジネス構造）',
            description: '作品の公開プラットフォーム選定<br>マネタイズ手法と収益化戦略<br>ファンコミュニティとの連携方法<br>長期的な事業展開の視点',
            status: 'planning'
        },
        {
            image: 'images/work24.png',
            title: '進捗',
            category: '関わり方（協業・支援余地）',
            description: '他クリエイターとの協業可能性<br>技術的支援やコンサルティングの提供<br>制作ツールの開発と共有<br>コミュニティへの貢献とフィードバック収集',
            status: 'planning'
        }
    ];
    
    let currentIndex = 0;
    
    function updateIPBanner(index) {
        const ip = ipData[index];
        
        // Fade out effect
        ipBannerImage.style.opacity = '0';
        
        setTimeout(() => {
            ipBannerImage.src = ip.image;
            ipTitle.textContent = ip.title;
            ipCategory.textContent = ip.category;
            ipDescription.innerHTML = ip.description;
            
            // Update indicators
            ipIndicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // Fade in effect
            ipBannerImage.style.opacity = '1';
        }, 150);
    }
    
    function changeIP(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % ipData.length;
        } else {
            currentIndex = (currentIndex - 1 + ipData.length) % ipData.length;
        }
        updateIPBanner(currentIndex);
    }
    
    // Event listeners
    navLeft.addEventListener('click', () => changeIP('prev'));
    navRight.addEventListener('click', () => changeIP('next'));
    
    // Indicator clicks
    ipIndicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateIPBanner(currentIndex);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const ipSection = document.getElementById('ip');
        const isInViewport = ipSection.getBoundingClientRect().top < window.innerHeight && 
                           ipSection.getBoundingClientRect().bottom > 0;
        
        if (isInViewport) {
            if (e.key === 'ArrowLeft') {
                changeIP('prev');
            } else if (e.key === 'ArrowRight') {
                changeIP('next');
            }
        }
    });
}

// Work Categories functionality
function initWorkCategories() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const workItems = document.querySelectorAll('.work-item');
    
    console.log('Work categories init:', { categoryTabs, workItems });
    
    if (categoryTabs.length === 0) {
        console.error('Category tabs not found');
        return;
    }
    
    // Work data for each category (9 items each)
    const worksGridData = {
        all: [
            { title: '祇園銀座百鬼夜行<br>京都市立芸術大学展示', description: '卒業展示作品のプロジェクションマッピング映像', year: '2024', image: 'images/work2.png' },
            { title: '祇園銀座百鬼夜行<br>三菱銀行展示', description: '個展向け新作映像の制作と展示', year: '2024', image: 'images/work1.png' },
            { title: 'metaherose様万博用キャラクター製作', description: '大阪・関西万博出展用キャラクター制作', year: '2024', image: 'images/work3.png' },
            { title: '香蘭ファッションデザイン専門学校様', description: '公式Webページ用ファーストビュー映像', year: '2023', image: 'images/work4.png' },
            { title: 'CGWORLD 2024年6月号 掲載', description: 'CGWORLD誌に作品が掲載されました', year: '2023', image: 'images/work25.png' },
            { title: '東京国際プロジェクションマッピングアワードvol.10 審査員賞', description: '審査員賞を受賞したプロジェクションマッピング', year: '2024', image: 'images/work41.png' },
            { title: 'CHASE', description: '都市探検をテーマにした自主制作映像', year: '2024', image: 'images/work28.png' },
            { title: 'U30 3DCG Vision Contest 2022', description: 'コンテスト向けに制作したバイク映像', year: '2024', image: 'images/work9.png' },
            { title: 'オリジナルキャラクター制作', description: '個人コンテンツ用キャラクターの研究制作', year: '2023', image: 'images/work58.png' },
            { title: 'ハードサーフィスキャラクター製作1', description: '機能性を追求した四足歩行ロボット', year: '2024', image: 'images/work16.png' }
        ],
        work: [
            { title: '祇園銀座百鬼夜行<br>京都市立芸術大学展示', description: '卒業展示作品のプロジェクションマッピング映像', year: '2024', image: 'images/work2.png' },
            { title: '祇園銀座百鬼夜行<br>三菱銀行展示', description: '個展向け新作映像の制作と展示', year: '2024', image: 'images/work1.png' },
            { title: 'metaherose様万博用キャラクター製作', description: '大阪・関西万博出展用キャラクター制作', year: '2024', image: 'images/work3.png' },
            { title: '香蘭ファッションデザイン専門学校様', description: '公式Webページ用ファーストビュー映像', year: '2023', image: 'images/work4.png' }
        ],
        contest: [
            { title: 'CGWORLD 2024年6月号 掲載', description: 'CGWORLD誌に作品が掲載されました', year: '2023', image: 'images/work25.png', workId: 'work5' },
            { title: '東京国際プロジェクションマッピングアワードvol.10 審査員賞', description: '審査員賞を受賞したプロジェクションマッピング', year: '2024', image: 'images/work41.png', workId: 'work6' },
            { title: '大阪芸術大学ダヴィンチコンテスト 審査員賞', description: '手描きアニメーションで審査員賞を受賞', year: '2024', image: 'images/work14.png', workId: 'work14' }
        ],
        personal: [
            { title: 'オリジナルキャラクター制作', description: '個人コンテンツ用キャラクターの研究制作', year: '2023', image: 'images/work58.png', workId: 'work9' },
            { title: 'ハードサーフィスキャラクター製作1', description: '機能性を追求した四足歩行ロボット', year: '2024', image: 'images/work16.png', workId: 'work10' },
            { title: 'CHASE', description: '都市探検をテーマにした自主制作映像', year: '2024', image: 'images/work28.png', workId: 'work7' },
            { title: 'U30 3DCG Vision Contest 2022', description: 'コンテスト向けに制作したバイク映像', year: '2024', image: 'images/work9.png', workId: 'work8' }
        ]
    };
    
    function updateWorksGrid(category) {
        console.log('Updating works grid for category:', category);
        const works = worksGridData[category] || worksGridData.all;
        const worksGrid = document.getElementById('worksGrid');
        
        if (!worksGrid) {
            console.error('Works grid not found');
            return;
        }
        
        // Clear existing items
        worksGrid.innerHTML = '';
        
        // Create work items dynamically
        works.forEach((work, index) => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            workItem.setAttribute('data-work-id', work.workId || `work${index + 1}`);
            
            workItem.innerHTML = `
                <img src="${work.image}" alt="${work.title}" />
                <div class="work-info">
                    <h3>${work.title}</h3>
                    <p>${work.description}</p>
                </div>
            `;
            
            // Add click handler
            workItem.addEventListener('click', function() {
                openModal(work.workId || `work${index + 1}`);
            });
            
            worksGrid.appendChild(workItem);
        });
        
        console.log(`Added ${works.length} work items to grid`);
    }
    
    // Category switching
    categoryTabs.forEach((tab, index) => {
        console.log(`Setting up category tab ${index}:`, tab.textContent, tab.getAttribute('data-category'));
        
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetCategory = this.getAttribute('data-category');
            console.log('Category tab clicked:', targetCategory);
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid content
            updateWorksGrid(targetCategory);
        });
    });
    
    // Initialize with all category
    updateWorksGrid('all');
}

// Skills data with workflow information
const skillsData = {
    'character': {
        title: 'キャラクター制作',
        subtitle: '用途と文脈から機能性を追求したキャラクターデザイン',
        workflow: [
            {
                image: 'images/skill_character_1.png',
                description: '使用環境と役割を明確化し、動作要件とデザインの方向性を同時に定義。機能性を優先した設計思想を基に、キャラクターの基本構造を決定します。'
            },
            {
                image: 'images/skill_character_2.png',
                description: '動作範囲と用途を考慮した骨格構造を設計。企業ロゴや象徴要素を自然に組み込みつつ、機能美として成立するシルエットを追求します。'
            },
            {
                image: 'images/skill_character_3.png',
                description: '実際の動作を想定したモデリングと、表現に必要な可動域を確保するリギングを同時進行。用途に応じたポリゴン数とテクスチャ仕様を決定します。'
            },
            {
                image: 'images/skill_character_4.png',
                description: '使用環境の光条件を考慮したマテリアル設定。実際のレンダリング環境での見え方を検証しながら、質感の最適化と表現の調整を行います。'
            },
            {
                image: 'images/skill_character_5.png',
                description: '映像や展示での実際の使用を想定した最終調整。用途に応じたフォーマット出力と、実運用でのパフォーマンスを確認し完成させます。'
            }
        ]
    },
    'video': {
        title: '映像撮影・編集・制作',
        subtitle: '目的と媒体特性から最適な映像表現を設計',
        workflow: [
            {
                image: 'images/skill_video_1.png',
                description: '伝えたい情報と使用環境から逆算し、映像の構成とテンポを設計。ファーストビューでの印象や展示空間での効果を考慮した方向性を決定します。'
            },
            {
                image: 'images/skill_video_2.png',
                description: '実写とCGの融合を前提に、撮影計画と3D制作を並行して準備。光の方向性やカメラワークを統一し、シームレスな表現を構築します。'
            },
            {
                image: 'images/skill_video_3.png',
                description: '設計した構成に基づき実撮影とCG制作を実施。音楽との同期を意識しながら、各シーンのインパクトと全体の流れを同時に追求します。'
            },
            {
                image: 'images/skill_video_4.png',
                description: '音ハメやリズムを重視した編集作業。全体のテンポと各シーンのつながりを調整し、視聴者の注意を引き続ける構成を最適化します。'
            },
            {
                image: 'images/skill_video_5.png',
                description: 'Webサイトや展示での実際の使用を想定した最終調整。使用環境に応じたフォーマットと画質設定で、最適な視聴体験を提供します。'
            }
        ]
    },
    'concept': {
        title: 'コンセプト設計',
        subtitle: '制約と目的から制作の方向性を構造化',
        workflow: [
            {
                image: 'images/skill_concept_1.png',
                description: 'プロジェクトの目的と制約条件を整理し、解決すべき課題を明確化。クライアントの意図とユーザーの期待値のギャップを分析します。'
            },
            {
                image: 'images/skill_concept_2.png',
                description: '課題解決に必要な要素を抽出し、制作の優先順位と構造を設計。技術的制約と表現のバランスを考慮した実現可能な方向性を決定します。'
            },
            {
                image: 'images/skill_concept_3.png',
                description: '設計した構造に基づき、各工程の具体的な実装方法を計画。制作チームのスキルと納期を考慮した、現実的な制作フローを構築します。'
            },
            {
                image: 'images/skill_concept_4.png',
                description: '制作過程での品質管理と進行調整。設計したコンセプトがブレないように、各工程での判断基準を明確にし、チーム全体で認識を統一します。'
            },
            {
                image: 'images/skill_concept_5.png',
                description: '完成した制作物の効果を検証し、設計段階での仮説と実際の結果を比較。次のプロジェクトに活かせる知見を抽出し、設計プロセスの改善を図ります。'
            }
        ]
    }
};

// Skills Modal functionality
function initSkillsModal() {
    const skillsModal = document.getElementById('skillsModal');
    const modalOverlay = skillsModal.querySelector('.modal-overlay');
    const modalClose = skillsModal.querySelector('.modal-close');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Open modal when skill item is clicked
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const skillType = this.dataset.skill;
            openSkillsModal(skillType);
        });
    });
    
    // Close modal when overlay is clicked
    modalOverlay.addEventListener('click', closeSkillsModal);
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', closeSkillsModal);
    
    // Close modal when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && skillsModal.classList.contains('active')) {
            closeSkillsModal();
        }
    });
}

// Global function for opening skills modal
function openSkillsModal(skillType) {
    const skill = skillsData[skillType];
    if (!skill) return;
    
    // Set modal content
    document.getElementById('skillModalTitle').textContent = skill.title;
    document.getElementById('skillModalSubtitle').textContent = skill.subtitle;
    
    // Set workflow items
    skill.workflow.forEach((item, index) => {
        const imageElement = document.getElementById(`workflowImage${index + 1}`);
        const descElement = document.getElementById(`workflowDesc${index + 1}`);
        
        imageElement.src = item.image;
        imageElement.alt = skill.title + ' - ' + (index + 1);
        descElement.textContent = item.description;
    });
    
    // Show modal
    document.getElementById('skillsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Global function for closing skills modal
function closeSkillsModal() {
    document.getElementById('skillsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize skills modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkillsModal();
});

// Work data with multiple images for each work (global scope)
const worksData = {
    'work1': {
        title: '祇園銀座百鬼夜行<br>京都市立芸術大学展示',
        year: '2024',
        images: ['images/work2.png', 'images/work47.png', 'images/work50.png','images/work51.png'],
        videoLink: 'https://www.youtube.com/watch?v=E92X2jweWuo',
        description: `
            <h4>概要</h4>
            <p>京都市立芸大卒業展示作品に参加。<br>実写映像とCGを組み合わせた展示用映像制作。</p>
            <h4>担当</h4>
            <p>CG全般/VFX</p>
            <h4>ポイント<br></h4>
            <p>・実写とCGの融合による没入感の創出<br>・作家との共同制作による世界観の統一性<br>・イラスト原画をベースにした3D化・リギング・アニメーション<br>・実写合成を含むVFX制作</p>
        `
    },
    'work2': {
        title: '祇園銀座百鬼夜行<br>三菱銀行展示',
        year: '2024',
        images: ['images/work1.png', 'images/work31.png', 'images/work32.png', 'images/work33.png'],
        videoLink: 'https://youtu.be/b4WSPwbQlGo',
        description: `
            <h4>概要</h4>
            <p>卒業展示作品をもとに、三菱協力による個展向け新作映像を制作。</p>
            
            <h4>担当</h4>
            <p>CG全般/映像監督/映像撮影/VFX</p>
            <h4>ポイント</h4>
            <p>・短尺映像でのインパクト最大化<br>・銀座という場所性を活かした映像演出<br>・情報量のコントロールによる分かりやすさ</p>
        `
    },
    'work3': {
        title: 'metaherose様万博用キャラクター製作',
        year: '2025',
        images: ['images/work3.png', 'images/work35.png', 'images/work36.png', 'images/work52.png'],
        videoLink: 'https://youtu.be/nVYChd6MMo4',
        description: `
            <h4>概要</h4>
            <p>インターン先企業の大阪・関西万博2日間限定出展に際し、<br>ブース用オープニング映像のキャラクター制作を担当しました。</p>
            
            <h4>担当</h4>
            <p>キャラクターデザイン/3Dモデリング/リギング/シェーディング</p>

            <h4>ポイント</h4>
            <p>・2週間という短納期の中で、全ての工程を一貫して担当<br>・企業ロゴの「M」を胸部などに自然に組み込むキャラクターデザイン</p>

        `
    },
    'work4': {
        title: '香蘭ファッション専門学校様',
        year: '2025',
        images: ['images/work4.png', 'images/work37.png'],
        videoLink: 'https://koran.jp/',
        isVideoLink: false,
        description: `
            <h4>概要</h4>
            <p>香蘭ファッションデザイン専門学校の公式Webページに使用される、ファーストビュー映像を制作。</p>
            
            <h4>担当</h4>
            <p>映像制作全般</p>
            <h4>ポイント</h4>
            <p>・クライアントから提示された参考映像をもとに、構成・テンポ・質感の方向性を分析し、それに沿った映像表現を設計<br>・Webサイトのファーストビューでの使用を前提に、短時間で印象が残るリズムと情報密度を意識</p>
        `
    },
    'work5': {
        title: 'CGWORLD 2024年.6月号 掲載',
        year: '2024',
        images: ['images/work24.png', 'images/work5.png', 'images/work39.png', 'images/work53.png'],
        videoLink: 'https://www.youtube.com/shorts/DjV7PhVspKA',
        description: `
            <h4>概要</h4>
            <p>2022年10月頃にXで上げていた作品をCGWORLDの担当さんに見つけていただき掲載の流れになりました。</p>
            
            <h4>担当</h4>
            <p>コンセプトデザイン、3Dモデリング</p>
            
            <h4>ポイント</h4>
            <p>・「ロボットが人間的な行動を取る」という違和感を軸に、AIの人間化をテーマとして設定<br>・機械構造のディテールと、仕草・間の演出を組み合わせることで感情を想起させる表現を追求</p>
        `
    },
    'work6': {
        title: '東京国際プロジェクションマッピングアワード vol.10 審査員賞',
        year: '2025',
        images: ['images/work41.png', 'images/work7.png', 'images/work42.png', 'images/work43.png'],
        videoLink: 'https://www.youtube.com/watch?v=_-FzchqMP8E',
        description: `
            <h4>概要</h4>
            <p>東京国際プロジェクションマッピングアワードに5人チームで参加。</p>
            <h4>担当</h4>
            <p>映像制作 冒頭・終盤シーン ※全体約1分30秒のうち、約40秒/全体方針設計</p>
            <h4>ポイント</h4>
            <p>・建物形状に合わせたプロジェクションマッピング表現を前提に、構図と動きを設計<br>・音楽制作者と密に連携し、音ハメやシーンのインパクトについて最終段階まで調整<br>・冒頭とラストという印象を左右するシーンを担当し、作品の導入と締めを設計</p>
        `

    },
    'work7': {
        title: 'CHASE',
        year: '2025',
        images: ['images/work28.png', 'images/work8.png', 'images/work44.png', 'images/work56.png'],
        videoLink: 'https://youtu.be/5iE0vvYq6l8',
        description: `
            <h4>概要</h4>
            <p>大学授業の自由企画として約2分の動画作品を制作。<br>賛同メンバーとチームを組み、世界観設計から完成までを主導しました。</p>
            <h4>担当</h4>
            <p>総監督/CG制作全般/制作進行/脚本</p>
            <h4>ポイント</h4>
            <p>・企画立案者としてチームを立ち上げ、作品全体の方向性と世界観設計を担当<br>・世界観の統一を重視し、ホワイトボードなどを用いた対面説明で認識のズレを防止。<br>・短納期かつトラブルが重なる中でも、最終的に作品を完成させ、チーム制作として成立させた</p>
        `
    },
    'work8': {
        title: 'U30 3DCG Vision Contest 2022',
        year: '2022',
        images: ['images/work9.png', 'images/work46.png', 'images/work45.png', 'images/work57.png'],
        videoLink: 'https://youtu.be/pCVGDmeJFVM',
        description: `
            <h4>概要</h4>
            <p>コンテストに向けて制作した、個人制作の映像作品。<br>結果として受賞には至らなかったが、3DCGによる映像作品を初めて制作したプロジェクトです。</p>
            
            <h4>担当</h4>
            <p>3DCG制作/アニメーション/映像編集</p>
            <h4>ポイント</h4>
            <p>・モチーフとして選んだバイクについて、外観だけでなく構造理解を重視<br>・見た目の再現に留まらず、「内部構造まで把握した上で作る」姿勢を重視</p>
        `
    },
    'work9': {
        title: 'オリジナルキャラクター制作',
        year: '2025',
        images: ['images/work58.png', 'images/work59.png', 'images/work60.png', 'images/work61.png'],
        description: `
            <h4>概要</h4>
            <p>個人コンテンツの主人公として制作している3DCGキャラクター。<br>アニメ的すぎず、かといって実写寄りにもなりすぎない、自分なりのルックを模索するための継続的な研究制作です。</p>
            
            <h4>担当</h4>
            <p>キャラクターコンセプト/ラフデザイン/スカルプトモデリング</p>
            <h4>ポイント</h4>
            <p>・人体構造の理解を前提に、骨格や筋肉の流れを意識したスカルプトを重視<br>・マテリアルやシェーダー表現について試行錯誤を行い、質感の方向性を検討中<br>・「かわいさとは何か」をテーマに、記号化と生々しさの境界を探りながら造形バランスを模索</p>
        `
    },
    'work10': {
        title: 'ハードサーフィスキャラクター1',
        year: '2026',
        images: ['images/work16.png', 'images/25.png', 'images/work49.png', 'images/work48.png'],
        videoLink: 'https://youtu.be/d2KwTnd51R0',
        description: `
            <h4>概要</h4>
            <p>授業課題<br>必要な役割から構造を考えた四足歩行ロボット3Dモデル。</p>
            <h4>担当</h4>
            <p>コンセプト設計/機能要件定義/形状設計/3Dモデリング</p>
            <h4>ポイント</h4>
            <p>・山岳踏破に必要な機能要件を定義し、機能を基準に形状を逆算して設計<br>・動物的なシルエットは意図的な演出ではなく、機能追求の結果として生まれた造形<br>・威圧感を社会的視点で再解釈し、警護ユニットという用途へ拡張したコンセプト設計</p>
        `
    },
    'work14': {
        title: '大阪芸術大学ダヴィンチコンテスト 審査員賞',
        year: '2023',
        images: ['images/work14.png', 'images/work1.png', 'images/work2.png', 'images/work3.png'],
        videoLink: 'https://youtu.be/eLqyU0VYUrU',
        description: `
            <h4>概要</h4>
            <p>ダヴィンチコンテストに応募するため、約5分間の手描きアニメーション作品を個人制作。<br>企画立案から完成までを一人で担当しました<br本作は、現在の制作スタイルに至る以前の試行錯誤を含んだ、作家活動の初期段階にあたる作品です。></p>          
            <h4>担当</h4>
            <p>総監督/脚本/作画/アニメーション/CG制作全般/制作進行（全工程を一人で担当）</p>
            <h4>ポイント</h4>
            <p>・本プロジェクトを通じて、遠い目標を達成するための戦略、エンタメとしての本質、過酷な制作を乗り越える力を学び、今の自分を支える全ての技術の礎となりました。</p><p>・技術的には未熟な部分もありますが、約5分間の手描きアニメーションを一人で完成させたことが、その後の制作の出発点となりました。</p><p>・そして何より、この挑戦が自分自身を救ってくれたと感じています。</p>
        `
    }
};

// Global variables for modal
let currentWork = null;
let currentImageIndex = 0;
let workModal, modalImage, modalTitle, modalYear, modalDescription;

// Global function for opening modal
function openModal(workId) {
    const work = worksData[workId];
    if (!work) return;
    
    currentWork = workId;
    currentImageIndex = 0;
    
    modalTitle.innerHTML = work.title;
    modalYear.textContent = work.year;
    modalDescription.innerHTML = work.description;
    modalImage.src = work.images[0];
    modalImage.alt = work.title;
    
    // Handle links
    const modalVideoLink = document.getElementById('modalVideoLink');
    const modalWebLink = document.getElementById('modalWebLink');
    const videoLink = modalVideoLink.querySelector('a');
    const webLink = modalWebLink.querySelector('a');
    
    // Hide both links initially
    modalVideoLink.style.display = 'none';
    modalWebLink.style.display = 'none';
    
    if (work.videoLink) {
        if (work.isVideoLink === false) {
            // Show web link
            webLink.href = work.videoLink;
            modalWebLink.style.display = 'block';
        } else {
            // Show YouTube link
            videoLink.href = work.videoLink;
            modalVideoLink.style.display = 'block';
        }
    }
    
    workModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Work Modal functionality
function initWorkModal() {
    workModal = document.getElementById('workModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    modalImage = document.getElementById('modalImage');
    modalTitle = document.getElementById('modalTitle');
    modalYear = document.getElementById('modalYear');
    modalDescription = document.getElementById('modalDescription');
    const navLeft = document.querySelector('.image-nav-left');
    const navRight = document.querySelector('.image-nav-right');
    
    function closeModal() {
        workModal.classList.remove('active');
        document.body.style.overflow = '';
        currentWork = null;
        currentImageIndex = 0;
    }
    
    function changeImage(direction) {
        if (!currentWork) return;
        
        const work = worksData[currentWork];
        const images = work.images;
        
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        }
        
        // Fade out effect
        modalImage.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = images[currentImageIndex];
            modalImage.style.opacity = '1';
        }, 150);
    }
    
    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    navLeft.addEventListener('click', () => changeImage('prev'));
    navRight.addEventListener('click', () => changeImage('next'));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!workModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            changeImage('prev');
        } else if (e.key === 'ArrowRight') {
            changeImage('next');
        }
    });
    
    // Prevent modal content click from closing modal
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
