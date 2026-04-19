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
    // 1.Busy Day Slide
    let html = `
     <p class="title-text">BUSIEST DAYS</p>
     <p class="subtitle-text">y'all really couldn't put the phone down 📱</p>
     <table class="busy-table">
     <thead>
       <tr>
         <th>Rank</th>
         <th class="text-start">Date</th>
         <th class="text-end">Count</th>
        </tr>
      </thead>
      <tbody>`;

    const days = data.group.busiest_days;

    for (let i = 0; i < days.length; i++) {
      const date = days[i][0];
      const count = days[i][1];

      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      emoji_list = ["🥇", "🥈", "🥉", "4", "5"];

      html += `
    <tr class="${rowClass}">
      <td class="rank">${emoji_list[i]}</td>
      <td class="date">${date}</td>
      <td class="count">${count}</td>
    </tr>`;
    }

    html += `
      </tbody>
    </table>`;

    slides.push(html);
    background_classes.push("busy-day");
    // 2. Ghost Slide

    let html2 = `
    <p class="title-text">GHOSTS</p>
    <p class="subtitle-text">who got left on read the most 👻</p>
    <table class="busy-table ghost-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
         <th class="text-end">Ghosting value</th>
       </tr>
     </thead>
     <tbody>`;

    const ghosts = data.group.ghosts;

    for (let i = 0; i < ghosts.length; i++) {
      const name = ghosts[i][0];
      const count = ghosts[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      emoji_list = ["👻", "2", "3", "4", "5"];

      html2 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html2 += `
       </tbody>
     </table>`;

    slides.push(html2);
    background_classes.push("ghost");
    // 3. Hypeness Slide
    let html3 = `
    <p class="title-text">HYPEST PERSONS</p>
    <p class="subtitle-text">always first to reply, no life confirmed ⚡</p>
    <table class="busy-table hype-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Time to respond(min)</th>
       </tr>
     </thead>
     <tbody>`;

    const hypeness = data.group.hype_persons;
    for (let i = 0; i < hypeness.length; i++) {
      const name = hypeness[i][0];
      const count = hypeness[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      emoji_list = ["🔥", "2", "3", "4", "5"];

      html3 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html3 += `
       </tbody>
     </table>`;

    slides.push(html3);
    background_classes.push("hype");
    // 4. Night Owl Slide
    let html4 = `
    <p class="title-text">NIGHT OWLS</p>
    <p class="subtitle-text">who was texting at 3am 🌙</p>
    <table class="busy-table owl-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Night activity value</th>
       </tr>
     </thead>
     <tbody>`;

    const night_owls = data.group.night_owls;
    for (let i = 0; i < night_owls.length; i++) {
      const name = night_owls[i][0];
      const count = night_owls[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      emoji_list = ["🦉", "2", "3", "4", "5"];

      html4 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html4 += `
       </tbody>
     </table>`;

    slides.push(html4);
    background_classes.push("owl");
    // 5. Conversation Starter Slide
    let html5 = `
    <p class="title-text">CONVERSATION STARTERS</p>
    <p class="subtitle-text">who saved the dead chat every time 🔥</p>
    <table class="busy-table convo-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Convo value</th>
       </tr>
     </thead>
     <tbody>`;
    const convo_starters = data.group.conversation_starters;
    for (let i = 0; i < convo_starters.length; i++) {
      const name = convo_starters[i][0];
      const count = convo_starters[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      emoji_list = ["💬", "2", "3", "4", "5"];

      html5 += `
      <tr class="${rowClass}">
        <td class="rank">${emoji_list[i]}</td>
        <td class="date">${name}</td>
        <td class="count">${count}</td>
      </tr>`;
    }

    html5 += `
       </tbody>
     </table>`;

    slides.push(html5);
    background_classes.push("convo");
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