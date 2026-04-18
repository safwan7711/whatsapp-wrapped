document.addEventListener("DOMContentLoaded", async () => {
  landing = document.getElementById("landing");
  slide_screen = document.getElementById("slideshow");
  slide = document.getElementById("stats");
  progress_bar = document.getElementById("progress-bar");
  start_btn = document.getElementById("start-btn");
  response = await fetch("../data.json");
  data = await response.json();
  index = 0;
  slides = []; //Stores html content of each slide
  background_classes = []; // This stores the class for each slide
  function build_group_slides() {
    // Busy Day Slide
    slides.push(`
            <h2 class="fw-bold mb-4">You guys couldn't stay quiet</h2>
            <h1 class="huge-text mb-4">${data.group.busiest_days[0][0]}</h1>
            <p class="lead">was your absolute busiest day(genuinely time to touch some grass)</p>
        `);
    background_classes.push("busy-day");
    slides.push(`
            <h1 class="fw-bold mb-4">Sample Slide</h1>
        `);
    background_classes.push("busy-day");
    slides.push(`
            <h1 class="fw-bold mb-4">Another Sample Slide</h1>
        `);
    background_classes.push("busy-day");
  }
  function render_progress() {
    progress_bar.innerHTML = slides
      .map(
        (_, i) =>
          `<div class="progress-bar-wrapper"><div class="progress-bar-fill" id="progress-${i}"></div></div>`,
      )
      .join("");
  }
  function render_slide(index) {
    if (index >= slides.length) {
      location.reload(); // Return to landing page if it reaches end of slideshow
      return;
    }

    // Restart CSS animation
    slide.classList.remove("slide-anim");
    void slide.offsetWidth;
    slide.classList.add("slide-anim");

    slide.innerHTML = slides[index];
    slide_screen.className = `screen d-flex flex-column w-100 h-100 position-absolute top-0 start-0 z-2 ${background_classes[index % background_classes.length]}`;

    // Update the progress bar
    slides.forEach((_, i) => {
      bar = document.getElementById(`progress-${i}`);
      if (i <= index) bar.classList.add("done");
      else bar.classList.remove("done");
    });
  }
  if (start_btn) {
    start_btn.addEventListener("click", () => {
      build_group_slides();
      render_progress();
      landing.classList.replace("d-flex", "d-none");
      slide_screen.classList.remove("d-none");
      render_slide(index);
    });
  }

  slide_screen.addEventListener("click", (e) => {
    const xpos = e.clientX;
    const swidth = window.innerWidth;
    // If click pos in left 30% slide goes back, else front
    if (xpos < swidth * 0.3) {
      if (index > 0) {
        index--;
        render_slide(index);
      }
    } else {
      index++;
      render_slide(index);
    }
  });
});
