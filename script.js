class DigitalClock {
  constructor() {
    this.is24Hour = false;
    this.currentTimezone = "local";
    this.smoothAnimation = true;
    this.theme = "dark";
    this.accent = "teal";
    this.alarm = null;
    this.alarmTimeout = null;
    this.animationFrame = null;
    this.clockInterval = null;

    // DOM Elements
    this.elements = {
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
      period: document.getElementById("period"),
      separator: document.getElementById("separator"),
      dateDisplay: document.getElementById("dateDisplay"),
      formatToggle: document.getElementById("formatToggle"),
      timezoneSelect: document.getElementById("timezoneSelect"),
      themeToggle: document.getElementById("themeToggle"),
      accentToggle: document.getElementById("accentToggle"),
      animationToggle: document.getElementById("animationToggle"),
      alarmBtn: document.getElementById("alarmBtn"),
      alarmStatus: document.getElementById("alarmStatus"),
      alarmTime: document.getElementById("alarmTime"),
      alarmLabel: document.getElementById("alarmLabel"),
      alarmCancel: document.getElementById("alarmCancel"),
      alarmModal: document.getElementById("alarmModal"),
      alarmTimeInput: document.getElementById("alarmTimeInput"),
      alarmLabelInput: document.getElementById("alarmLabelInput"),
      saveAlarm: document.getElementById("saveAlarm"),
      cancelAlarmModal: document.getElementById("cancelAlarmModal"),
      alarmNotification: document.getElementById("alarmNotification"),
      alarmNotificationText: document.getElementById("alarmNotificationText"),
      snoozeAlarm: document.getElementById("snoozeAlarm"),
      dismissAlarm: document.getElementById("dismissAlarm"),
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.applyTheme();
    this.applyAccent();
    this.updateClock();
    this.startClock();
    this.loadAlarm();
    this.requestNotificationPermission();
    this.setupKeyboardShortcuts();
  }

  loadSettings() {
    const settings = JSON.parse(
      localStorage.getItem("digitalClock:settings") || "{}"
    );
    this.is24Hour = settings.is24Hour || false;
    this.currentTimezone = settings.timezone || "local";
    this.smoothAnimation = settings.smoothAnimation !== false;
    this.theme = settings.theme || "dark";
    this.accent = settings.accent || "teal";

    // Update UI elements
    this.elements.formatToggle.querySelector(".control-label").textContent =
      this.is24Hour ? "24H" : "12H";
    this.elements.timezoneSelect.value = this.currentTimezone;
    this.elements.animationToggle.querySelector(".control-label").textContent =
      this.smoothAnimation ? "Smooth" : "Discrete";
    this.elements.animationToggle.classList.toggle(
      "active",
      this.smoothAnimation
    );
  }

  saveSettings() {
    const settings = {
      is24Hour: this.is24Hour,
      timezone: this.currentTimezone,
      smoothAnimation: this.smoothAnimation,
      theme: this.theme,
      accent: this.accent,
    };
    localStorage.setItem("digitalClock:settings", JSON.stringify(settings));
  }

  setupEventListeners() {
    // Format toggle
    this.elements.formatToggle.addEventListener("click", () => {
      this.toggleFormat();
    });

    // Timezone selector
    this.elements.timezoneSelect.addEventListener("change", (e) => {
      this.setTimezone(e.target.value);
    });

    // Theme toggle
    this.elements.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Accent toggle
    this.elements.accentToggle.addEventListener("click", () => {
      this.toggleAccent();
    });

    // Animation toggle
    this.elements.animationToggle.addEventListener("click", () => {
      this.toggleAnimation();
    });

    // Alarm controls
    this.elements.alarmBtn.addEventListener("click", () => {
      this.showAlarmModal();
    });

    this.elements.alarmCancel.addEventListener("click", () => {
      this.cancelAlarm();
    });

    this.elements.saveAlarm.addEventListener("click", () => {
      this.saveAlarmSettings();
    });

    this.elements.cancelAlarmModal.addEventListener("click", () => {
      this.hideAlarmModal();
    });

    this.elements.snoozeAlarm.addEventListener("click", () => {
      this.snoozeAlarm();
    });

    this.elements.dismissAlarm.addEventListener("click", () => {
      this.dismissAlarm();
    });

    // Modal close on overlay click
    this.elements.alarmModal.addEventListener("click", (e) => {
      if (e.target === this.elements.alarmModal) {
        this.hideAlarmModal();
      }
    });

    this.elements.alarmNotification.addEventListener("click", (e) => {
      if (e.target === this.elements.alarmNotification) {
        this.dismissAlarm();
      }
    });

    // Handle visibility change for performance
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopClock();
      } else {
        this.startClock();
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault();
          this.toggleFormat();
          break;
        case "t":
          e.preventDefault();
          this.toggleTheme();
          break;
        case "a":
          e.preventDefault();
          this.showAlarmModal();
          break;
        case "s":
          e.preventDefault();
          this.toggleAnimation();
          break;
        case "escape":
          this.hideAlarmModal();
          this.dismissAlarm();
          break;
      }
    });
  }

  startClock() {
    if (this.smoothAnimation) {
      this.startSmoothClock();
    } else {
      this.startDiscreteClock();
    }
  }

  stopClock() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  startSmoothClock() {
    this.stopClock();
    const updateSmooth = () => {
      this.updateClock();
      this.animationFrame = requestAnimationFrame(updateSmooth);
    };
    updateSmooth();
  }

  startDiscreteClock() {
    this.stopClock();
    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  updateClock() {
    const now = new Date();
    const timeOptions = {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !this.is24Hour,
    };

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (this.currentTimezone !== "local") {
      timeOptions.timeZone = this.currentTimezone;
      dateOptions.timeZone = this.currentTimezone;
    }

    try {
      const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
      const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);

      const timeParts = timeFormatter.formatToParts(now);
      const dateString = dateFormatter.format(now);

      const hours =
        timeParts.find((part) => part.type === "hour")?.value || "00";
      const minutes =
        timeParts.find((part) => part.type === "minute")?.value || "00";
      const seconds =
        timeParts.find((part) => part.type === "second")?.value || "00";
      const period =
        timeParts.find((part) => part.type === "dayPeriod")?.value || "";

      // Update display with smooth transitions
      this.updateElementText(this.elements.hours, hours);
      this.updateElementText(this.elements.minutes, minutes);
      this.updateElementText(this.elements.seconds, seconds);

      // Handle period display
      if (this.is24Hour) {
        this.elements.period.style.display = "none";
      } else {
        this.elements.period.style.display = "inline";
        this.updateElementText(this.elements.period, period);
      }

      // Update date
      this.updateElementText(this.elements.dateDisplay, dateString);

      // Check alarm
      this.checkAlarm(now);
    } catch (error) {
      console.error("Error updating clock:", error);
      this.currentTimezone = "local";
      this.elements.timezoneSelect.value = "local";
    }
  }

  updateElementText(element, newText) {
    if (element.textContent !== newText) {
      element.textContent = newText;
    }
  }

  toggleFormat() {
    this.is24Hour = !this.is24Hour;
    this.elements.formatToggle.querySelector(".control-label").textContent =
      this.is24Hour ? "24H" : "12H";
    this.elements.formatToggle.classList.add("active");
    setTimeout(() => {
      this.elements.formatToggle.classList.remove("active");
    }, 200);
    this.saveSettings();
    this.updateClock();
  }

  setTimezone(timezone) {
    this.currentTimezone = timezone;
    this.saveSettings();
    this.updateClock();
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme();
    this.saveSettings();
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
  }

  toggleAccent() {
    const accents = [
      "teal",
      "coral",
      "purple",
      "magenta",
      "lawngreen",
      "indigo",
      "maroon",
      "olive",
    ];
    const currentIndex = accents.indexOf(this.accent);
    this.accent = accents[(currentIndex + 1) % accents.length];
    this.applyAccent();
    this.saveSettings();
  }

  applyAccent() {
    document.documentElement.setAttribute("data-accent", this.accent);
  }

  toggleAnimation() {
    this.smoothAnimation = !this.smoothAnimation;
    this.elements.animationToggle.querySelector(".control-label").textContent =
      this.smoothAnimation ? "Smooth" : "Discrete";
    this.elements.animationToggle.classList.toggle(
      "active",
      this.smoothAnimation
    );

    if (this.smoothAnimation) {
      this.elements.separator.classList.remove("no-animation");
    } else {
      this.elements.separator.classList.add("no-animation");
    }

    this.saveSettings();
    this.startClock();
  }

  showAlarmModal() {
    this.elements.alarmModal.style.display = "flex";
    this.elements.alarmTimeInput.focus();

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    this.elements.alarmTimeInput.value = timeString;
  }

  hideAlarmModal() {
    this.elements.alarmModal.style.display = "none";
    this.elements.alarmTimeInput.value = "";
    this.elements.alarmLabelInput.value = "";
  }

  saveAlarmSettings() {
    const time = this.elements.alarmTimeInput.value;
    const label = this.elements.alarmLabelInput.value || "Alarm";

    if (!time) return;

    this.alarm = { time, label };
    this.saveAlarm();
    this.updateAlarmDisplay();
    this.hideAlarmModal();
  }

  saveAlarm() {
    localStorage.setItem("digitalClock:alarm", JSON.stringify(this.alarm));
  }

  loadAlarm() {
    const savedAlarm = localStorage.getItem("digitalClock:alarm");
    if (savedAlarm) {
      this.alarm = JSON.parse(savedAlarm);
      this.updateAlarmDisplay();
    }
  }

  updateAlarmDisplay() {
    if (this.alarm) {
      this.elements.alarmStatus.style.display = "flex";
      this.elements.alarmTime.textContent = this.alarm.time;
      this.elements.alarmLabel.textContent = this.alarm.label;
    } else {
      this.elements.alarmStatus.style.display = "none";
    }
  }

  cancelAlarm() {
    this.alarm = null;
    localStorage.removeItem("digitalClock:alarm");
    this.updateAlarmDisplay();
    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout);
      this.alarmTimeout = null;
    }
  }

  checkAlarm(now) {
    if (!this.alarm) return;

    const [alarmHours, alarmMinutes] = this.alarm.time.split(":").map(Number);
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();

    if (
      currentHours === alarmHours &&
      currentMinutes === alarmMinutes &&
      currentSeconds === 0
    ) {
      this.triggerAlarm();
    }
  }

  triggerAlarm() {
    this.elements.alarmNotificationText.textContent = this.alarm.label;
    this.elements.alarmNotification.style.display = "flex";

    this.playAlarmSound();
    this.showBrowserNotification();

    this.alarmTimeout = setTimeout(() => {
      this.dismissAlarm();
    }, 60000);
  }

  playAlarmSound() {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const playBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };

      // Play multiple beeps
      playBeep();
      setTimeout(playBeep, 600);
      setTimeout(playBeep, 1200);
    } catch (error) {
      console.warn("Could not play alarm sound:", error);
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  showBrowserNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Alarm - Pulse Clock", {
        body: this.alarm.label,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
        tag: "pulse-alarm",
      });

      notification.onclick = () => {
        window.focus();
        this.dismissAlarm();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);
    }
  }

  snoozeAlarm() {
    this.elements.alarmNotification.style.display = "none";

    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout);
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const snoozeTime = now.toTimeString().slice(0, 5);

    this.alarm.time = snoozeTime;
    this.alarm.label = `${this.alarm.label.replace(
      " (Snoozed)",
      ""
    )} (Snoozed)`;
    this.saveAlarm();
    this.updateAlarmDisplay();
  }

  dismissAlarm() {
    this.elements.alarmNotification.style.display = "none";

    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout);
      this.alarmTimeout = null;
    }

    // Remove the alarm completely
    this.cancelAlarm();
  }
}

// Initialize the clock when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.digitalClock = new DigitalClock();
});

