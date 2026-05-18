document.addEventListener("DOMContentLoaded", () => {
    const animatedItems = document.querySelectorAll(
        ".left_animation_global, .right_animation_global"
    );

    const isMobile = window.innerWidth <= 749;

    // Trigger before fully entering viewport
    const offset = isMobile ? 50 : 150;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            threshold: 0,
            rootMargin: `0px 0px -${offset}px 0px`
        }
    );

    animatedItems.forEach((item) => {
        observer.observe(item);
    });
});