// document.addEventListener("DOMContentLoaded", () => {
//     const selector = ".left_animation_global, .right_animation_global";

//     const observer = new IntersectionObserver(
//         (entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add("is-visible");
//                     observer.unobserve(entry.target);
//                 }
//             });
//         },
//         {
//             root: null,
//             threshold: 0
//         }
//     );

//     const observeAnimations = (root = document) => {
//         root.querySelectorAll(selector).forEach((element) => {
//             if (!element.classList.contains("is-visible")) {
//                 observer.observe(element);
//             }
//         });
//     };

//     // Initial elements
//     observeAnimations();

//     // Handle dynamically added/re-rendered Shopify sections
//     const mutationObserver = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             mutation.addedNodes.forEach((node) => {
//                 if (node.nodeType !== 1) return;

//                 if (node.matches?.(selector)) {
//                     observer.observe(node);
//                 }

//                 observeAnimations(node);
//             });
//         });
//     });

//     mutationObserver.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// });