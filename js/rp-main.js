/**
 * RP GROUP OF HOTELS - MAIN INTERACTIVE JAVASCRIPT
 * 100% Responsive, Touch-Friendly, Optimized for Meta Ads Conversion
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. BANQUET & WEDDING COST ESTIMATOR
  // ==========================================
  const guestSlider = document.getElementById('calcGuests');
  const guestDisplay = document.getElementById('calcGuestVal');
  const eventTypeSelect = document.getElementById('calcEventType');
  const packageSelect = document.getElementById('calcPackage');
  const hallRecommendDisplay = document.getElementById('calcHallRecommend');
  const estimateTotalDisplay = document.getElementById('calcEstimateTotal');
  const whatsappQuoteBtn = document.getElementById('calcWhatsappBtn');

  function updateBanquetEstimate() {
    if (!guestSlider) return;
    const count = parseInt(guestSlider.value, 10);
    if (guestDisplay) {
      guestDisplay.textContent = `${count} Guests`;
    }

    // Plate cost
    const platePrice = parseInt(packageSelect?.value || '1650', 10);
    const totalEst = count * platePrice;

    // Hall Recommendation
    let hallName = 'Emerald Banquet Hall';
    if (count > 700) {
      hallName = 'The Kohinoor Grand Lawn (1,500+ Capacity)';
    } else if (count > 300) {
      hallName = 'The Royal Crystal Ballroom (600+ Capacity)';
    } else {
      hallName = 'The Emerald Banquet & Boardroom (250 Capacity)';
    }

    if (hallRecommendDisplay) {
      hallRecommendDisplay.textContent = hallName;
    }

    if (estimateTotalDisplay) {
      estimateTotalDisplay.textContent = `₹ ${totalEst.toLocaleString('en-IN')}`;
    }

    // Update WhatsApp link with pre-filled message
    if (whatsappQuoteBtn) {
      const eventName = eventTypeSelect?.options[eventTypeSelect.selectedIndex]?.text || 'Wedding';
      const msg = encodeURIComponent(
        `Hello RP Group of Hotels! I would like to inquire about hosting a ${eventName} in Patna for ${count} guests. Preferred venue: ${hallName}. Please share available dates and banquet packages.`
      );
      whatsappQuoteBtn.href = `https://wa.me/919123456789?text=${msg}`;
    }
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', updateBanquetEstimate);
    packageSelect?.addEventListener('change', updateBanquetEstimate);
    eventTypeSelect?.addEventListener('change', updateBanquetEstimate);
    updateBanquetEstimate();
  }

  // ==========================================
  // 2. STICKY HEADER SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('.rp-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 3. DATE PICKERS INITIALIZATION
  // ==========================================
  const checkinInput = document.getElementById('rpCheckin');
  const checkoutInput = document.getElementById('rpCheckout');

  if (checkinInput && checkoutInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const fmt = (d) => d.toISOString().split('T')[0];

    checkinInput.min = fmt(today);
    checkinInput.value = fmt(tomorrow);
    checkoutInput.min = fmt(tomorrow);
    checkoutInput.value = fmt(dayAfter);

    checkinInput.addEventListener('change', () => {
      const selected = new Date(checkinInput.value);
      const next = new Date(selected);
      next.setDate(next.getDate() + 1);
      checkoutInput.min = fmt(next);
      if (new Date(checkoutInput.value) <= selected) {
        checkoutInput.value = fmt(next);
      }
    });
  }

  // ==========================================
  // 4. MOBILE DRAWER NAVIGATION & TOUCH OVERLAY
  // ==========================================
  const mobileToggle = document.getElementById('rpMobileToggle');
  const mobileDrawer = document.getElementById('rpMobileDrawer');
  const drawerClose = document.getElementById('rpDrawerClose');
  let drawerOverlay = document.getElementById('rpDrawerOverlay');

  if (!drawerOverlay && mobileDrawer) {
    drawerOverlay = document.createElement('div');
    drawerOverlay.id = 'rpDrawerOverlay';
    drawerOverlay.className = 'rp-drawer-overlay';
    document.body.appendChild(drawerOverlay);
  }

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      mobileDrawer.style.transform = 'translateX(0)';
    }
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      mobileDrawer.style.transform = 'translateX(-100%)';
    }
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer?.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeBookingModal();
    }
  });

  // ==========================================
  // 5. LEAD FORM SUBMISSIONS (META ADS CONVERSION)
  // ==========================================
  const metaLeadForm = document.getElementById('metaLeadForm');
  if (metaLeadForm) {
    metaLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value || 'Valued Guest';
      const phone = document.getElementById('leadPhone')?.value || '';
      
      showToast(`Thank you, ${name}! Your special offer & banquet package has been sent to ${phone}. Our Patna Reservations team will call you within 15 minutes.`);
      metaLeadForm.reset();
    });
  }

  const roomBookingForm = document.getElementById('roomBookingForm');
  if (roomBookingForm) {
    roomBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('bookingGuestName')?.value || 'Guest';
      const conf = 'RP-PAT-' + Math.floor(100000 + Math.random() * 900000);
      showToast(`Booking Guaranteed for ${guestName}! Booking ID: ${conf}. Welcome to RP Group of Hotels.`);
      closeBookingModal();
    });
  }

  // ==========================================
  // 6. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(msg) {
    let toast = document.querySelector('.rp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'rp-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #0b1320;
        color: #ffffff;
        border: 1px solid #d4af37;
        padding: 1rem 1.6rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 3000;
        font-size: 0.88rem;
        max-width: 92vw;
        width: 480px;
        text-align: center;
        opacity: 0;
        transition: all 0.35s ease;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
    }, 5000);
  }

  // ==========================================
  // 7. ROOM BOOKING MODAL
  // ==========================================
  const bookingModal = document.getElementById('rpBookingModal');
  const modalClose = document.getElementById('modalCloseBtn');

  function openBookingModal(propName = 'RP Grand Regalia, Patna') {
    if (!bookingModal) return;
    const propSelect = document.getElementById('modalPropSelect');
    if (propSelect) propSelect.value = propName;
    bookingModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prop = btn.getAttribute('data-open-booking') || 'RP Grand Regalia, Patna';
      openBookingModal(prop);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }
});
