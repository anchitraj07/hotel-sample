/**
 * HÔTEL HERMITAGE MONTE-CARLO - LUXURY HOTEL JAVASCRIPT
 * Inspired by Monte-Carlo Société des Bains de Mer (SBM)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. CURRENCY CONVERSION & RATES
  // ==========================================
  const currencyRates = {
    EUR: { symbol: '€', rate: 1.0, position: 'after' },
    USD: { symbol: '$', rate: 1.08, position: 'before' },
    GBP: { symbol: '£', rate: 0.85, position: 'before' },
    CHF: { symbol: 'CHF ', rate: 0.96, position: 'before' }
  };

  let currentCurrency = 'EUR';

  const currencySelectors = document.querySelectorAll('.sbm-currency-select');
  currencySelectors.forEach(select => {
    select.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      currencySelectors.forEach(s => s.value = currentCurrency);
      updateCurrencyDisplay();
    });
  });

  function formatMoney(amountInEUR) {
    const config = currencyRates[currentCurrency] || currencyRates.EUR;
    const converted = Math.round(amountInEUR * config.rate);
    const formatted = converted.toLocaleString();
    if (config.position === 'before') {
      return `${config.symbol}${formatted}`;
    } else {
      return `${formatted} ${config.symbol}`;
    }
  }

  function updateCurrencyDisplay() {
    const priceElements = document.querySelectorAll('[data-price-eur]');
    priceElements.forEach(el => {
      const baseEUR = parseFloat(el.getAttribute('data-price-eur'));
      if (!isNaN(baseEUR)) {
        el.textContent = formatMoney(baseEUR);
      }
    });

    // Update Drawer if open
    updateBookingSummary();
  }

  // ==========================================
  // 2. HERO SLIDER LOGIC
  // ==========================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlideIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  }

  function nextSlide() {
    if (!heroSlides.length) return;
    let nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    if (!heroSlides.length) return;
    let prevIndex = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
    showSlide(prevIndex);
  }

  const nextHeroBtn = document.getElementById('heroNext');
  const prevHeroBtn = document.getElementById('heroPrev');

  if (nextHeroBtn && prevHeroBtn) {
    nextHeroBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      nextSlide();
      startAutoSlide();
    });

    prevHeroBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      prevSlide();
      startAutoSlide();
    });
  }

  function startAutoSlide() {
    if (heroSlides.length > 1) {
      slideInterval = setInterval(nextSlide, 6000);
    }
  }
  startAutoSlide();

  // ==========================================
  // 3. STICKY HEADER SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 4. DATE PICKERS & STAY CALCULATION
  // ==========================================
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');

  if (checkinInput && checkoutInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    const formatDateVal = (date) => date.toISOString().split('T')[0];

    checkinInput.min = formatDateVal(today);
    checkinInput.value = formatDateVal(tomorrow);

    checkoutInput.min = formatDateVal(tomorrow);
    checkoutInput.value = formatDateVal(dayAfter);

    checkinInput.addEventListener('change', () => {
      const selectedCheckin = new Date(checkinInput.value);
      const nextDay = new Date(selectedCheckin);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = formatDateVal(nextDay);
      if (new Date(checkoutInput.value) <= selectedCheckin) {
        checkoutInput.value = formatDateVal(nextDay);
      }
      updateBookingSummary();
    });

    checkoutInput.addEventListener('change', () => {
      updateBookingSummary();
    });
  }

  function getCalculatedNights() {
    if (!checkinInput || !checkoutInput) return 2;
    const d1 = new Date(checkinInput.value);
    const d2 = new Date(checkoutInput.value);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  // ==========================================
  // 5. GUEST PICKER DROPDOWN
  // ==========================================
  const guestTrigger = document.getElementById('guestSummaryTrigger');
  const guestDropdown = document.getElementById('guestPickerDropdown');
  let guests = { adults: 2, children: 0, rooms: 1 };

  if (guestTrigger && guestDropdown) {
    guestTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      guestDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!guestDropdown.contains(e.target) && !guestTrigger.contains(e.target)) {
        guestDropdown.classList.remove('active');
      }
    });

    const setupCounter = (type, min = 0, max = 8) => {
      const decBtn = document.querySelector(`[data-action="dec-${type}"]`);
      const incBtn = document.querySelector(`[data-action="inc-${type}"]`);
      const valEl = document.querySelector(`[data-target="${type}-val"]`);

      if (decBtn && incBtn && valEl) {
        decBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (guests[type] > min) {
            guests[type]--;
            valEl.textContent = guests[type];
            updateGuestSummaryText();
          }
        });

        incBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (guests[type] < max) {
            guests[type]++;
            valEl.textContent = guests[type];
            updateGuestSummaryText();
          }
        });
      }
    };

    setupCounter('adults', 1, 6);
    setupCounter('children', 0, 4);
    setupCounter('rooms', 1, 4);

    function updateGuestSummaryText() {
      const adultStr = guests.adults === 1 ? '1 Adult' : `${guests.adults} Adults`;
      const childStr = guests.children > 0 ? `, ${guests.children} Children` : '';
      const roomStr = guests.rooms === 1 ? '1 Room' : `${guests.rooms} Rooms`;
      const fullText = `${adultStr}${childStr} • ${roomStr}`;
      
      const summaryDisplay = document.getElementById('guestSummaryDisplay');
      if (summaryDisplay) {
        summaryDisplay.textContent = fullText;
      }
      updateBookingSummary();
    }
  }

  // ==========================================
  // 6. ROOMS FILTER TABS
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        if (filterVal === 'all') {
          card.style.display = 'flex';
        } else {
          const category = card.getAttribute('data-category');
          if (category === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // ==========================================
  // 7. ROOM DETAILS MODAL
  // ==========================================
  const roomData = {
    'superior-city': {
      title: 'Superior Room - Square Beaumarchais View',
      category: 'Superior Collection',
      price: 680,
      size: '35 m² / 377 sq ft',
      bed: 'King Bed or Twin Beds',
      view: 'Monaco Carré d’Or & Square Beaumarchais',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: 'The Superior Room captures the timeless Belle Époque spirit of Hôtel Hermitage Monte-Carlo. Graced with high ceilings, exquisite classic moldings, and bespoke fabrics, it offers an intimate and serene sanctuary moments from the Casino de Monte-Carlo.',
      amenities: ['Carrara marble bathroom with deep soaking tub', 'Hermès bath and body amenities', 'Bespoke high-speed fiber Wi-Fi', 'Complimentary access to Thermes Marins Monte-Carlo', 'Cercle Monte-Carlo VIP Resort Card included', 'Twice-daily housekeeping with evening turndown']
    },
    'deluxe-sea': {
      title: 'Deluxe Room - Mediterranean Sea View',
      category: 'Deluxe Collection',
      price: 890,
      size: '42 m² / 452 sq ft',
      bed: 'King Bed',
      view: 'Panoramic Mediterranean Sea & Port Hercule',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      description: 'Bathed in the golden Riviera light, the Deluxe Sea View Room frames spectacular vistas over Port Hercule and the Mediterranean horizon. Decorated in pastel harmonies of cream, pearl, and gold with antique furnishings.',
      amenities: ['Balcony or panoramic French windows', 'Separate rain shower and marble bathtub', 'Hermès Paris luxury amenities', 'Personalized in-room bar with grand crus', 'Direct indoor private access to Thermes Marins', 'Exclusive Monte-Carlo resort privileges']
    },
    'junior-suite-terrace': {
      title: 'Junior Suite - Sea View with Private Terrace',
      category: 'Junior Suite Collection',
      price: 1350,
      size: '55 m² / 592 sq ft',
      bed: 'King Bed + Elegant Salon Area',
      view: 'Port Hercule, Prince’s Palace & Sea',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      description: 'An idyllic private retreat featuring an expansive private sun terrace furnished with teak loungers. Enjoy breakfast overlooking superyachts moored in Port Hercule and the dramatic cliff of the Prince’s Palace.',
      amenities: ['Furnished private panoramic terrace', 'Expansive living salon with plush velvet sofa', 'Full marble bathroom with dual vanity and Jacuzzi tub', '24/7 Dedicated Palace Concierge & In-room dining', 'VIP arrival welcome with vintage Champagne & delicacies', 'Complimentary resort shuttle between SBM palaces']
    },
    'diamond-suite-penthouse': {
      title: 'Diamond Suite - Riviera Rooftop & Jacuzzi',
      category: 'Exclusive Diamond Collection',
      price: 3800,
      size: '160 m² / 1,722 sq ft',
      bed: 'Master King Bedroom + Dressing Room + Dining Salon',
      view: '360° Panoramic Mediterranean Sea, Harbor & Monaco Rock',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      description: 'The Diamond Suites embody the pinnacle of high residential luxury in Monaco. Featuring an extraordinary private rooftop terrace equipped with a heated whirlpool jacuzzi, solarium, outdoor dining pavilion, and 24/7 dedicated butler service.',
      amenities: ['Private rooftop terrace with heated jacuzzi', 'Personal 24-hour Palace Butler service', 'Dom Pérignon Champagne & caviar upon arrival', 'Private luxury transfer from Nice Airport (Helicopter or Mercedes-Maybach)', 'Private elevator access and separate salon & dining room', 'Complimentary access to private salons at Casino de Monte-Carlo']
    },
    'diamond-suite-princely': {
      title: 'Diamond Suite - Princely Residence',
      category: 'Exclusive Diamond Collection',
      price: 4900,
      size: '220 m² / 2,368 sq ft',
      bed: 'Two Master King Suites + Private Dining Salon',
      view: 'Frontal Panorama of Mediterranean Sea & Port Hercule',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      description: 'A stately palace residence named in homage to the royal heritage of the Principality. Features hand-carved boiserie, bespoke crystal chandeliers, an intimate library lounge, and two palatial master suites.',
      amenities: ['Two expansive master bedrooms with ensuite marble bathrooms', 'Full formal dining room seating 8 guests', 'Dedicated Palace Butler & private sommelier consultations', 'Private sauna and hammam inside the suite', 'Unlimited access to Thermes Marins VIP wellness suite', 'Exclusive VIP reservations for Formula 1 Grand Prix terraces']
    },
    'deluxe-harbor': {
      title: 'Deluxe Room - Port Hercule Harbor View',
      category: 'Deluxe Collection',
      price: 980,
      size: '45 m² / 484 sq ft',
      bed: 'King Bed',
      view: 'Yacht Harbor & Prince’s Palace',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
      description: 'Overlooking the bustling glamour of Monaco’s legendary Port Hercule, this room offers prime front-row views of the world’s most prestigious mega-yachts and the timeless Belle Époque harbor architecture.',
      amenities: ['Private balcony facing Port Hercule', 'Italian marble bathroom with Hermès amenities', 'Nespresso Atelier and curated teas', 'Complimentary high-speed Wi-Fi', 'Priority reservations at Yannick Alléno’s Pavyllon', 'Cercle Monte-Carlo card benefits']
    }
  };

  const roomDetailModal = document.getElementById('roomDetailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openRoomModal(roomId) {
    const data = roomData[roomId];
    if (!data || !roomDetailModal) return;

    document.getElementById('modalRoomImg').src = data.image;
    document.getElementById('modalRoomCategory').textContent = data.category;
    document.getElementById('modalRoomTitle').textContent = data.title;
    document.getElementById('modalRoomPrice').textContent = formatMoney(data.price);
    document.getElementById('modalRoomSize').textContent = data.size;
    document.getElementById('modalRoomBed').textContent = data.bed;
    document.getElementById('modalRoomView').textContent = data.view;
    document.getElementById('modalRoomDesc').textContent = data.description;

    const amenitiesList = document.getElementById('modalRoomAmenities');
    amenitiesList.innerHTML = '';
    data.amenities.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${item}</span>
      `;
      amenitiesList.appendChild(li);
    });

    const bookThisBtn = document.getElementById('modalBookBtn');
    if (bookThisBtn) {
      bookThisBtn.onclick = () => {
        roomDetailModal.classList.remove('active');
        openBookingDrawer(roomId);
      };
    }

    roomDetailModal.classList.add('active');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      roomDetailModal.classList.remove('active');
    });
  }

  if (roomDetailModal) {
    roomDetailModal.addEventListener('click', (e) => {
      if (e.target === roomDetailModal) {
        roomDetailModal.classList.remove('active');
      }
    });
  }

  // Bind Room Card Buttons
  document.querySelectorAll('[data-view-room]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomId = btn.getAttribute('data-view-room');
      openRoomModal(roomId);
    });
  });

  document.querySelectorAll('[data-book-room]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomId = btn.getAttribute('data-book-room');
      openBookingDrawer(roomId);
    });
  });

  // ==========================================
  // 8. INTERACTIVE BOOKING DRAWER / CHECKOUT
  // ==========================================
  const bookingDrawerOverlay = document.getElementById('bookingDrawerOverlay');
  const bookingDrawer = document.getElementById('bookingDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  let selectedRoomId = 'deluxe-sea';
  let selectedRatePlan = 'flexible'; // flexible or bnb
  let selectedExtras = [];

  function openBookingDrawer(roomId = 'deluxe-sea') {
    selectedRoomId = roomId;
    const roomSelect = document.getElementById('drawerRoomSelect');
    if (roomSelect) {
      roomSelect.value = roomId;
    }
    updateBookingSummary();
    bookingDrawerOverlay?.classList.add('active');
    bookingDrawer?.classList.add('active');
  }

  function closeBookingDrawer() {
    bookingDrawerOverlay?.classList.remove('active');
    bookingDrawer?.classList.remove('active');
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeBookingDrawer);
  }
  if (bookingDrawerOverlay) {
    bookingDrawerOverlay.addEventListener('click', closeBookingDrawer);
  }

  // Trigger from top header & booking bar
  document.querySelectorAll('.btn-header-book, #bookingBarSubmit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingDrawer(selectedRoomId);
    });
  });

  const drawerRoomSelect = document.getElementById('drawerRoomSelect');
  if (drawerRoomSelect) {
    drawerRoomSelect.addEventListener('change', (e) => {
      selectedRoomId = e.target.value;
      updateBookingSummary();
    });
  }

  const ratePlanRadios = document.querySelectorAll('input[name="ratePlan"]');
  ratePlanRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedRatePlan = e.target.value;
      updateBookingSummary();
    });
  });

  const extraCheckboxes = document.querySelectorAll('input[name="extraAddon"]');
  extraCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedExtras = Array.from(extraCheckboxes)
        .filter(c => c.checked)
        .map(c => ({
          name: c.getAttribute('data-name'),
          price: parseFloat(c.getAttribute('data-price') || 0)
        }));
      updateBookingSummary();
    });
  });

  function updateBookingSummary() {
    const room = roomData[selectedRoomId] || roomData['deluxe-sea'];
    const nights = getCalculatedNights();
    const guestsCount = guests ? `${guests.adults} Adults, ${guests.rooms} Rooms` : '2 Adults, 1 Room';

    let baseNightly = room.price;
    if (selectedRatePlan === 'bnb') {
      baseNightly += 80; // Palace breakfast inclusion per night
    }

    const roomSubtotal = baseNightly * nights;
    let extrasTotal = 0;
    selectedExtras.forEach(ex => extrasTotal += ex.price);

    const cityTax = 14 * nights; // Monaco luxury palace tourist tax
    const grandTotal = roomSubtotal + extrasTotal + cityTax;

    const elRoomName = document.getElementById('sumRoomName');
    const elStayDates = document.getElementById('sumStayDates');
    const elNights = document.getElementById('sumNightsCount');
    const elNightlyRate = document.getElementById('sumNightlyRate');
    const elExtras = document.getElementById('sumExtrasTotal');
    const elTaxes = document.getElementById('sumTaxes');
    const elGrandTotal = document.getElementById('sumGrandTotal');

    if (elRoomName) elRoomName.textContent = room.title;
    if (elStayDates) {
      const cin = checkinInput ? checkinInput.value : 'Upcoming Stay';
      const cout = checkoutInput ? checkoutInput.value : '';
      elStayDates.textContent = `${cin} to ${cout} (${guestsCount})`;
    }
    if (elNights) elNights.textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
    if (elNightlyRate) elNightlyRate.textContent = formatMoney(baseNightly);
    if (elExtras) elExtras.textContent = formatMoney(extrasTotal);
    if (elTaxes) elTaxes.textContent = formatMoney(cityTax);
    if (elGrandTotal) elGrandTotal.textContent = formatMoney(grandTotal);
  }

  // Handle Booking Form Submit
  const bookingForm = document.getElementById('drawerBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('clientFullName')?.value || 'Honored Guest';
      const confNumber = 'MC-HERM-' + Math.floor(100000 + Math.random() * 900000);

      closeBookingDrawer();
      showToast(`Reservation Confirmed for ${clientName}! Reference: ${confNumber}. Welcome to Hôtel Hermitage Monte-Carlo.`);
    });
  }

  // ==========================================
  // 9. TABLE RESERVATION MODAL (DINING)
  // ==========================================
  const tableModal = document.getElementById('tableModal');
  const tableCloseBtn = document.getElementById('tableModalClose');
  const tableForm = document.getElementById('tableBookingForm');

  document.querySelectorAll('[data-reserve-table]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const restaurant = btn.getAttribute('data-reserve-table');
      const restaurantSelect = document.getElementById('tableRestaurantSelect');
      if (restaurantSelect && restaurant) {
        restaurantSelect.value = restaurant;
      }
      tableModal?.classList.add('active');
    });
  });

  if (tableCloseBtn) {
    tableCloseBtn.addEventListener('click', () => tableModal?.classList.remove('active'));
  }
  if (tableModal) {
    tableModal.addEventListener('click', (e) => {
      if (e.target === tableModal) tableModal.classList.remove('active');
    });
  }

  if (tableForm) {
    tableForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const resName = document.getElementById('tableRestaurantSelect')?.selectedOptions[0]?.text || 'our restaurant';
      tableModal?.classList.remove('active');
      showToast(`Your table at ${resName} has been reserved! Our Maître d' will welcome you.`);
    });
  }

  // ==========================================
  // 10. LIGHTBOX GALLERY
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
      item.addEventListener('click', () => {
        currentGalleryIndex = index;
        openLightbox(currentGalleryIndex);
      });
    }
  });

  function openLightbox(idx) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = galleryImages[idx];
    lightboxModal.classList.add('active');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal?.classList.remove('active');
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 11. MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 12. NEWSLETTER SUBSCRIPTION & TOAST
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        emailInput.value = '';
        showToast('Thank you for subscribing to Monte-Carlo SBM private invitations.');
      }
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      toast.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="toast-message"></span>
      `;
      document.body.appendChild(toast);
    }

    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Initialize display
  updateCurrencyDisplay();
});
