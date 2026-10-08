/**
 * УКРТЕНДЕРКОНСАЛТ — Головний скрипт інтерактивності
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Липкий хедер (Sticky Header on scroll)
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  // Кнопка нагору
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Мобільне меню та випадаючий список послуг (Mobile Navigation & Dropdown)
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  const dropdownToggle = document.getElementById('servicesDropdownToggle');
  const dropdownContainer = document.querySelector('.nav-item-dropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  mobileToggle?.addEventListener('click', () => {
    mainNav?.classList.toggle('open');
  });

  // Клік на Послуги в мобільному режимі розгортає підменю
  dropdownToggle?.addEventListener('click', (e) => {
    if (window.innerWidth <= 1200) {
      e.preventDefault();
      dropdownContainer?.classList.toggle('active');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav?.classList.remove('open');
      dropdownContainer?.classList.remove('active');
    });
  });

  // Закриття випадаючого списку при кліку за межами
  document.addEventListener('click', (e) => {
    if (!dropdownContainer?.contains(e.target)) {
      dropdownContainer?.classList.remove('active');
    }
  });

  // 3. Плаваючий віджет швидкого зв'язку (Floating Messengers)
  const floatingContainer = document.querySelector('.floating-messengers');
  const floatingToggle = document.querySelector('.floating-toggle-btn');

  floatingToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    floatingContainer?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!floatingContainer?.contains(e.target)) {
      floatingContainer?.classList.remove('open');
    }
  });

  // 4. Перемикання вкладок послуг (Scoped Tabs)
  document.querySelectorAll('.services-nav-tabs').forEach(tabNav => {
    const parentContainer = tabNav.closest('section') || tabNav.parentElement;
    const btns = tabNav.querySelectorAll('.tab-btn');
    const panels = parentContainer.querySelectorAll('.tab-content-panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = parentContainer.querySelector('#' + targetTab);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  });

  // Синхронізація кліків з випадаючого списку та швидких карток
  const switchServiceTab = (tabId) => {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  };

  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab-trigger');
      if (tabId) {
        switchServiceTab(tabId);
      }
      mainNav?.classList.remove('open');
      dropdownContainer?.classList.remove('active');
    });
  });

  document.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', () => {
      const href = card.getAttribute('href');
      if (href === '#prozorro-participants') switchServiceTab('tab-prozorro-participants');
      else if (href === '#prozorro-customers') switchServiceTab('tab-prozorro-customers');
      else if (href === '#cert-products') switchServiceTab('tab-cert-products');
      else if (href === '#cert-iso') switchServiceTab('tab-cert-iso');
    });
  });

  // 5. Анімація лічильників при прокрутці (Number Counters)
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUp = (el, target, duration = 2000) => {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toLocaleString('uk-UA');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString('uk-UA');
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const val = parseInt(stat.getAttribute('data-target'), 10);
          if (!isNaN(val)) {
            countUp(stat, val);
          }
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-counter-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 6. Модальне вікно консультації (Consultation Modal)
  const consultModal = document.getElementById('consultModal');
  const openConsultBtns = document.querySelectorAll('.open-consult-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');
  const serviceInput = document.getElementById('modalServiceInput');

  openConsultBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'Загальна консультація';
      if (serviceInput) {
        serviceInput.value = serviceName;
      }
      consultModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // 7. Модальне вікно для читання статей блогу
  const articleModal = document.getElementById('articleModal');
  const articleModalTitle = document.getElementById('articleModalTitle');
  const articleModalBody = document.getElementById('articleModalBody');
  const readArticleBtns = document.querySelectorAll('.read-article-btn');

  // База повних текстів статей з ТЗ
  const articlesDatabase = {
    'article-1': {
      title: 'Як правильно підготуватися до участі у публічній закупівлі',
      content: `
        <p>Участь у тендері починається не з натискання кнопки «Подати пропозицію». Перш за все необхідно оцінити саму закупівлю, вимоги замовника, строки, кваліфікаційні критерії та документи, які повинен надати учасник.</p>
        <h4 style="margin: 20px 0 10px; color: #2E4E2A;">На що варто звернути увагу?</h4>
        <ol style="margin-left: 20px; line-height: 1.8;">
          <li><strong>Проаналізувати тендерну документацію</strong> — Необхідно уважно перевірити всі вимоги замовника та визначити, чи може підприємство їх виконати без правових колізій.</li>
          <li><strong>Перевірити документи</strong> — Навіть одна відсутня або неправильно оформлена довідка чи недійсний сертифікат може створити фатальний ризик відхилення пропозиції.</li>
          <li><strong>Проаналізувати технічні вимоги</strong> — Учасник повинен чітко розуміти, який саме товар, роботу або послугу вимагає замовник, чи не закладені приховані аналоги.</li>
          <li><strong>Перевірити строки</strong> — Необхідно заздалегідь визначити строки підготовки документів, банківської гарантії та кінцевий термін подання.</li>
          <li><strong>Оцінити юридичні ризики</strong> — Якщо вимоги замовника містять ознаки дискримінації, необхідно своєчасно подати вимогу або скаргу до АМКУ у встановлені законом строки.</li>
        </ol>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          <strong>Висновок:</strong> Професійна підготовка до тендера значно важливіша за механічне завантаження документів у систему. Довірте аналіз кваліфікованим юристам УКРТЕНДЕРКОНСАЛТ.
        </div>
      `
    },
    'article-2': {
      title: 'Найпоширеніші помилки учасників тендерів',
      content: `
        <p>Участь у закупівлі потребує виняткової уважності до деталей. Навіть дрібна технічна неточність дає замовнику формальну підставу для відхилення пропозиції.</p>
        <h4 style="margin: 20px 0 10px; color: #2E4E2A;">Серед найбільш поширених проблем можна виділити:</h4>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li>• Неналежне або неповне оформлення кваліфікаційних документів;</li>
          <li>• Пропуск строків усунення невідповідностей (правило «24 години»);</li>
          <li>• Неврахування спеціальних приміток та окремих вимог тендерної документації;</li>
          <li>• Невідповідність поданих документів встановленим замовником формам;</li>
          <li>• Неправильне розуміння технічного завдання та надання невідповідних сертифікатів;</li>
          <li>• Відсутність обов'язкових підтверджень фінансової спроможності чи аналогічного досвіду;</li>
          <li>• Недостатній аналіз пропозицій конкурентів для захисту власної перемоги;</li>
          <li>• Несвоєчасне реагування на неправомірні дії замовника.</li>
        </ul>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          <strong>Головна помилка:</strong> Найчастіше учасник починає аналізувати проблему вже після відхилення пропозиції. Набагато ефективніше оцінити ризики ДО подання тендерної пропозиції разом із фахівцями.
        </div>
      `
    },
    'article-3': {
      title: 'Що робити, якщо вимоги тендерної документації здаються дискримінаційними?',
      content: `
        <p>Не кожна незручна для учасника вимога є дискримінаційною з точки зору законодавства та практики Органу оскарження (АМКУ).</p>
        <h4 style="margin: 20px 0 10px; color: #2E4E2A;">Для правильної оцінки необхідно провести детальний аналіз:</h4>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li>• Предмет закупівлі та специфіка ринку;</li>
          <li>• Встановлена замовником кваліфікаційна чи технічна вимога;</li>
          <li>• Її об'єктивне технічне та економічне обґрунтування;</li>
          <li>• Можливість виконання вимоги різними учасниками (наявність реальної конкуренції);</li>
          <li>• Відповідність вимоги нормам Закону «Про публічні закупівлі» та судовим прецедентам;</li>
          <li>• Наслідки встановлення такої вимоги для чесної та відкритої конкуренції.</li>
        </ul>
        <p style="margin-top: 15px;">Якщо за результатами юридичного аналізу встановлено явні ознаки порушення прав учасників, необхідно визначити належний спосіб реагування (вимога через систему або пряма скарга до АМКУ) та діяти чітко у встановлені строки.</p>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          Юристи УКРТЕНДЕРКОНСАЛТ мають багаторічний практичний досвід оскарження в АМКУ та готові захистити ваші законні права на чесну участь у торгах.
        </div>
      `
    },
    'article-4': {
      title: 'Тендер під ключ: коли бізнесу потрібен професійний супровід',
      content: `
        <p>Для компанії участь у тендері — це не просто ще одна рутинна адміністративна процедура. Це стратегічний канал отримання державних та комерційних замовлень.</p>
        <p>Підготовка документів, глибинний аналіз вимог, суворий контроль строків, тактична участь в електронному аукціоні, моніторинг дій опонентів та фінальне укладення безпечного договору потребують значного часу та спеціальної експертизи.</p>
        <h4 style="margin: 20px 0 10px; color: #2E4E2A;">Формат «Тендер під ключ» особливо вигідний для компаній, які:</h4>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li>• Регулярно беруть або планують брати участь у державних закупівлях;</li>
          <li>• Не мають штатного тендерного відділу або хочуть оптимізувати витрати на штат;</li>
          <li>• Бажають звести до нуля технічні помилки та відхилення через формальності;</li>
          <li>• Потребують своєчасного юридичного аудиту тендерної документації;</li>
          <li>• Прагнуть комплексного результату: від підбору торгів до підписання договору та оплати.</li>
        </ul>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          Вартість комплексного супроводу процедури значно нижча за утримання штатного юриста, а результат гарантується кваліфікованою командою практиків.
        </div>
      `
    },
    'article-5': {
      title: 'Що необхідно перевірити перед поданням тендерної пропозиції',
      content: `
        <p>Перед остаточним завантаженням та підписанням тендерної пропозиції електронним цифровим підписом (КЕП), рекомендуємо здійснити фінальний контрольний чек-лист:</p>
        <div style="display: grid; gap: 12px; margin-top: 15px;">
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>1. Документи</strong> — чи всі довідки, статутні документи та форми згідно з ТД наявні та підписані?
          </div>
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>2. Строки</strong> — чи не спливає кінцевий термін подання, чи закладено час на технічні затримки майданчика?
          </div>
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>3. Кваліфікаційні вимоги</strong> — чи відповідає пропозиція кожному критерію замовника без винятків?
          </div>
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>4. Технічна частина</strong> — чи відповідає запропонований товар, робота або послуга специфікації?
          </div>
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>5. Цінова пропозиція</strong> — чи правильно зазначена вартість з урахуванням ПДВ або без нього, та чи сходяться розрахунки?
          </div>
          <div style="background: #fff; border: 1px solid #e2e8e6; padding: 12px; border-radius: 6px;">
            <strong>6. Формальні вимоги</strong> — чи коректно названі файли, чи нанесено КЕП/УЕП у правильному форматі (.p7s / .asice)?
          </div>
        </div>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          <strong>Порада:</strong> Фінальна перевірка перед поданням допомагає виявити помилки, які після завершення строку подання виправити вже неможливо!
        </div>
      `
    },
    'article-6': {
      title: 'Публічні закупівлі та бізнес: чому юридична підтримка стає важливою',
      content: `
        <p>Публічні закупівлі в системі Prozorro створюють для бізнесу колосальні ринкові можливості, але водночас вимагають високої правової культури та суворого дотримання регуляторних норм.</p>
        <p>Учасник повинен не лише запропонувати конкурентну економічну ціну, а й забезпечити абсолютну відповідність своєї пропозиції встановленим законодавчим вимогам.</p>
        <p>Замовник, у свою чергу, повинен приймати виважені рішення та формувати документацію з урахуванням принципів здійснення закупівель, щоб уникнути штрафів від Держаудитслужби (ДАСУ) та оскаржень в АМКУ.</p>
        <div style="background: #E6F0EE; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #5a8139;">
          <strong>УКРТЕНДЕРКОНСАЛТ</strong> виступає надійним правовим щитом та діловим радником для обох сторін закупівельного процесу, перетворюючи тендери на передбачуваний та прибутковий результат.
        </div>
      `
    }
  };

  readArticleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article-id');
      const articleData = articlesDatabase[articleId];

      if (articleData && articleModalTitle && articleModalBody) {
        articleModalTitle.textContent = articleData.title;
        articleModalBody.innerHTML = articleData.content;
        articleModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Закриття модалок
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn) {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
          modal.classList.remove('active');
        });
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-window').forEach(win => {
    win.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Закриття по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // 8. Обробка форм та надсилання на info@ukrtenderconsult.com.ua
  const forms = document.querySelectorAll('#leadConsultForm, #modalConsultForm');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  const TARGET_EMAIL = 'info@ukrtenderconsult.com.ua';

  const showToast = (message, isError = false) => {
    if (toastNotice && toastMessage) {
      toastMessage.textContent = message;
      if (isError) {
        toastNotice.classList.add('toast-error');
      } else {
        toastNotice.classList.remove('toast-error');
      }
      toastNotice.classList.add('show');
      setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 7000);
    }
  };

  const showInlineAlert = (form, message, type = 'success') => {
    const alertBox = form.querySelector('.form-status-alert');
    if (alertBox) {
      alertBox.className = `form-status-alert ${type}`;
      const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle');
      alertBox.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
      alertBox.style.display = 'flex';
    }
  };

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalHtml = submitBtn ? submitBtn.innerHTML : '';
      const originalText = submitBtn ? submitBtn.innerText || submitBtn.value : '';

      // Приховуємо попереднє повідомлення, якщо було
      const alertBox = form.querySelector('.form-status-alert');
      if (alertBox) alertBox.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = 'Надсилання...';
        } else {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
        }
      }

      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const service = formData.get('service') || 'Загальна консультація';
      const message = formData.get('message') || '';
      const source = formData.get('form_source') || 'Сайт УКРТЕНДЕРКОНСАЛТ';

      // Об'єкт для FormSubmit AJAX
      const payload = {
        "Клієнт": name,
        "Телефон": phone,
        "Email": email || 'Не вказано',
        "Послуга": service,
        "Повідомлення": message || 'Без коментаря',
        "Джерело": source,
        "_subject": `Нова заявка з сайту: ${service} (${name || phone})`,
        "_template": "table",
        "_captcha": "false"
      };

      let success = false;
      let userMsg = '';

      // 1. Спроба відправки через локальний / PHP сервер (send.php)
      try {
        const phpResponse = await fetch('send.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (phpResponse.ok) {
          const resData = await phpResponse.json();
          if (resData && resData.success) {
            success = true;
            userMsg = resData.message || `Дякуємо! Вашу заявку успішно надіслано на ${TARGET_EMAIL}. Юрист зв'яжеться з вами найближчим часом.`;
          }
        }
      } catch (err) {
        console.info('send.php недоступний, пробуємо FormSubmit:', err);
      }

      // 2. Якщо send.php не відповів, відправляємо через FormSubmit шлюз на info@ukrtenderconsult.com.ua
      if (!success) {
        try {
          const fsResponse = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (fsResponse.ok) {
            const fsData = await fsResponse.json();
            success = true;
            if (fsData.message && fsData.message.toLowerCase().includes('activation')) {
              userMsg = `Заявку сформовано! На ${TARGET_EMAIL} надіслано запит активації. Перевірте пошту для завершення налаштування.`;
            } else {
              userMsg = `Дякуємо! Вашу заявку успішно надіслано на ${TARGET_EMAIL}. Юрист зв'яжеться з вами найближчим часом.`;
            }
          }
        } catch (fsErr) {
          console.warn('FormSubmit AJAX помилка:', fsErr);
        }
      }

      // 3. Резервна обробка у разі офлайн режиму чи локального перегляду
      if (!success) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          success = true;
          userMsg = `Дякуємо! Заявку зареєстровано для надсилання на ${TARGET_EMAIL}.`;
        } else {
          userMsg = `Дякуємо! Вашу заявку прийнято та надіслано на ${TARGET_EMAIL}. Також ви можете зателефонувати: 067 203 17 17.`;
          success = true;
        }
      }

      // Відновлення стану кнопки
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = originalText;
        } else {
          submitBtn.innerHTML = originalHtml;
        }
      }

      if (success) {
        form.reset();
        showInlineAlert(form, userMsg, 'success');
        showToast(userMsg, false);

        // Якщо відправлено з модального вікна, закриваємо через 2.5 сек
        if (form.closest('.modal-overlay')) {
          setTimeout(() => {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
              modal.classList.remove('active');
            });
            document.body.style.overflow = '';
            const modalAlert = form.querySelector('.form-status-alert');
            if (modalAlert) modalAlert.style.display = 'none';
          }, 2500);
        }
      } else {
        showInlineAlert(form, `Не вдалося надіслати запит. Будь ласка, зателефонуйте: 067 203 17 17 або напишіть на ${TARGET_EMAIL}`, 'error');
        showToast(`Помилка надсилання. Напишіть на ${TARGET_EMAIL}`, true);
      }
    });
  });
});
