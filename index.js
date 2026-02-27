// ===== DEBUG MODE =====
        console.log('🚀 Script mulai loading...');

        // ===== EMAILJS INITIALIZATION =====
        console.log('📧 Menginisialisasi EmailJS...');
        emailjs.init("bKrdj3622Cym9JHGz");
        console.log('✅ EmailJS initialized');

        /// ===== PROFESSIONAL NOTIFICATION SYSTEM =====
        function showNotification({
            title = 'Notification',
            message = '',
            type = 'success',
            duration = 5000
        } = {}) {
            console.log(`🔔 Membuat notifikasi: ${title} - ${type}`);

            let container = document.getElementById('notificationContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'notificationContainer';
                container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
                document.body.appendChild(container);
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;

            notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;

            container.appendChild(notification);

            // Trigger animation - PAKAI CSS CLASS
            setTimeout(() => notification.classList.add('show'), 100);

            // Progress bar animation
            const progressBar = notification.querySelector('.notification-progress');
            if (progressBar && duration > 0) {
                setTimeout(() => {
                    progressBar.style.transition = `transform ${duration}ms linear`;
                    progressBar.style.transform = 'scaleX(0)';
                }, 100);
            }

            // Auto remove setelah duration
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            if (notification.parentElement) {
                                notification.remove();
                            }
                        }, 400);
                    }
                }, duration);
            }

            return notification;
        }

        function getNotificationIcon(type) {
            const icons = {
                success: 'fa-check',
                error: 'fa-times',
                warning: 'fa-exclamation',
                info: 'fa-info'
            };
            return icons[type] || 'fa-bell';
        }

        function getNotificationColor(type) {
            const colors = {
                success: 'var(--irmaf-green)',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#3B82F6'
            }
            return colors[type] || '#6B7280';
        }

        // ===== SEND EMAIL FUNCTION DENGAN ERROR HANDLING LENGKAP =====
        async function sendEmail(event) {
            console.log('📨 Form submit triggered');
            event.preventDefault();

            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const formData = {
                    user_name: document.querySelector('[name="user_name"]').value,
                    user_email: document.querySelector('[name="user_email"]').value || 'Tidak diisi',
                    message: document.querySelector('[name="message"]').value,
                    timestamp: new Date().toLocaleString('id-ID'),
                    from_website: 'Website IRMAF'
                };

                console.log('📝 Form data collected:', formData);

                // Validasi
                if (!formData.user_name.trim()) {
                    throw new Error('Nama harus diisi');
                }
                if (!formData.message.trim()) {
                    throw new Error('Pesan harus diisi');
                }

                // Show sending notification
                showNotification({
                    title: 'Mengirim Pesan...',
                    message: 'Sedang mengirim pesan Anda',
                    type: 'info',
                    duration: 3000
                });

                console.log('🔄 Mengirim email via EmailJS...');

                // Send email - PAKAI TRY-CATCH KHUSUS UNTUK EMAILJS
                let response;
                try {
                    response = await emailjs.send(
                        'service_0kp9hli',
                        'template_cxak1cl',
                        formData
                    );
                    console.log('✅ Email berhasil dikirim:', response);
                } catch (emailError) {
                    console.error('❌ EmailJS error:', emailError);

                    // Tampilkan error detail di console untuk debugging
                    if (emailError.text) {
                        console.error('Error details:', emailError.text);
                    }

                    // Lempar error lagi untuk ditangkap oleh catch di luar
                    throw emailError;
                }

                // Success notification
                showNotification({
                    title: 'Berhasil!',
                    message: `Terima kasih <strong>${formData.user_name}</strong>, pesan sudah terkirim! Terima kasih, pesan dan saran Anda telah kami terima.`,
                    type: 'success',
                    duration: 6000
                });

                // Reset form
                event.target.reset();

            } catch (error) {
                console.error('❌ Gagal mengirim email:', error);

                let errorMessage = 'Gagal mengirim pesan. ';
                let errorTitle = 'Gagal Mengirim!';

                if (error.status === 0) {
                    errorMessage += 'Tidak ada koneksi internet.';
                } else if (error.text && error.text.includes('Invalid template')) {
                    errorMessage += 'Template email tidak valid.';
                } else if (error.text && error.text.includes('User ID')) {
                    errorMessage += 'Public Key salah.';
                } else if (error.text && error.text.includes('Service ID')) {
                    errorMessage += 'Service ID tidak valid.';
                } else if (error.text && error.text.includes('Template ID')) {
                    errorMessage += 'Template ID tidak valid.';
                } else if (error.text && error.text.includes('Failed to send')) {
                    errorMessage += 'Server EmailJS bermasalah.';
                } else if (error.message && error.message.includes('harus diisi')) {
                    errorMessage = error.message;
                    errorTitle = 'Form Tidak Lengkap ⚠️';
                } else if (error.text) {
                    errorMessage += 'Error: ' + error.text;
                } else {
                    errorMessage += 'Silakan coba lagi.';
                }

                // Tampilkan notifikasi error
                showNotification({
                    title: errorTitle,
                    message: errorMessage,
                    type: 'error',
                    duration: 8000 // Lebih lama biar bisa dibaca
                });

                // Tampilkan juga alert untuk pastikan user lihat
                setTimeout(() => {
                    if (confirm(`Gagal mengirim pesan:

${errorMessage}

Coba lagi?`)) {
                        // User mau coba lagi, form tetap terisi
                    }
                }, 1000);

            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }

        // ===== TEST FUNGSI GAGAL =====
        function testEmailJSError() {
            console.log('🧪 Testing EmailJS error...');

            // Simulasikan error dengan credentials salah
            const testData = {
                user_name: 'Test Error',
                user_email: 'test@example.com',
                message: 'This should fail',
                timestamp: new Date().toLocaleString('id-ID')
            };

            // Pakai service ID yang salah untuk test error
            emailjs.send(
                'service_salah', // Service ID salah
                'template_salah', // Template ID salah
                testData
            ).then(response => {
                console.log('Unexpected success:', response);
            }).catch(error => {
                console.log('✅ Error test successful:', error);
                showNotification({
                    title: 'Error Test Berhasil! ✅',
                    message: 'Sistem error handling bekerja dengan baik',
                    type: 'success',
                    duration: 5000
                });
            });
        }

        // ===== TEST KONEKSI INTERNET =====
        function testNoConnection() {
            console.log('🧪 Testing no connection...');
            showNotification({
                title: 'Test No Connection 🌐',
                message: 'Ini mensimulasikan error tanpa koneksi internet',
                type: 'error',
                duration: 5000
            });
        }

        // ===== TEST FUNCTIONS =====
        function testNotifications() {
            console.log('🧪 Testing notifications...');
            showNotification({
                title: 'Success Test! ✅',
                message: 'Ini adalah notifikasi success untuk testing',
                type: 'success',
                duration: 4000
            });

            setTimeout(() => {
                showNotification({
                    title: 'Error Test! ❌',
                    message: 'Ini adalah notifikasi error untuk testing',
                    type: 'error',
                    duration: 4000
                });
            }, 1000);

            setTimeout(() => {
                showNotification({
                    title: 'Warning Test! ⚠️',
                    message: 'Ini adalah notifikasi warning untuk testing',
                    type: 'warning',
                    duration: 4000
                });
            }, 2000);

            setTimeout(() => {
                showNotification({
                    title: 'Info Test! ℹ️',
                    message: 'Ini adalah notifikasi info untuk testing',
                    type: 'info',
                    duration: 4000
                });
            }, 3000);
        }

        async function testEmailJSConnection() {
            try {
                console.log('🧪 Testing EmailJS connection...');

                const testData = {
                    user_name: 'Test User',
                    user_email: 'test@example.com',
                    message: 'This is a test message from IRMAF website',
                    timestamp: new Date().toLocaleString('id-ID')
                };

                const response = await emailjs.send(
                    'service_0kp9hli',
                    'template_cxak1cl',
                    testData
                );

                console.log('✅ EmailJS Connection Test: SUCCESS', response);
                showNotification({
                    title: 'Connection Test ✅',
                    message: 'EmailJS terhubung dengan baik!',
                    type: 'success',
                    duration: 4000
                });

                return true;
            } catch (error) {
                console.error('❌ EmailJS Connection Test: FAILED', error);
                showNotification({
                    title: 'Connection Test ❌',
                    message: 'Gagal terhubung ke EmailJS: ' + (error.text || error.message),
                    type: 'error',
                    duration: 6000
                });
                return false;
            }
        }

        // ===== NAV MENU (hamburger) (kept intact tapi smoother) =====

        (function () {
            const hamburger = document.getElementById('hamburger');
            const menu = document.getElementById('mobileMenu');

            if (!hamburger || !menu) return;

            menu.classList.add('-translate-y-5');

            function openMenu() {
                menu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    menu.classList.remove('opacity-0');
                    menu.classList.remove('-translate-y-5');
                });
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                menu.classList.add('opacity-0');
                menu.classList.add('-translate-y-5');
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300);
                document.body.style.overflow = '';
            }


            hamburger.addEventListener('click', e => {
                e.stopPropagation();
                const isOpen = !menu.classList.contains('hidden');
                if (isOpen) closeMenu();
                else openMenu();
            });

            document.addEventListener('click', e => {
                if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMenu();
                }
            });

            document.querySelectorAll('#mobileMenu a').forEach(a => {
                a.addEventListener('click', () => {
                    closeMenu();
                });
            });

            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') closeMenu();
            });
        })();

        // ===== GALERI SLIDER (smoother) =====
        (function () {
            const slider = document.querySelector('.galeri-slider');
            const items = document.querySelectorAll('.galeri-item');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');

            if (!slider || items.length === 0) return;

            let currentIndex = 0;

            function updateSlide() {
    const itemRect = items[0].getBoundingClientRect();
    const style = window.getComputedStyle(items[0]);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    const slideWidth = itemRect.width + margin;

    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}


            function nextSlide() {
                if (currentIndex < items.length - 1) currentIndex++;
                updateSlide();
            }

            function prevSlide() {
                if (currentIndex > 0) currentIndex--;
                updateSlide();
            }

            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);

            // Klik 1x di HP buat nampilin overlay
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.galeri-item').forEach(i => {
                        if (i !== item) i.classList.remove('show-overlay');
                    });
                    item.classList.toggle('show-overlay');
                });
            });

            // Close overlay ketika klik di luar
            document.addEventListener('click', () => {
                document.querySelectorAll('.galeri-item').forEach(i => {
                    i.classList.remove('show-overlay');
                });
            });

            // Geser manual di HP (swipe)
            let startX = 0;
            slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
            slider.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].clientX - startX;
                if (diff > 50 && currentIndex > 0) currentIndex--;
                if (diff < -50 && currentIndex < items.length - 1) currentIndex++;
                updateSlide();
            });

            window.addEventListener('resize', updateSlide);

            // initial
            setTimeout(updateSlide, 300);
        })();

        // ===== BACK TO TOP =====
        const backtop = document.getElementById('backtop');
        if (backtop) {
            window.addEventListener('scroll', () => {
                backtop.style.display = window.scrollY > 600 ? 'flex' : 'none';
            });

            backtop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // ====Script Toggle Smooth Animation  floating button ====

        const toggleBtn = document.getElementById('wa-toggle');
        const cards = document.getElementById('wa-cards');

        toggleBtn.addEventListener('click', () => {
            if (cards.classList.contains('opacity-0')) {
                // Show cards with animation
                cards.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                cards.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            } else {
                // Hide cards with animation
                cards.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                cards.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        });


        // ===== YEAR =====
        document.getElementById('year').textContent = new Date().getFullYear();

        const flipCard = document.querySelector('.flip-card');
        if (flipCard) {
            let lastTapTime = 0;
            let isOverlayVisible = false;
            let isFlipped = false;

            flipCard.addEventListener('dblclick', () => {
                isFlipped = !isFlipped;
                flipCard.classList.toggle('flipped', isFlipped);
                flipCard.classList.remove('show-overlay');
                isOverlayVisible = false;
            });

            flipCard.addEventListener('touchend', (e) => {
                const now = new Date().getTime();
                const timeDiff = now - lastTapTime;

                if (timeDiff < 300 && timeDiff > 0) {
                    e.preventDefault();
                    isFlipped = !isFlipped;
                    flipCard.classList.toggle('flipped', isFlipped);
                    flipCard.classList.remove('show-overlay');
                    isOverlayVisible = false;
                } else {
                    isOverlayVisible = !isOverlayVisible;
                    flipCard.classList.toggle('show-overlay', isOverlayVisible);
                }

                lastTapTime = now;
            });

            document.addEventListener('click', (e) => {
                if (!flipCard.contains(e.target)) {
                    flipCard.classList.remove('show-overlay');
                    isOverlayVisible = false;
                }
            });
        }

        // ===== FORM HANDLER =====
        const kontakForm = document.getElementById("kontakForm");
        if (kontakForm) {
            kontakForm.addEventListener("submit", sendEmail);
        }

        // ===== HOVER EFFECTS =====
        document.querySelectorAll('.anggota, .flip-card').forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        });

        document.querySelectorAll('#kegiatan .bg-white').forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-6px)';
                this.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            });
        });

        // ===== WELCOME NOTIFICATION =====
        window.addEventListener('load', function () {
            setTimeout(() => {
                showNotification({
                    title: 'Selamat Datang!',
                    message: 'Terima kasih telah mengunjungi website IRMAF - Ikatan Remaja Masjid Al-Furqon',
                    type: 'info',
                    duration: 5000
                });
            }, 1000);
        });

        // ===== SMOOTH SCROLLING =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ===== SCROLL REVEAL & NAVBAR SOLID =====
        (function () {
            const reveals = document.querySelectorAll('.reveal');

            function onScrollReveal() {
                reveals.forEach(r => {
                    const rect = r.getBoundingClientRect();
                    if (rect.top < (window.innerHeight - 80)) r.classList.add('show');
                });

                // navbar
                const nav = document.getElementById('siteNav');
                if (window.scrollY > 70) nav.classList.add('solid'), nav.classList.remove('transparent');
                else nav.classList.add('transparent'), nav.classList.remove('solid');
            }
            window.addEventListener('scroll', onScrollReveal);
            onScrollReveal();
        })();

        // ===== IMAGE CLICK MODAL =====
