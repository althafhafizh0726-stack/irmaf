const siteHeader = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    const backTop = document.getElementById("backTop");
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-panel a");
    const revealEls = document.querySelectorAll(".reveal");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.getElementById("closeModal");
    const contactForm = document.getElementById("contactForm");

    document.getElementById("year").textContent = new Date().getFullYear();

    const updateHeaderState = () => {
      const isScrolled = window.scrollY > 18;
      siteHeader.classList.toggle("scrolled", isScrolled);
      backTop.classList.toggle("show", window.scrollY > 500);
    };

    const setActiveLink = () => {
      const scrollPoint = window.scrollY + 150;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPoint >= top && scrollPoint < top + height) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    };

    navToggle.addEventListener("click", () => {
      const isOpen = mobilePanel.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.innerHTML = isOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.innerHTML = '<i class="ri-menu-line"></i>';
      });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealEls.forEach((el) => revealObserver.observe(el));

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        modalImage.src = item.dataset.image;
        modalImage.alt = item.dataset.alt;
        imageModal.classList.add("open");
        imageModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    const closeImageModal = () => {
      imageModal.classList.remove("open");
      imageModal.setAttribute("aria-hidden", "true");
      modalImage.src = "";
      modalImage.alt = "";
      document.body.style.overflow = "";
    };

    closeModal.addEventListener("click", closeImageModal);
    imageModal.addEventListener("click", (event) => {
      if (event.target === imageModal) {
        closeImageModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && imageModal.classList.contains("open")) {
        closeImageModal();
      }
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      const text = [
        "Assalamu'alaikum kak, saya ingin menghubungi IRMAF.",
        "",
        "Nama: " + name,
        "Email: " + (email || "-"),
        "Subjek: " + (subject || "-"),
        "Pesan:",
        message
      ].join("\n");

      const url = "https://wa.me/6285174091388?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
    });

    backTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", () => {
      updateHeaderState();
      setActiveLink();
    });

    updateHeaderState();
    setActiveLink();
