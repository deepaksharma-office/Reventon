(() => {
  const instances = new WeakMap();
  class EventCategoryGallery {
    constructor(section) {
      this.section = section;
      this.tabs = [...section.querySelectorAll('[data-gallery-tab]')];
      this.panels = [...section.querySelectorAll('[data-gallery-panel]')];
      this.modal = section.querySelector('[data-gallery-modal]');
      this.modalImage = section.querySelector('[data-gallery-modal-image]');
      this.lastTrigger = null;
      this.controller = new AbortController();
      this.bindEvents();
    }
    bindEvents() {
      const options = { signal: this.controller.signal };
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.activateTab(tab), options);
        tab.addEventListener('keydown', (event) => this.handleTabKeydown(event, index), options);
      });
      this.section.querySelectorAll('[data-gallery-open]').forEach((button) => button.addEventListener('click', () => this.openModal(button), options));
      this.section.querySelectorAll('[data-gallery-close]').forEach((button) => button.addEventListener('click', () => this.closeModal(), options));
      this.modal?.addEventListener('click', (event) => { if (event.target === this.modal) this.closeModal(); }, options);
      this.modal?.addEventListener('close', () => this.resetModal(), options);
    }
    activateTab(activeTab, focus = false) {
      this.tabs.forEach((tab) => { const active = tab === activeTab; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
      this.panels.forEach((panel) => { panel.hidden = panel.id !== activeTab.dataset.panelId; });
      if (focus) activeTab.focus();
    }
    handleTabKeydown(event, index) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + this.tabs.length) % this.tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = this.tabs.length - 1;
      this.activateTab(this.tabs[next], true);
    }
    openModal(trigger) {
      if (!this.modal || !this.modalImage || !trigger.dataset.imageUrl) return;
      this.lastTrigger = trigger;
      this.modalImage.src = trigger.dataset.imageUrl;
      this.modalImage.alt = trigger.dataset.imageAlt || '';
      this.modalImage.removeAttribute('width');
      this.modalImage.removeAttribute('height');
      this.modal.showModal();
    }
    closeModal() { if (this.modal?.open) this.modal.close(); }
    resetModal() { if (this.modalImage) { this.modalImage.src = ''; this.modalImage.alt = ''; } this.lastTrigger?.focus({ preventScroll: true }); this.lastTrigger = null; }
    selectBlock(block) { const panel = block.closest('[data-gallery-panel]'); const tab = this.tabs.find((item) => item.dataset.panelId === panel?.id); if (tab) this.activateTab(tab, true); }
    destroy() { this.closeModal(); this.controller.abort(); instances.delete(this.section); }
  }
  const init = (root = document) => {
    const sections = root.matches?.('[data-event-gallery-section]') ? [root] : [...root.querySelectorAll('[data-event-gallery-section]')];
    sections.forEach((section) => { if (!instances.has(section)) instances.set(section, new EventCategoryGallery(section)); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(), { once: true }); else init();
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:section:unload', (event) => { const section = event.target.matches?.('[data-event-gallery-section]') ? event.target : event.target.querySelector?.('[data-event-gallery-section]'); instances.get(section)?.destroy(); });
  document.addEventListener('shopify:block:select', (event) => { const section = event.target.closest?.('[data-event-gallery-section]'); const block = event.target.closest?.('[data-gallery-panel]'); if (section && block) instances.get(section)?.selectBlock(block); });
})();
