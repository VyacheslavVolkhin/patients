document.addEventListener("DOMContentLoaded", function () {
	

	if (document.getElementById('chartLines')) {
		const ctx = document.getElementById('chartLines').getContext('2d');
		const chartLines = new Chart(ctx, {
			type: 'line', // Тип диаграммы
			data: {
				labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'], // Метки по оси X
				datasets: [{
					label: 'Мои данные', 
					data: [120, 59, 80, 81, 56, 55, 0, 120, 30, 80, 200, 55],
					borderColor: '#0064FF',
					backgroundColor: '#DCE7FC',
					borderWidth: 3,
					fill: true,
					tension: 0.3,
					hoverRadius: 15,
					pointRadius: 0,
				}]
			},
			options: {
				responsive: false,
				scales: {
					x: {
						display: true,
						beginAtZero: true,
						grid: {
							display: false
						},
					},
					y: {
						display: false,
						beginAtZero: true,
						grid: {
							display: false
						},
					}
				},
				plugins: {
					legend: false,
					title: false,
					chartAreaBorder: false,
					tooltip: {
						enabled: true,
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function(tooltipItem) {
								return `Значение: ${tooltipItem.raw}`;
							}
						}
					}
				  }
	
			}
		});
	}

	
	
	//chat scroll down on load
    let chatBoxLoad = document.querySelector('.chat-box.dropdown-box .popup-content-wrap');
    if (chatBoxLoad) {
        chatBoxLoad.scrollTop = chatBoxLoad.scrollHeight;
    }


	//checkbox tooltip
	const checkboxesTooltip = document.querySelectorAll('.frm-select:has(.lbl-tooltip) input');
	let timeout;

	if (checkboxesTooltip) {
		checkboxesTooltip.forEach(checkbox => {
			checkbox.addEventListener('change', function () {
				// Удаляем класс is-activated у всех чекбоксов
				checkboxesTooltip.forEach(cb => cb.classList.remove('is-activated'));
	
				if (this.checked) {
					this.classList.add('is-activated');
	
					// Удаление класса через 3 секунды
					timeout = setTimeout(() => {
						this.classList.remove('is-activated');
					}, 3000);
				} else {
					// Если чекбокс выключен, очищаем таймер
					clearTimeout(timeout);
				}
			});
		});
	
		// Обработчик события для клика на другие чекбоксы
		checkboxesTooltip.forEach(checkbox => {
			checkbox.addEventListener('click', function () {
				// Если этот чекбокс активирован, отменяем таймер
				if (this.checked) {
					clearTimeout(timeout);
				}
			});
		});
	}

	

  //calendar popup
  const calendarButtons = document.querySelectorAll(".calendar-box tbody td");
  const calendarPopup = document.querySelector(".tbl-total-popup-box");
  const calendarPopupOuter = document.querySelector(".calendar-box");

  if (calendarPopup) {
    calendarButtons.forEach((cButton) => {
      cButton.addEventListener("click", function () {
        calendarPopup.classList.toggle("active");
      });
    });

    document.addEventListener("click", (event) => {
      if (!calendarPopupOuter.contains(event.target)) {
        calendarPopup.classList.remove("active");
      }
    });
  }


    //table go to href
	document.querySelectorAll('tr[data-href]').forEach(function(row) {
        row.addEventListener('click', function(event) {
            var chatButtonActive = document.querySelector('.js-btn-chat-open.active') !== null;
            var menuPopupActive = document.querySelector('.tbl-menu-popup-box.dropdown-box.active') !== null;
            var totalPopupActive = document.querySelector('.tbl-total-popup-box.dropdown-box.active') !== null;

            if (!event.target.closest('.frm-select') && 
                !event.target.closest('.btn') && 
                !chatButtonActive && 
                !menuPopupActive && 
                !totalPopupActive) {
                var href = this.getAttribute('data-href');
                window.location.href = href;
            }
        });
    });
  
  
  //table right click menu
  const tableRows = document.querySelectorAll("tbody tr");
  const popupBox = document.querySelector(".tbl-menu-popup-box");

  if (popupBox) {
    tableRows.forEach((row) => {
      row.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          const rect = row.getBoundingClientRect();
          const tableRect = row.closest("table").getBoundingClientRect();
          popupBox.style.top = `${rect.top - tableRect.top}px`;
          popupBox.style.left = `${rect.left - tableRect.left}px`;

          popupBox.classList.add("active");
        }
      });

	  row.addEventListener("touchend", (event) => {
		const checkbox = row.querySelector('input[type="checkbox"]');
		if (checkbox && checkbox.checked) {
			const rect = row.getBoundingClientRect();
			const tableRect = row.closest("table").getBoundingClientRect();
			popupBox.style.top = `${rect.top - tableRect.top}px`;
			popupBox.style.left = `${rect.left - tableRect.left}px`;

			popupBox.classList.add("active");
		}
	});
	  
	  
    });
	
    tableRows.forEach((row) => {
      row.addEventListener("contextmenu", (event) => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          event.preventDefault();
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!popupBox.contains(event.target)) {
        popupBox.classList.remove("active");
      }
    });
  }


  //field-password
  const passwordToggle = document.querySelectorAll(".js-password-toggle");
  for (let i = 0; i < passwordToggle.length; i++) {
	passwordToggle[i
	].addEventListener("click", function (e) {
	  if (this.classList.contains("active")) {
		this.classList.remove("active");
		const input = this.closest(".frm-field-password").querySelector(
		  ".form-input"
		);
		input.type = "password";
		} else {
		this.classList.add("active");
		const input = this.closest(".frm-field-password").querySelector(
		  ".form-input"
		);
		input.type = "text";
		}
	e.preventDefault();
	})
  }


  //button scroll 
  document.querySelectorAll('.js-anchor').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			behavior: 'smooth'
		});
	});
  });

  //btn tgl and add
  let tglButtons = document.querySelectorAll(".js-btn-tgl");
  let addButtons = document.querySelectorAll(".js-btn-add");
  for (i = 0; i < tglButtons.length; i++) {
    tglButtons[i].addEventListener("click", function (e) {
      this.classList.contains("active")
        ? this.classList.remove("active")
        : this.classList.add("active");
      e.preventDefault();
      return false;
    });
  }
  for (i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function (e) {
      if (!this.classList.contains("active")) {
        this.classList.add("active");
        e.preventDefault();
        return false;
      }
    });
  }
  let buttonsTglOne = document.querySelectorAll(".js-btn-tgl-one");
  buttonsTglOne.forEach(function (button) {
    button.addEventListener("click", function (e) {

		
      e.preventDefault();
      let row = this.closest(".items-wrap");
      row.querySelectorAll(".js-btn-tgl-one").forEach(function (btn) {
        btn.classList.remove("active");
      });
      row.querySelectorAll(".js-btn-tgl-one").forEach(function (btn) {
        btn.classList.remove("active");
      });
      this.classList.add("active");

	  const chatBoxTile = document.querySelector('.chat-box.dropdown-box .popup-content-wrap');
	chatBoxTile.scrollTop = chatBoxTile.scrollHeight;
	  
      return false;
    });
  });

  //table chats toggle

  const chatButtonOpen = document.querySelectorAll(".js-btn-chat-open");
  const chatPopupContentWrap = document.querySelector('.chat-box.dropdown-box .popup-content-wrap');
  for (i = 0; i < chatButtonOpen.length; i++) {
    chatButtonOpen[i].addEventListener("click", function (e) {
      if (!this.classList.contains("active")) {
        this.classList.add("active");
        chatPopupContentWrap.scrollTop = chatPopupContentWrap.scrollHeight;
		
		
        e.preventDefault();
        return false;
      }
    });
  }

  //fancybox
  Fancybox.bind("[data-fancybox]", {
    //settings
  });

  //check table
  const tableAllCheckbox = document.getElementById("table-all");
  const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
  if (tableAllCheckbox) {
    tableAllCheckbox.addEventListener("change", function () {
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = tableAllCheckbox.checked;
      });
    });
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const allChecked = Array.from(checkboxes).every((chk) => chk.checked);
        tableAllCheckbox.checked = allChecked;
      });
    });
  }

  //js popup wrap
  const togglePopupButtons = document.querySelectorAll(".js-btn-popup-toggle");
  const closePopupButtons = document.querySelectorAll(".js-btn-popup-close");
  const popupElements = document.querySelectorAll(".js-popup-wrap");
  const wrapWidth = document.querySelector(".wrap").offsetWidth;
  const bodyElem = document.querySelector("body");
  function popupElementsClear() {
    document.body.classList.remove("menu-show");
    document.body.classList.remove("filter-show");
    document.body.classList.remove("search-show");
    popupElements.forEach((element) => element.classList.remove("popup-right"));
  }
  function popupElementsClose() {
    togglePopupButtons.forEach((element) => {
      if (!element.closest(".no-close")) {
        element.classList.remove("active");
      }
    });
  }
  function popupElementsContentPositionClass() {
    popupElements.forEach((element) => {
      let pLeft = element.offsetLeft;
      let pWidth = element.querySelector(".js-popup-block").offsetWidth;
      let pMax = pLeft + pWidth;
      if (pMax > wrapWidth) {
        element.classList.add("popup-right");
      } else {
        element.classList.remove("popup-right");
      }
    });
  }
  for (i = 0; i < togglePopupButtons.length; i++) {
    togglePopupButtons[i].addEventListener("click", function (e) {
      popupElementsClear();
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        popupElementsClose();
        this.classList.add("active");
        if (this.closest(".popup-menu-wrap")) {
          document.body.classList.add("menu-show");
        }
        if (this.closest(".popup-search-wrap")) {
          document.body.classList.add("search-show");
        }
        if (this.closest(".popup-filter-wrap")) {
          document.body.classList.add("filter-show");
        }
        popupElementsContentPositionClass();
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  for (i = 0; i < closePopupButtons.length; i++) {
    closePopupButtons[i].addEventListener("click", function (e) {
      popupElementsClear();
      popupElementsClose();
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  document.onclick = function (event) {
    if (!event.target.closest(".js-popup-block")) {
      popupElementsClear();
      popupElementsClose();
    }
  };
  popupElements.forEach((element) => {
    if (element.classList.contains("js-popup-select")) {
      let popupElementSelectItem = element.querySelectorAll(
        ".js-popup-block li a"
      );
      if (element.querySelector(".js-popup-block .active")) {
        element.classList.add("select-active");
        let popupElementActive = element.querySelector(
          ".js-popup-block .active"
        ).innerHTML;
        let popupElementButton = element.querySelector(".js-btn-popup-toggle");
        popupElementButton.innerHTML = "";
        popupElementButton.insertAdjacentHTML("beforeend", popupElementActive);
      } else {
        element.classList.remove("select-active");
      }
      for (i = 0; i < popupElementSelectItem.length; i++) {
        popupElementSelectItem[i].addEventListener("click", function (e) {
          this.closest(".js-popup-wrap").classList.add("select-active");
          if (
            this.closest(".js-popup-wrap").querySelector(
              ".js-popup-block .active"
            )
          ) {
            this.closest(".js-popup-wrap")
              .querySelector(".js-popup-block .active")
              .classList.remove("active");
          }
          this.classList.add("active");
          let popupElementActive = element.querySelector(
            ".js-popup-block .active"
          ).innerHTML;
          let popupElementButton = element.querySelector(
            ".js-btn-popup-toggle"
          );
          popupElementButton.innerHTML = "";
          popupElementButton.insertAdjacentHTML(
            "beforeend",
            popupElementActive
          );
          popupElementsClear();
          popupElementsClose();
          if (!this.closest(".js-tabs-nav")) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      }
    }
  });

  //js tabs
  const tabsNav = document.querySelectorAll(".js-tabs-nav");
  const tabsBlocks = document.querySelectorAll(".js-tab-block");
  const tabsButtonTitle = document.querySelectorAll(".js-tab-title");
  const tabsButtonContent = document.querySelectorAll(".js-tab-content");
  function tabsActiveStart() {
    for (iTab = 0; iTab < tabsBlocks.length; iTab++) {
      if (tabsBlocks[iTab].classList.contains("active")) {
        tabsBlocks[iTab].classList.remove("active");
      }
    }
    for (i = 0; i < tabsNav.length; i++) {
      let tabsNavElements = tabsNav[i].querySelectorAll("[data-tab]");
      for (iElements = 0; iElements < tabsNavElements.length; iElements++) {
        if (tabsNavElements[iElements].classList.contains("active")) {
          let tabsNavElementActive = tabsNavElements[iElements].dataset.tab;
          for (j = 0; j < tabsBlocks.length; j++) {
            if (
              tabsBlocks[j].dataset.tab
                .toString()
                .indexOf(tabsNavElementActive) > -1
            ) {
              
              tabsBlocks[j].classList.add("active");
            }
          }
        }
      }
    }
  }
  for (i = 0; i < tabsButtonTitle.length; i++) {
    tabsButtonTitle[i].addEventListener("click", function (e) {
      this.classList.toggle("active");
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  for (i = 0; i < tabsNav.length; i++) {
    tabsNav[i].addEventListener("click", function (e) {
      if (e.target.closest("[data-tab]")) {
        let tabsNavElements = this.querySelector("[data-tab].active");
        tabsNavElements ? tabsNavElements.classList.remove("active") : false;
        e.target.closest("[data-tab]").classList.add("active");
        tabsActiveStart();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }
  tabsActiveStart();

  // Popups
  let popupCurrent;
  let popupsList = document.querySelectorAll(".popup-outer-box");

  document.querySelectorAll(".js-popup-open").forEach(function (element) {
    element.addEventListener("click", function (e) {
      document.querySelector(".popup-outer-box").classList.remove("active");
      document.body.classList.add("popup-open");

      popupCurrent = this.getAttribute("data-popup");
      document
        .querySelector(
          `.popup-outer-box[id="${popupCurrent}"
			]`
        )
        .classList.add("active");

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  document.querySelectorAll(".js-popup-close").forEach(function (element) {
    element.addEventListener("click", function (event) {
      document.body.classList.remove("popup-open");
      for (i = 0; i < popupsList.length; i++) {
        popupsList[i].classList.remove("active");
      }
      event.preventDefault();
      event.stopPropagation();
    });
  });
  document.querySelectorAll(".popup-outer-box").forEach(function (element) {
    element.addEventListener("click", function (event) {
      if (!event.target.closest(".popup-box")) {
        document.body.classList.remove("popup-open");
        document.body.classList.remove("popup-open-scroll");
        document.querySelectorAll(".popup-outer-box").forEach(function (e) {
          e.classList.remove("active");
        });
        return false;
      }
    });
  });

  //slider row
  const swiperSliderRow = new Swiper(".slider-row .swiper", {
    loop: true,
    slidesPerView: "auto",
	loopedSlidesLimit: null,
	slidesPerGroup: 1,
    spaceBetween: 0,
    autoHeight: false,
    speed: 4000,
    pagination: false,
    centeredSlides: true,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    navigation: false,
  });

  //slider tiles
  const swiperSliderTiles = new Swiper(".slider-tiles .swiper", {
    loop: true,
    slidesPerView: "auto",
	loopedSlidesLimit: null,
	slidesPerGroup: 1,
    direction: "vertical",
    spaceBetween: 0,
    autoHeight: true,
    speed: 400,
    pagination: false,
    navigation: false,
    //allowTouchMove: false,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: "110%",
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
  });


  //slider dashboard
  const swiperSliderDBoard = new Swiper('.slider-dashboard .swiper', {
	loop: false,
	slidesPerView: 'auto',
	spaceBetween: 0,
	autoHeight: false,
	speed: 400,
	pagination: false,
	autoplay: false,
	navigation: false,
	freeMode: true,
  
  });


  //slider dashboard line
  const swiperSliderDBoardLine = new Swiper('.slider-dashboard-line .swiper', {
	loop: false,
	slidesPerView: 'auto',
	spaceBetween: 0,
	autoHeight: false,
	speed: 400,
	pagination: false,
	autoplay: false,
	navigation: false,
	freeMode: true,
  
  });
  

  
  
});