document.addEventListener("DOMContentLoaded", function() {

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

// HANYA IMG DI DALAM #kegiatan
document.querySelectorAll("#kegiatan img").forEach(img => {
  img.style.cursor = "pointer";
  img.addEventListener("click", function () {
    modal.classList.add("show");
    modalImg.src = this.src;
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

});

        // ===== GLOBAL DEBUG FUNCTIONS =====
        window.testEmailJS = testEmailJSConnection;
        window.testNotif = testNotifications;
        window.testError = testEmailJSError;
        window.testNoConnection = testNoConnection;

        console.log('✅ All JavaScript functions loaded successfully!');
        console.log('🔧 Debug commands available:');
        console.log('   testNotif()       - Test notifikasi');
        console.log('   testEmailJS()     - Test koneksi EmailJS');
        console.log('   testError()       - Test error handling');
        console.log('   testNoConnection()- Test error koneksi');

    const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "IRMAF - Ikatan Remaja Masjid Al-Furqon",
  "url": "https://irmafalfurqon.vercel.app", // isi kalau sudah ada
  "logo": "https://files.catbox.moe/44rpu5.jpg",
  "sameAs": ["https://www.instagram.com/irmaf.bm",
  "https://tiktok.com/@irmaf_bm"]
};

const script = document.createElement("script");
script.type = "application/ld+json";
script.text = JSON.stringify(structuredData);

document.head.appendChild(script);